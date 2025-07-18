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
    phone?: string
  }
}

interface PrintHealthReportProps {
  report: HealthReport
}

export function PrintHealthReport({ report }: PrintHealthReportProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Health Report - ${report.title}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
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
            .section {
              margin-bottom: 25px;
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
            }
            .section-header {
              background: #f8f9fa;
              padding: 12px 20px;
              border-bottom: 1px solid #ddd;
              font-weight: bold;
              color: #0066cc;
            }
            .section-content {
              padding: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            .info-item {
              display: flex;
              flex-direction: column;
            }
            .info-label {
              font-weight: bold;
              color: #555;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .info-value {
              color: #333;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
              min-height: 20px;
            }
            .full-width {
              grid-column: 1 / -1;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status.pending {
              background: #fff3cd;
              color: #856404;
              border: 1px solid #ffeaa7;
            }
            .status.reviewed {
              background: #d1ecf1;
              color: #0c5460;
              border: 1px solid #bee5eb;
            }
            .status.resolved {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .signature-section {
              margin-top: 40px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
            }
            .signature-box {
              text-align: center;
            }
            .signature-line {
              border-bottom: 2px solid #333;
              margin-bottom: 10px;
              height: 40px;
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
            <p>Community Health Report</p>
          </div>

          <div class="section">
            <div class="section-header">Report Information</div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Report ID:</span>
                  <span class="info-value">${report.id}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date Submitted:</span>
                  <span class="info-value">${new Date(report.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Location:</span>
                  <span class="info-value">${report.location}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <span class="status ${report.status.toLowerCase()}">${report.status}</span>
                </div>
                ${
                  report.user
                    ? `
                <div class="info-item">
                  <span class="info-label">Reported By:</span>
                  <span class="info-value">${report.user.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Contact:</span>
                  <span class="info-value">${report.user.email}</span>
                </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">Report Details</div>
            <div class="section-content">
              <div class="info-item full-width">
                <span class="info-label">Title:</span>
                <div class="info-value" style="font-size: 16px; font-weight: bold;">
                  ${report.title}
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Description:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 100px; line-height: 1.8;">
                  ${report.description}
                </div>
              </div>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p><strong>CHW Signature</strong></p>
              <p>${report.user?.name || "Community Health Worker"}</p>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <p><strong>Date</strong></p>
              <p>${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="footer">
            <p>This document was generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p>Rwanda Health Information Enhancement System</p>
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

  return (
    <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2 bg-transparent">
      <Printer className="h-4 w-4" />
      Print Report
    </Button>
  )
}
