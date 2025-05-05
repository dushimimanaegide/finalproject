import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  if (visits.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/50">
        <p className="text-muted-foreground">No patient visits recorded.</p>
      </div>
    )
  }

  return (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell className="font-medium">{visit.patientName}</TableCell>
              <TableCell>{visit.patientAge}</TableCell>
              <TableCell>{visit.symptoms}</TableCell>
              <TableCell>{visit.diagnosis || "N/A"}</TableCell>
              <TableCell>{visit.treatment || "N/A"}</TableCell>
              <TableCell>{visit.location}</TableCell>
              <TableCell>{new Date(visit.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
