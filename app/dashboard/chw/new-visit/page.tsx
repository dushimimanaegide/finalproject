import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePatientVisitForm } from "@/components/dashboard/create-patient-visit-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewVisitPage() {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Record Patient Visit</h1>
        <p className="text-muted-foreground mt-1">Document details about a patient visit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Visit Details</CardTitle>
          <CardDescription>Record information about the patient, symptoms, diagnosis, and treatment</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePatientVisitForm />
        </CardContent>
      </Card>
    </div>
  )
}
