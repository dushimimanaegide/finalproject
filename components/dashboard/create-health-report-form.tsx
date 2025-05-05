"use client"

import { useState } from "react"
import { createHealthReportAction } from "@/app/actions/health-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function CreateHealthReportForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await createHealthReportAction(formData)

    if (result.error) {
      setError(result.error)
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else if (result.success) {
      setSuccess(result.success)
      toast({
        title: "Success",
        description: result.success,
      })

      // Reset form
      const form = document.getElementById("health-report-form") as HTMLFormElement
      form.reset()
    }

    setIsLoading(false)
  }

  return (
    <form id="health-report-form" action={handleSubmit} className="space-y-6">
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

      {success && <div className="bg-green-500/15 text-green-600 p-3 rounded-md text-sm">{success}</div>}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Report Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="E.g., Malaria Outbreak in Kigali Sector"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide detailed information about the health issue..."
            rows={5}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="E.g., Nyarugenge District, Kigali"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Health Report"}
      </Button>
    </form>
  )
}
