import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, ClipboardCheckIcon, ActivityIcon } from "lucide-react"

interface CHWDashboardStatsProps {
  totalReports: number
  pendingReports: number
  totalVisits: number
}

export function CHWDashboardStats({ totalReports, pendingReports, totalVisits }: CHWDashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Reports</CardTitle>
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
          <p className="text-xs text-muted-foreground">Patient visits recorded</p>
        </CardContent>
      </Card>
    </div>
  )
}
