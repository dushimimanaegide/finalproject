import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UsersIcon, FileTextIcon, ClipboardCheckIcon, ActivityIcon, TrendingUpIcon } from "lucide-react"

interface AnalyticsStatsProps {
  totalUsers: number
  totalReports: number
  totalVisits: number
  usersByRole: Array<{ role: string; _count: { id: number } }>
  reportsByStatus: Array<{ status: string; _count: { id: number } }>
}

export function AnalyticsStats({
  totalUsers,
  totalReports,
  totalVisits,
  usersByRole,
  reportsByStatus,
}: AnalyticsStatsProps) {
  const pendingReports = reportsByStatus.find((r) => r.status === "PENDING")?._count.id || 0
  const completedReports = reportsByStatus.find((r) => r.status === "COMPLETED")?._count.id || 0
  const adminCount = usersByRole.find((u) => u.role === "ADMIN")?._count.id || 0
  const chwCount = usersByRole.find((u) => u.role === "CHW")?._count.id || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{adminCount} Admins</Badge>
            <Badge variant="outline">{chwCount} CHWs</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Reports</CardTitle>
          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReports}</div>
          <div className="flex gap-2 mt-2">
            <Badge variant="default">{completedReports} Completed</Badge>
            {pendingReports > 0 && <Badge variant="destructive">{pendingReports} Pending</Badge>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patient Visits</CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisits}</div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUpIcon className="h-3 w-3 inline mr-1" />
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <ClipboardCheckIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">98.5%</div>
          <p className="text-xs text-muted-foreground mt-2">System uptime this month</p>
        </CardContent>
      </Card>
    </div>
  )
}
