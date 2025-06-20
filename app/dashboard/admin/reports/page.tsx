import { requireAdmin } from "@/lib/auth"
import { HealthReportsList } from "@/components/dashboard/health-reports-list"
import { ReportsFilter } from "@/components/dashboard/reports-filter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getDateRangeFromFilter } from "@/lib/date-filters"
import { prisma } from "@/lib/prisma"

interface AdminReportsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  await requireAdmin()

  // Await searchParams before accessing properties
  const params = await searchParams

  // Get filter parameters
  const filter = (params.filter as string) || "all"
  const fromDate = params.from as string
  const toDate = params.to as string

  // Get date range based on filter
  const { startDate, endDate } = getDateRangeFromFilter(filter, fromDate, toDate)

  // Build query conditions
  let dateCondition = {}
  if (startDate && endDate) {
    dateCondition = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }
  } else if (startDate) {
    dateCondition = {
      createdAt: {
        gte: startDate,
      },
    }
  } else if (endDate) {
    dateCondition = {
      createdAt: {
        lte: endDate,
      },
    }
  }

  // Fetch reports with filter
  const healthReports = await prisma.healthReport.findMany({
    where: dateCondition,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  // Calculate statistics
  const pendingReports = healthReports.filter((report) => report.status === "PENDING").length
  const reviewedReports = healthReports.filter((report) => report.status === "REVIEWED").length
  const resolvedReports = healthReports.filter((report) => report.status === "RESOLVED").length

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
        <h1 className="text-3xl font-bold">Health Reports</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage health reports submitted by Community Health Workers
        </p>
      </div>

      <ReportsFilter />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>{filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReports}</div>
            <p className="text-sm text-muted-foreground">Reports awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reviewed</CardTitle>
            <CardDescription>{filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviewedReports}</div>
            <p className="text-sm text-muted-foreground">Reports in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resolved</CardTitle>
            <CardDescription>{filterLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resolvedReports}</div>
            <p className="text-sm text-muted-foreground">Completed reports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Reports</CardTitle>
          <CardDescription>
            {filter !== "all"
              ? `Showing reports for ${filterLabel}`
              : "View and manage all health reports from Community Health Workers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HealthReportsList reports={healthReports} isAdmin={true} />
        </CardContent>
      </Card>
    </div>
  )
}
