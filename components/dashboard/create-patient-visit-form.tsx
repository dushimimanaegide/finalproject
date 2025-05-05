"use client"

import { useState } from "react"
import { createPatientVisitAction } from "@/app/actions/patient-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function CreatePatientVisitForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await createPatientVisitAction(formData)

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
      const form = document.getElementById("patient-visit-form") as HTMLFormElement
      form.reset()
    }

    setIsLoading(false)
  }

  return (
    <form id="patient-visit-form" action={handleSubmit} className="space-y-6">
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

      {success && <div className="bg-green-500/15 text-green-600 p-3 rounded-md text-sm">{success}</div>}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input id="patientName" name="patientName" placeholder="Full name" required disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientAge">Patient Age</Label>
            <Input
              id="patientAge"
              name="patientAge"
              type="number"
              placeholder="Age in years"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptoms">Symptoms</Label>
          <Textarea
            id="symptoms"
            name="symptoms"
            placeholder="Describe the patient's symptoms..."
            rows={3}
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis (if known)</Label>
            <Input id="diagnosis" name="diagnosis" placeholder="Preliminary diagnosis" disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment (if provided)</Label>
            <Input id="treatment" name="treatment" placeholder="Treatment provided" disabled={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date (if needed)</Label>
            <Input id="followUpDate" name="followUpDate" type="date" disabled={isLoading} />
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
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Record Patient Visit"}
      </Button>
    </form>
  )
}
