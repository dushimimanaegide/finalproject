"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { SaveIcon, BellIcon, MailIcon, SmartphoneIcon } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface CHWNotificationSettingsProps {
  user: AuthUser
}

export function CHWNotificationSettings({ user }: CHWNotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Email Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <MailIcon className="h-5 w-5" />
          Email Notifications
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Report Status Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when your reports are reviewed or approved</p>
            </div>
            <Switch name="email-reports" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Training Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new training materials and deadlines
              </p>
            </div>
            <Switch name="email-training" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about system maintenance and new features</p>
            </div>
            <Switch name="email-system" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emergency Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive urgent health alerts and emergency notifications</p>
            </div>
            <Switch name="email-emergency" defaultChecked />
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <SmartphoneIcon className="h-5 w-5" />
          SMS Notifications
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Emergency Alerts Only</Label>
              <p className="text-sm text-muted-foreground">Receive SMS only for urgent health emergencies</p>
            </div>
            <Switch name="sms-emergency" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Report Reminders</Label>
              <p className="text-sm text-muted-foreground">Get SMS reminders for pending reports</p>
            </div>
            <Switch name="sms-reminders" />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          Push Notifications
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Real-time Updates</Label>
              <p className="text-sm text-muted-foreground">Get instant notifications in the app</p>
            </div>
            <Switch name="push-realtime" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select name="notification-frequency">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Summary</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quiet Hours</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select name="quiet-start">
                <SelectTrigger>
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                  <SelectItem value="21:00">9:00 PM</SelectItem>
                  <SelectItem value="22:00">10:00 PM</SelectItem>
                  <SelectItem value="23:00">11:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <Select name="quiet-end">
                <SelectTrigger>
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00">6:00 AM</SelectItem>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
