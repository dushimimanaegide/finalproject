"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, AlertCircle } from "lucide-react"

interface HealthReport {
  id: string
  title: string
  description: string
  location: string
  status: "PENDING" | "REVIEWED" | "RESOLVED"
  createdAt: Date
}

interface CHWReportsListProps {
  reports: HealthReport[]
}

export function CHWReportsList({ reports }: CHWReportsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null)

  // Filter reports based on search query
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get status badge variant
  const getStatusBadge = (status: string) => {
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

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (reports.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No health reports found.</p>
        <Button className="mt-4" variant="outline" asChild>
          <a href="/dashboard/chw/new-report">Create New Report</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports by title, location, or description..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No reports match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">View details</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        {selectedReport && (
                          <>
                            <DialogHeader>
                              <DialogTitle>{selectedReport.title}</DialogTitle>
                              <DialogDescription>Submitted on {formatDate(selectedReport.createdAt)}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status:</span>
                                <span>{getStatusBadge(selectedReport.status)}</span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-sm font-medium">Location:</span>
                                <p className="text-sm">{selectedReport.location}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-sm font-medium">Description:</span>
                                <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                              </div>

                              {selectedReport.status === "PENDING" && (
                                <div className="flex items-center mt-4 p-3 bg-yellow-50 rounded-md">
                                  <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                                  <p className="text-sm text-yellow-700">
                                    This report is pending review by an administrator.
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
