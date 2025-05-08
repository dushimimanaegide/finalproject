import { requireAdmin } from "@/lib/auth"
import { HealthReportsList } from "@/components/dashboard/health-reports-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export default async function AdminReportsPage() {
  await requireAdmin()

  const healthReports = await prisma.healthReport.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  const pendingReports = healthReports.filter((report) => report.status === "PENDING").length
  const reviewedReports = healthReports.filter((report) => report.status === "REVIEWED").length
  const resolvedReports = healthReports.filter((report) => report.status === "RESOLVED").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health Reports</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage health reports submitted by Community Health Workers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReports}</div>
            <p className="text-sm text-muted-foreground">Reports awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviewedReports}</div>
            <p className="text-sm text-muted-foreground">Reports in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resolvedReports}</div>
            <p className="text-sm text-muted-foreground">Completed reports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Health Reports</CardTitle>
          <CardDescription>View and manage all health reports from Community Health Workers</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthReportsList reports={healthReports} isAdmin={true} />
        </CardContent>
      </Card>
    </div>
  )
}
