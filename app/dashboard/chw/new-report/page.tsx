import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateHealthReportForm } from "@/components/dashboard/create-health-report-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewReportPage() {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Health Report</h1>
        <p className="text-muted-foreground mt-1">Submit a new health report for review</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Report Details</CardTitle>
          <CardDescription>Provide detailed information about the health issue you've observed</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateHealthReportForm />
        </CardContent>
      </Card>
    </div>
  )
}
