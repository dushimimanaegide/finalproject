import { requireAuth } from "@/lib/auth"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon, BellIcon, PaletteIcon } from "lucide-react"
import { CHWProfileSettings } from "@/components/dashboard/setting/chw-profile-setting"
import { CHWNotificationSettings } from "@/components/dashboard/setting/chw-notification"
import { CHWPreferencesSettings } from "@/components/dashboard/setting/chw-preferences-setting"

export default async function CHWSettingsPage() {
  const user = await requireAuth()

  // Ensure only CHWs can access this page
  if (user.role !== "CHW") {
    throw new Error("Access denied. CHW role required.")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, notifications, and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <PaletteIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and professional information.</CardDescription>
            </CardHeader>
            <CardContent>
              <CHWProfileSettings user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications and alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <CHWNotificationSettings user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Interface Preferences</CardTitle>
              <CardDescription>Customize your dashboard and interface settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <CHWPreferencesSettings user={user} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
