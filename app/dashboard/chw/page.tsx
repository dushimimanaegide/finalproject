import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CHWDashboardStats } from "@/components/dashboard/chw-dashboard-stats"
import { HealthReportsList } from "@/components/dashboard/health-reports-list"
import { PatientVisitsList } from "@/components/dashboard/patient-visits-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheckIcon, ActivityIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function CHWDashboardPage() {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  const [healthReports, patientVisits] = await Promise.all([
    prisma.healthReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.patientVisit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Health Worker Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.name}. Here's a summary of your activities.</p>
      </div>

      <CHWDashboardStats
        totalReports={healthReports.length}
        pendingReports={healthReports.filter((report) => report.status === "PENDING").length}
        totalVisits={patientVisits.length}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Health Reports</CardTitle>
            <CardDescription>Your most recent health reports</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthReportsList reports={healthReports} isAdmin={false} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Visits</CardTitle>
            <CardDescription>Your most recent patient visits</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientVisitsList visits={patientVisits} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Create new reports or record patient visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/chw/new-report">
              <Button className="w-full">
                <ClipboardCheckIcon className="mr-2 h-4 w-4" />
                Create Health Report
              </Button>
            </Link>
            <Link href="/dashboard/chw/new-visit">
              <Button className="w-full" variant="outline">
                <ActivityIcon className="mr-2 h-4 w-4" />
                Record Patient Visit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
