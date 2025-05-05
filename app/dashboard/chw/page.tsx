import { requireAuth } from "@/lib/auth"
import { CHWDashboardStats } from "@/components/dashboard/chw-dashboard-stats"
import { HealthReportsList } from "@/components/dashboard/health-reports-list"
import { PatientVisitsList } from "@/components/dashboard/patient-visits-list"
import { CreateHealthReportForm } from "@/components/dashboard/create-health-report-form"
import { CreatePatientVisitForm } from "@/components/dashboard/create-patient-visit-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from "@/lib/prisma"

export default async function CHWDashboardPage() {
  const user = await requireAuth()

  const [healthReports, patientVisits] = await Promise.all([
    prisma.healthReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.patientVisit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Community Health Worker Dashboard</h1>

      <CHWDashboardStats
        totalReports={healthReports.length}
        pendingReports={healthReports.filter((report) => report.status === "PENDING").length}
        totalVisits={patientVisits.length}
      />

      <Tabs defaultValue="reports">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Health Reports</TabsTrigger>
          <TabsTrigger value="visits">Patient Visits</TabsTrigger>
          <TabsTrigger value="new-report">New Report</TabsTrigger>
          <TabsTrigger value="new-visit">New Patient Visit</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Health Reports</h2>
          <HealthReportsList reports={healthReports} isAdmin={false} />
        </TabsContent>

        <TabsContent value="visits" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Patient Visits</h2>
          <PatientVisitsList visits={patientVisits} />
        </TabsContent>

        <TabsContent value="new-report" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Create New Health Report</h2>
          <CreateHealthReportForm />
        </TabsContent>

        <TabsContent value="new-visit" className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Record New Patient Visit</h2>
          <CreatePatientVisitForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
