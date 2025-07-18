"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface HealthReport {
  id: string
  title: string
  description: string
  location: string
  status: "PENDING" | "REVIEWED" | "RESOLVED"
  createdAt: Date
  user?: {
    name: string
    email: string
  }
}

interface PrintAllReportsProps {
  reports: HealthReport[]
  title?: string
}

export function PrintAllReports({ reports, title = "Health Reports Summary" }: PrintAllReportsProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const totalReports = reports.length
    const pendingReports = reports.filter((r) => r.status === "PENDING").length
    const reviewedReports = reports.filter((r) => r.status === "REVIEWED").length
    const resolvedReports = reports.filter((r) => r.status === "RESOLVED").length

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.4;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #0066cc;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #0066cc;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #ddd;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #0066cc;
            }
            .stat-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
            }
            .overview-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .overview-table th,
            .overview-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .overview-table th {
              background: #f8f9fa;
              font-weight: bold;
            }
            .status {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status.pending {
              background: #fff3cd;
              color: #856404;
            }
            .status.reviewed {
              background: #d1ecf1;
              color: #0c5460;
            }
            .status.resolved {
              background: #d4edda;
              color: #155724;
            }
            .report-detail {
              margin-bottom: 30px;
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
              page-break-inside: avoid;
            }
            .report-header {
              background: #f8f9fa;
              padding: 15px;
              border-bottom: 1px solid #ddd;
            }
            .report-content {
              padding: 15px;
            }
            .report-meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            .meta-item {
              font-size: 12px;
            }
            .meta-label {
              font-weight: bold;
              color: #555;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rwanda Health Information System</h1>
            <p>Ministry of Health - Republic of Rwanda</p>
            <p>${title}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${totalReports}</div>
              <div class="stat-label">Total Reports</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${pendingReports}</div>
              <div class="stat-label">Pending</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${reviewedReports}</div>
              <div class="stat-label">Reviewed</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${resolvedReports}</div>
              <div class="stat-label">Resolved</div>
            </div>
          </div>

          <h2>Reports Overview</h2>
          <table class="overview-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Reporter</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${reports
                .map(
                  (report) => `
                <tr>
                  <td>${report.id.substring(0, 8)}...</td>
                  <td>${report.title}</td>
                  <td>${report.user?.name || "N/A"}</td>
                  <td>${report.location}</td>
                  <td><span class="status ${report.status.toLowerCase()}">${report.status}</span></td>
                  <td>${new Date(report.createdAt).toLocaleDateString()}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="page-break"></div>
          <h2>Detailed Reports</h2>
          
          ${reports
            .map(
              (report, index) => `
            <div class="report-detail">
              <div class="report-header">
                <h3>Report #${index + 1}: ${report.title}</h3>
              </div>
              <div class="report-content">
                <div class="report-meta">
                  <div class="meta-item">
                    <span class="meta-label">ID:</span> ${report.id}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Status:</span> 
                    <span class="status ${report.status.toLowerCase()}">${report.status}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Location:</span> ${report.location}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Date:</span> ${new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  ${
                    report.user
                      ? `
                  <div class="meta-item">
                    <span class="meta-label">Reporter:</span> ${report.user.name}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Contact:</span> ${report.user.email}
                  </div>
                  `
                      : ""
                  }
                </div>
                <div>
                  <div class="meta-label">Description:</div>
                  <div style="white-space: pre-wrap; margin-top: 10px; line-height: 1.6;">
                    ${report.description}
                  </div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}

          <div class="footer">
            <p>This document was generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p>Rwanda Health Information Enhancement System</p>
            <p>Total Reports: ${totalReports} | Pending: ${pendingReports} | Reviewed: ${reviewedReports} | Resolved: ${resolvedReports}</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  if (reports.length === 0) {
    return null
  }

  return (
    <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 bg-transparent">
      <Printer className="h-4 w-4" />
      Print All Reports ({reports.length})
    </Button>
  )
}
