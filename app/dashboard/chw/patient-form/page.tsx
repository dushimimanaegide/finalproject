import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PatientIntakeForm } from "@/components/dashboard/patient-intake-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PatientFormPage() {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  // Get current date in ISO format for the form
  const currentDate = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Patient Intake Form</h1>
        <p className="text-muted-foreground mt-1">
          Record comprehensive patient information for medical assessment and follow-up
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>Please complete all required fields with accurate patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientIntakeForm currentDate={currentDate} />
        </CardContent>
      </Card>
    </div>
  )
}
