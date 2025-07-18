"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: string
  phone?: string
  email?: string
  nationalId?: string
  province: string
  district: string
  sector: string
  cell: string
  village: string
  symptoms?: string
  diagnosis?: string
  treatment?: string
  bloodPressure?: string
  temperature?: string
  weight?: string
  height?: string
  medicalHistory?: string
  allergies?: string
  medications?: string
  followUpDate?: Date
  notes?: string
  createdAt: Date
  user?: {
    name: string
    email: string
  }
}

interface PrintPatientFormProps {
  patient: Patient
}

export function PrintPatientForm({ patient }: PrintPatientFormProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Form - ${patient.firstName} ${patient.lastName}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
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
            <p>Patient Visit Form</p>
          </div>

          <div class="section">
            <div class="section-header">Patient Information</div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Patient ID:</span>
                  <span class="info-value">${patient.id}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Visit Date:</span>
                  <span class="info-value">${new Date(patient.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">First Name:</span>
                  <span class="info-value">${patient.firstName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Last Name:</span>
                  <span class="info-value">${patient.lastName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date of Birth:</span>
                  <span class="info-value">${new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Gender:</span>
                  <span class="info-value">${patient.gender}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone Number:</span>
                  <span class="info-value">${patient.phone || "N/A"}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">National ID:</span>
                  <span class="info-value">${patient.nationalId || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">Address Information</div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Province:</span>
                  <span class="info-value">${patient.province}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">District:</span>
                  <span class="info-value">${patient.district}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Sector:</span>
                  <span class="info-value">${patient.sector}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Cell:</span>
                  <span class="info-value">${patient.cell}</span>
                </div>
                <div class="info-item full-width">
                  <span class="info-label">Village:</span>
                  <span class="info-value">${patient.village}</span>
                </div>
              </div>
            </div>
          </div>

          ${
            patient.temperature || patient.bloodPressure || patient.weight || patient.height
              ? `
          <div class="section">
            <div class="section-header">Vital Signs</div>
            <div class="section-content">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Temperature (°C):</span>
                  <span class="info-value">${patient.temperature || "N/A"}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Blood Pressure:</span>
                  <span class="info-value">${patient.bloodPressure || "N/A"}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Weight (kg):</span>
                  <span class="info-value">${patient.weight || "N/A"}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Height (cm):</span>
                  <span class="info-value">${patient.height || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }

          <div class="section">
            <div class="section-header">Medical Information</div>
            <div class="section-content">
              <div class="info-item full-width">
                <span class="info-label">Symptoms:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 60px;">
                  ${patient.symptoms || "N/A"}
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Diagnosis:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 40px;">
                  ${patient.diagnosis || "N/A"}
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Treatment:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 60px;">
                  ${patient.treatment || "N/A"}
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Notes:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 60px;">
                  ${patient.notes || "N/A"}
                </div>
              </div>
              ${
                patient.followUpDate
                  ? `
              <div class="info-item">
                <span class="info-label">Follow-up Date:</span>
                <span class="info-value">${new Date(patient.followUpDate).toLocaleDateString()}</span>
              </div>
              `
                  : ""
              }
            </div>
          </div>

          ${
            patient.medicalHistory || patient.allergies || patient.medications
              ? `
          <div class="section">
            <div class="section-header">Medical History</div>
            <div class="section-content">
              <div class="info-item full-width">
                <span class="info-label">Medical History:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 40px;">
                  ${patient.medicalHistory || "None reported"}
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Allergies:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 40px;">
                  ${patient.allergies || "None reported"}
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Current Medications:</span>
                <div class="info-value" style="white-space: pre-wrap; min-height: 40px;">
                  ${patient.medications || "None reported"}
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <p><strong>CHW Signature</strong></p>
              <p>${patient.user?.name || "Community Health Worker"}</p>
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
      Print Form
    </Button>
  )
}
