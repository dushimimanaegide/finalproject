import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, FileTextIcon, ClipboardCheckIcon, ActivityIcon } from "lucide-react"

interface AdminDashboardStatsProps {
  totalUsers: number
  totalReports: number
  pendingReports: number
  totalVisits: number
}

export function AdminDashboardStats({
  totalUsers,
  totalReports,
  pendingReports,
  totalVisits,
}: AdminDashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered health workers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReports}</div>
          <p className="text-xs text-muted-foreground">Health reports submitted</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          <ClipboardCheckIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReports}</div>
          <p className="text-xs text-muted-foreground">Reports awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Patient Visits</CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVisits}</div>
          <p className="text-xs text-muted-foreground">Total patient visits recorded</p>
        </CardContent>
      </Card>
    </div>
  )
}
