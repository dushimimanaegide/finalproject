"use client"

import { useState } from "react"
import { updateHealthReportStatusAction } from "@/app/actions/health-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface HealthReport {
  id: string
  title: string
  description: string
  location: string
  status: "PENDING" | "REVIEWED" | "RESOLVED"
  createdAt: Date
  user?: {
    name: string
  }
}

interface HealthReportsListProps {
  reports: HealthReport[]
  isAdmin: boolean
}

export function HealthReportsList({ reports, isAdmin }: HealthReportsListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleStatusChange(id: string, status: "PENDING" | "REVIEWED" | "RESOLVED") {
    setUpdatingId(id)

    const result = await updateHealthReportStatusAction(id, status)

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else if (result.success) {
      toast({
        title: "Success",
        description: result.success,
      })
    }

    setUpdatingId(null)
  }

  if (reports.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No health reports found.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {isAdmin && <TableHead>Reported By</TableHead>}
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              {isAdmin && <TableCell>{report.user?.name}</TableCell>}
              <TableCell>{report.location}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    report.status === "PENDING" ? "outline" : report.status === "REVIEWED" ? "secondary" : "default"
                  }
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
              {isAdmin && (
                <TableCell>
                  <Select
                    defaultValue={report.status}
                    onValueChange={(value) =>
                      handleStatusChange(report.id, value as "PENDING" | "REVIEWED" | "RESOLVED")
                    }
                    disabled={updatingId === report.id}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REVIEWED">Reviewed</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
