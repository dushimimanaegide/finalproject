"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { PrintPatientForm } from "@/components/print/print-patient-form"

interface PatientVisit {
  id: string
  patientName: string
  patientAge: number
  symptoms: string
  diagnosis: string | null
  treatment: string | null
  followUpDate: Date | null
  location: string
  createdAt: Date
  // Additional fields for printing
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  gender?: string
  phone?: string
  email?: string
  nationalId?: string
  province?: string
  district?: string
  sector?: string
  cell?: string
  village?: string
  bloodPressure?: string
  temperature?: string
  weight?: string
  height?: string
  medicalHistory?: string
  allergies?: string
  medications?: string
  notes?: string
  user?: {
    name: string
    email: string
  }
}

interface PatientVisitsListProps {
  visits: PatientVisit[]
}

export function PatientVisitsList({ visits }: PatientVisitsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter visits based on search query
  const filteredVisits = visits.filter(
    (visit) =>
      visit.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (visit.diagnosis && visit.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())) ||
      visit.symptoms.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (visits.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No patient visits recorded.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient name, location, diagnosis, or symptoms..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Symptoms</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Follow-up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No visits match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => {
                // Transform visit data to match Patient interface for printing
                const patientForPrint = {
                  id: visit.id,
                  firstName: visit.firstName || visit.patientName.split(" ")[0] || visit.patientName,
                  lastName: visit.lastName || visit.patientName.split(" ").slice(1).join(" ") || "",
                  dateOfBirth: visit.dateOfBirth || new Date(new Date().getFullYear() - visit.patientAge, 0, 1),
                  gender: visit.gender || "Not specified",
                  phone: visit.phone,
                  email: visit.email,
                  nationalId: visit.nationalId,
                  province: visit.province || "Not specified",
                  district: visit.district || "Not specified",
                  sector: visit.sector || "Not specified",
                  cell: visit.cell || "Not specified",
                  village: visit.village || visit.location,
                  symptoms: visit.symptoms,
                  diagnosis: visit.diagnosis || undefined,
                  treatment: visit.treatment || undefined,
                  bloodPressure: visit.bloodPressure,
                  temperature: visit.temperature,
                  weight: visit.weight,
                  height: visit.height,
                  medicalHistory: visit.medicalHistory,
                  allergies: visit.allergies,
                  medications: visit.medications,
                  followUpDate: visit.followUpDate || undefined,
                  notes: visit.notes,
                  createdAt: visit.createdAt,
                  user: visit.user,
                }

                return (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">{visit.patientName}</TableCell>
                    <TableCell>{visit.patientAge}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={visit.symptoms}>
                      {visit.symptoms}
                    </TableCell>
                    <TableCell>{visit.diagnosis || "N/A"}</TableCell>
                    <TableCell>{visit.treatment || "N/A"}</TableCell>
                    <TableCell>{visit.location}</TableCell>
                    <TableCell>{new Date(visit.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {visit.followUpDate ? new Date(visit.followUpDate).toLocaleDateString() : "None"}
                    </TableCell>
                    <TableCell className="text-right">
                      <PrintPatientForm patient={patientForPrint} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
