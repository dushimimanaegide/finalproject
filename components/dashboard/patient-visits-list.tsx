"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No visits match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredVisits.map((visit) => (
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
