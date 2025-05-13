import { Badge } from "@/components/ui/badge"

interface ReportStatusBadgeProps {
  status: "PENDING" | "REVIEWED" | "RESOLVED"
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="bg-yellow-50">
          PENDING
        </Badge>
      )
    case "REVIEWED":
      return <Badge variant="secondary">REVIEWED</Badge>
    case "RESOLVED":
      return <Badge variant="default">RESOLVED</Badge>
    default:
      return <Badge variant="outline">UNKNOWN</Badge>
  }
}
