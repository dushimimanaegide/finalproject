import { requireAdmin } from "@/lib/auth"
import { AdminDashboardStats } from "@/components/dashboard/admin-dashboard-stats"
import { HealthReportsList } from "@/components/dashboard/health-reports-list"
import { UsersList } from "@/components/dashboard/users-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
// comment
export default async function AdminDashboardPage() {
  const admin = await requireAdmin()

  const [users, healthReports, patientVisits] = await Promise.all([
    prisma.user.count(),
    prisma.healthReport.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.patientVisit.count(),
  ])

  const pendingReports = healthReports.filter((report) => report.status === "PENDING").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {admin.name}. Here's what's happening in your health system.
        </p>
      </div>

      <AdminDashboardStats
        totalUsers={users}
        totalReports={healthReports.length}
        pendingReports={pendingReports}
        totalVisits={patientVisits}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Health Reports</CardTitle>
            <CardDescription>The latest health reports submitted by CHWs</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthReportsList reports={healthReports} isAdmin={true} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>Manage community health workers and administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
