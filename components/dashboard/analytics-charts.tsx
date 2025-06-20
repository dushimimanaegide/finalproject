import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3Icon, LineChartIcon } from "lucide-react"

interface AnalyticsChartsProps {
  monthlyStats: Array<{ createdAt: Date; _count: { id: number } }>
  visitsByMonth: Array<{ createdAt: Date; _count: { id: number } }>
}

export function AnalyticsCharts({ monthlyStats, visitsByMonth }: AnalyticsChartsProps) {
  // Process data for charts (simplified for demo)
  const reportsData = monthlyStats.slice(0, 6).reverse()
  const visitsData = visitsByMonth.slice(0, 6).reverse()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5" />
            Reports Trend
          </CardTitle>
          <CardDescription>Health reports submitted over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {reportsData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="bg-blue-500 rounded-t w-8 min-h-[20px]"
                  style={{
                    height: `${Math.max((data._count.id / Math.max(...reportsData.map((d) => d._count.id))) * 200, 20)}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(data.createdAt).toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-sm font-medium">{data._count.id}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5" />
            Patient Visits
          </CardTitle>
          <CardDescription>Patient visits recorded over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {visitsData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="bg-green-500 rounded-t w-8 min-h-[20px]"
                  style={{
                    height: `${Math.max((data._count.id / Math.max(...visitsData.map((d) => d._count.id))) * 200, 20)}px`,
                  }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(data.createdAt).toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-sm font-medium">{data._count.id}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
