import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUpIcon, TrendingDownIcon, AlertTriangleIcon } from "lucide-react"

interface HealthTrendsProps {
  topConditions: Array<{ primaryCondition: string; _count: { id: number } }>
  monthlyStats: Array<{ createdAt: Date; _count: { id: number } }>
  reportsByStatus: Array<{ status: string; _count: { id: number } }>
}

export function HealthTrends({ topConditions, monthlyStats, reportsByStatus }: HealthTrendsProps) {
  const totalReports = reportsByStatus.reduce((sum, status) => sum + status._count.id, 0)
  const maxConditionCount = Math.max(...topConditions.map((c) => c._count.id))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Health Conditions</CardTitle>
          <CardDescription>Most frequently reported conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topConditions.slice(0, 8).map((condition, index) => (
            <div key={condition.primaryCondition} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{condition.primaryCondition || "Unspecified"}</span>
                <Badge variant="outline">{condition._count.id} cases</Badge>
              </div>
              <Progress value={(condition._count.id / maxConditionCount) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Alerts & Trends</CardTitle>
          <CardDescription>Important health patterns and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-red-50 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangleIcon className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">High Priority Alert</span>
            </div>
            <p className="text-sm text-red-700">
              Malaria cases increased by 23% this month. Consider enhanced prevention measures.
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Trending Up</span>
            </div>
            <p className="text-sm text-yellow-700">Respiratory infections showing upward trend in urban areas.</p>
          </div>

          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDownIcon className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Positive Trend</span>
            </div>
            <p className="text-sm text-green-700">Vaccination coverage improved by 15% compared to last quarter.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Report Status Distribution</h4>
            {reportsByStatus.map((status) => (
              <div key={status.status} className="flex justify-between items-center">
                <span className="text-sm">{status.status}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(status._count.id / totalReports) * 100} className="w-20 h-2" />
                  <span className="text-sm font-medium">{status._count.id}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
