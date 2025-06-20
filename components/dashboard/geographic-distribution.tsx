import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, TrendingUpIcon } from "lucide-react"

interface GeographicData {
  district: string
  reports: number
  visits: number
}

interface GeographicDistributionProps {
  data: GeographicData[]
}

export function GeographicDistribution({ data }: GeographicDistributionProps) {
  const totalReports = data.reduce((sum, item) => sum + item.reports, 0)
  const totalVisits = data.reduce((sum, item) => sum + item.visits, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Reports by District
          </CardTitle>
          <CardDescription>Geographic distribution of health reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((district, index) => (
            <div key={district.district} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-medium">{district.district}</span>
                <div className="text-sm text-muted-foreground">
                  {((district.reports / totalReports) * 100).toFixed(1)}% of total reports
                </div>
              </div>
              <Badge variant={index < 2 ? "default" : "outline"}>{district.reports} reports</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5" />
            Patient Visits by District
          </CardTitle>
          <CardDescription>Geographic distribution of patient visits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((district, index) => (
            <div key={district.district} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-medium">{district.district}</span>
                <div className="text-sm text-muted-foreground">
                  {((district.visits / totalVisits) * 100).toFixed(1)}% of total visits
                </div>
              </div>
              <Badge variant={index < 2 ? "default" : "outline"}>{district.visits} visits</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
