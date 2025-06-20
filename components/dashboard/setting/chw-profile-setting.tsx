"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { SaveIcon, UserIcon } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface CHWProfileSettingsProps {
  user: AuthUser
}

export function CHWProfileSettings({ user }: CHWProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Personal Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" placeholder="+250 XXX XXX XXX" disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="District, Sector, Cell" disabled={isLoading} />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Professional Information</h3>

          <div className="space-y-2">
            <Label htmlFor="license">License Number</Label>
            <Input id="license" name="license" placeholder="CHW License Number" disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select name="specialization" disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Health</SelectItem>
                <SelectItem value="maternal">Maternal Health</SelectItem>
                <SelectItem value="child">Child Health</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="mental">Mental Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Select name="experience" disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="2-5">2-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="health-center">Health Center</Label>
            <Input id="health-center" name="health-center" placeholder="Assigned Health Center" disabled={isLoading} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio / Notes</Label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Brief description about yourself and your work..."
          className="min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
