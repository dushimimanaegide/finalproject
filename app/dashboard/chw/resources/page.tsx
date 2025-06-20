import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BookOpenIcon,
  PhoneIcon,
  AlertTriangleIcon,
  HeartIcon,
  FileTextIcon,
  VideoIcon,
  SearchIcon,
  DownloadIcon,
  ExternalLinkIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  StethoscopeIcon,
  PillIcon,
  BabyIcon,
  ShieldIcon,
} from "lucide-react"

export default async function CHWResourcesPage() {
  const user = await requireAuth()

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  }

  const trainingModules = [
    {
      id: 1,
      title: "Basic Health Assessment",
      description: "Learn fundamental patient assessment techniques",
      duration: "45 min",
      type: "video",
      level: "Beginner",
      completed: true,
    },
    {
      id: 2,
      title: "Malaria Prevention & Treatment",
      description: "Comprehensive guide to malaria management",
      duration: "30 min",
      type: "document",
      level: "Intermediate",
      completed: false,
    },
    {
      id: 3,
      title: "Maternal Health Guidelines",
      description: "Essential care for pregnant women",
      duration: "60 min",
      type: "interactive",
      level: "Advanced",
      completed: false,
    },
    {
      id: 4,
      title: "Child Nutrition Assessment",
      description: "Identifying and addressing malnutrition",
      duration: "40 min",
      type: "video",
      level: "Intermediate",
      completed: true,
    },
  ]

  const clinicalGuidelines = [
    {
      category: "Infectious Diseases",
      icon: ShieldIcon,
      guidelines: [
        "Malaria Diagnosis & Treatment Protocol",
        "TB Screening & Referral Guidelines",
        "HIV Testing & Counseling Procedures",
        "Respiratory Infection Management",
      ],
    },
    {
      category: "Maternal & Child Health",
      icon: BabyIcon,
      guidelines: [
        "Antenatal Care Standards",
        "Safe Delivery Practices",
        "Newborn Care Essentials",
        "Child Growth Monitoring",
      ],
    },
    {
      category: "Chronic Conditions",
      icon: StethoscopeIcon,
      guidelines: [
        "Diabetes Management",
        "Hypertension Monitoring",
        "Mental Health Support",
        "Elderly Care Guidelines",
      ],
    },
    {
      category: "Emergency Care",
      icon: AlertTriangleIcon,
      guidelines: ["First Aid Procedures", "Emergency Referral Criteria", "Shock Management", "Wound Care & Dressing"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Help & Resources</h1>
          <p className="text-muted-foreground mt-1">Training materials, guidelines, and support resources for CHWs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download All
          </Button>
          <Button size="sm">
            <ExternalLinkIcon className="h-4 w-4 mr-2" />
            Request Help
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources, guidelines, or training materials..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts - Always Visible */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangleIcon className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription className="text-red-700">
            Important numbers for medical emergencies - Available 24/7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
              <PhoneIcon className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Emergency Services</div>
                <div className="text-red-700 font-bold">912</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
              <PhoneIcon className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Health Center</div>
                <div className="text-red-700 font-bold">+250 788 XXX XXX</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
              <PhoneIcon className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium text-red-800">District Hospital</div>
                <div className="text-red-700 font-bold">+250 788 XXX XXX</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
              <PhoneIcon className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium text-red-800">Ambulance</div>
                <div className="text-red-700 font-bold">912</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="training" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="quick-ref">Quick Reference</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Training Materials Tab */}
        <TabsContent value="training" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <Card key={module.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {module.type === "video" && <VideoIcon className="h-4 w-4" />}
                        {module.type === "document" && <FileTextIcon className="h-4 w-4" />}
                        {module.type === "interactive" && <BookOpenIcon className="h-4 w-4" />}
                        {module.title}
                      </CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    {module.completed && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {module.duration}
                      </span>
                      <Badge variant="outline" >
                        {module.level}
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full" variant={module.completed ? "outline" : "default"}>
                    {module.completed ? "Review" : "Start Training"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Clinical Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clinicalGuidelines.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.guidelines.map((guideline, index) => (
                    <Button key={index} variant="outline" className="w-full justify-start h-auto p-3">
                      <div className="text-left">
                        <div className="font-medium">{guideline}</div>
                        <div className="text-xs text-muted-foreground">Updated 2 weeks ago</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quick Reference Tab */}
        <TabsContent value="quick-ref" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartIcon className="h-4 w-4" />
                  Vital Signs Normal Ranges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span className="font-medium">36.1-37.2°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Heart Rate (Adult):</span>
                  <span className="font-medium">60-100 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span>Blood Pressure:</span>
                  <span className="font-medium">120/80 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span>Respiratory Rate:</span>
                  <span className="font-medium">12-20/min</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PillIcon className="h-4 w-4" />
                  Common Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <div className="font-medium">Paracetamol</div>
                  <div className="text-muted-foreground">500mg every 6 hours</div>
                </div>
                <div>
                  <div className="font-medium">ORS Solution</div>
                  <div className="text-muted-foreground">1 sachet in 1L water</div>
                </div>
                <div>
                  <div className="font-medium">Amoxicillin</div>
                  <div className="text-muted-foreground">250mg 3x daily</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  Danger Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="text-red-600">• Difficulty breathing</div>
                <div className="text-red-600">• Chest pain</div>
                <div className="text-red-600">• Severe bleeding</div>
                <div className="text-red-600">• Loss of consciousness</div>
                <div className="text-red-600">• High fever (39°C)</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Technical Support
                </CardTitle>
                <CardDescription>
                  For issues with the RCHW system, login problems, or technical questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📧 Email:</span>
                    <span className="text-sm font-medium">support@rchw.rw</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📞 Phone:</span>
                    <span className="text-sm font-medium">+250 788 XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🕒 Hours:</span>
                    <span className="text-sm">Monday-Friday, 8AM-5PM</span>
                  </div>
                </div>
                <Button className="w-full">Contact Technical Support</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StethoscopeIcon className="h-5 w-5" />
                  Clinical Support
                </CardTitle>
                <CardDescription>For medical questions, patient care guidance, or clinical protocols</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📧 Email:</span>
                    <span className="text-sm font-medium">clinical@rchw.rw</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📞 Phone:</span>
                    <span className="text-sm font-medium">+250 788 XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🕒 Hours:</span>
                    <span className="text-sm">24/7 for emergencies</span>
                  </div>
                </div>
                <Button className="w-full">Contact Clinical Support</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Regional Coordinators
              </CardTitle>
              <CardDescription>Contact your regional health coordinator for local support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Kigali Region</div>
                  <div className="text-sm text-muted-foreground">Dr. Jean Baptiste</div>
                  <div className="text-sm">+250 788 XXX XXX</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Southern Province</div>
                  <div className="text-sm text-muted-foreground">Dr. Marie Claire</div>
                  <div className="text-sm">+250 788 XXX XXX</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Northern Province</div>
                  <div className="text-sm text-muted-foreground">Dr. Paul Kagame</div>
                  <div className="text-sm">+250 788 XXX XXX</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Eastern Province</div>
                  <div className="text-sm text-muted-foreground">Dr. Alice Uwimana</div>
                  <div className="text-sm">+250 788 XXX XXX</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
