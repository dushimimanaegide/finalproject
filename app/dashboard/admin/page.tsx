import { requireAdmin } from "@/lib/auth"
import { AdminDashboardStats } from "@/components/dashboard/admin-dashboard-stats"
import { HealthReportsList } from "@/components/dashboard/health-reports-list"
import { UsersList } from "@/components/dashboard/users-list"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const admin = await requireAdmin()

  const [users, healthReports, patientVisits] = await Promise.all([
    prisma.user.count(),
   prisma.healthReport.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
   prisma.patientVisit.count(),
  ])

  const pendingReports = healthReports.filter((report) => report.status === "PENDING").length

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <AdminDashboardStats
        totalUsers={users}
        totalReports={healthReports.length}
        pendingReports={pendingReports}
        totalVisits={patientVisits}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Health Reports</h2>
          <HealthReportsList reports={healthReports.slice(0, 5)} isAdmin={true} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Users Management</h2>
          <UsersList />
        </div>
      </div>
    </div>
  )
}
