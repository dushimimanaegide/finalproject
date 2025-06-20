import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ReportsFilter } from "@/components/dashboard/reports-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PatientVisitsList } from "@/components/dashboard/patient-visits-list"

import { getDateRangeFromFilter } from "@/lib/date-filters"
import { prisma } from "@/lib/prisma"

interface CHWVisitsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CHWVisitsPage({ searchParams }: CHWVisitsPageProps) {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  // Await searchParams before accessing properties
  const params = await searchParams

  // Get filter parameters
  const filter = (params.filter as string) || "all"
  const fromDate = params.from as string
  const toDate = params.to as string

  // Get date range based on filter
  const { startDate, endDate } = getDateRangeFromFilter(filter, fromDate, toDate)

  // Build query conditions
  const dateCondition: any = {
    userId: user.id, // Only fetch visits for the current CHW
  }

  if (startDate && endDate) {
    dateCondition.createdAt = {
      gte: startDate,
      lte: endDate,
    }
  } else if (startDate) {
    dateCondition.createdAt = {
      gte: startDate,
    }
  } else if (endDate) {
    dateCondition.createdAt = {
      lte: endDate,
    }
  }

  // Fetch patient visits with filter
  const patientVisits = await prisma.patientVisit.findMany({
    where: dateCondition,
    orderBy: { createdAt: "desc" },
  })

  // Calculate statistics
  const totalVisits = patientVisits.length
  const uniquePatients = new Set(patientVisits.map((visit) => visit.patientName)).size
  const followUpsNeeded = patientVisits.filter(
    (visit) => visit.followUpDate && new Date(visit.followUpDate) >= new Date(),
  ).length

  // Format date range for display
  let filterLabel = "All Time"
  if (filter === "today") {
    filterLabel = "Today"
  } else if (filter === "yesterday") {
    filterLabel = "Yesterday"
  } else if (filter === "this-week") {
    filterLabel = "This Week"
  } else if (filter === "this-month") {
    filterLabel = "This Month"
  } else if (filter === "custom" && (fromDate || toDate)) {
    if (fromDate && toDate) {
      filterLabel = `${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`
    } else if (fromDate) {
      filterLabel = `From ${new Date(fromDate).toLocaleDateString()}`
    } else if (toDate) {
      filterLabel = `Until ${new Date(toDate).toLocaleDateString()}`
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patient Visits</h1>
        <p className="text-muted-foreground mt-1">View and manage your patient visit records</p>
      </div>

      <ReportsFilter />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Visits</CardTitle>
            <CardDescription>{filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVisits}</div>
            <p className="text-sm text-muted-foreground">Patient visits recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unique Patients</CardTitle>
            <CardDescription>{filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniquePatients}</div>
            <p className="text-sm text-muted-foreground">Different patients seen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Follow-ups</CardTitle>
            <CardDescription>{filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{followUpsNeeded}</div>
            <p className="text-sm text-muted-foreground">Upcoming follow-up visits</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>
              {filter !== "all"
                ? `Showing visits for ${filterLabel}`
                : "View and manage all your patient visit records"}
            </CardDescription>
          </div>
          <Button asChild>
            <a href="/dashboard/chw/new-visit">New Visit</a>
          </Button>
        </CardHeader>
        <CardContent>
          <PatientVisitsList visits={patientVisits} />
        </CardContent>
      </Card>
    </div>
  )
}
