"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { submitPatientFormAction } from "@/app/actions/patient-actions"

interface PatientIntakeFormProps {
  currentDate: string
}

export function PatientIntakeForm({ currentDate }: PatientIntakeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  // Rwanda provinces
  const provinces = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"]

  // Common diseases/conditions in Rwanda
  const commonDiseases = [
    "Malaria",
    "Respiratory Infection",
    "Diarrheal Disease",
    "Tuberculosis",
    "HIV/AIDS",
    "Pneumonia",
    "Typhoid Fever",
    "Intestinal Parasites",
    "Malnutrition",
    "Hypertension",
    "Diabetes",
    "Other",
  ]

  // Common medications
  const commonMedications = [
    "Artemether/Lumefantrine",
    "Amoxicillin",
    "Paracetamol",
    "Metronidazole",
    "Cotrimoxazole",
    "Oral Rehydration Salts",
    "Zinc Supplements",
    "Albendazole",
    "Ibuprofen",
    "Ciprofloxacin",
    "Insulin",
    "Other",
  ]

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await submitPatientFormAction(formData)

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
        const form = document.getElementById("patient-intake-form") as HTMLFormElement
        form.reset()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    }

    setIsLoading(false)
  }

  return (
    <form id="patient-intake-form" action={handleSubmit} className="space-y-8">
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}
      {success && <div className="bg-green-500/15 text-green-600 p-3 rounded-md text-sm">{success}</div>}

      {/* Patient Demographics Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Patient Demographics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientFirstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patientFirstName"
              name="patientFirstName"
              placeholder="First name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientLastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input id="patientLastName" name="patientLastName" placeholder="Last name" required disabled={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patientAge">
              Age <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patientAge"
              name="patientAge"
              type="number"
              placeholder="Age in years"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientGender">
              Gender <span className="text-destructive">*</span>
            </Label>
            <Select name="patientGender" required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientPhone">Phone Number</Label>
            <Input id="patientPhone" name="patientPhone" placeholder="e.g., +250 7XX XXX XXX" disabled={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nationalId">National ID (if available)</Label>
            <Input id="nationalId" name="nationalId" placeholder="National ID number" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitDate">
              Date of Visit <span className="text-destructive">*</span>
            </Label>
            <Input
              id="visitDate"
              name="visitDate"
              type="date"
              defaultValue={currentDate}
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Patient Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Patient Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">
              Province <span className="text-destructive">*</span>
            </Label>
            <Select name="province" required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province.toLowerCase().replace(/\s+/g, "-")}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">
              District <span className="text-destructive">*</span>
            </Label>
            <Input id="district" name="district" placeholder="District" required disabled={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sector">
              Sector <span className="text-destructive">*</span>
            </Label>
            <Input id="sector" name="sector" placeholder="Sector" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cell">
              Cell <span className="text-destructive">*</span>
            </Label>
            <Input id="cell" name="cell" placeholder="Cell" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="village">
              Village <span className="text-destructive">*</span>
            </Label>
            <Input id="village" name="village" placeholder="Village" required disabled={isLoading} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="homeDescription">Home Description/Landmarks</Label>
          <Textarea
            id="homeDescription"
            name="homeDescription"
            placeholder="Describe any landmarks or directions to help locate the home"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Medical Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Medical Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diseaseType">
              Disease/Condition Type <span className="text-destructive">*</span>
            </Label>
            <Select name="diseaseType" required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select disease/condition" />
              </SelectTrigger>
              <SelectContent>
                {commonDiseases.map((disease) => (
                  <SelectItem key={disease} value={disease.toLowerCase().replace(/\s+/g, "-")}>
                    {disease}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherDiseaseType">If Other, please specify</Label>
            <Input
              id="otherDiseaseType"
              name="otherDiseaseType"
              placeholder="Specify disease/condition"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptoms">
            Symptoms <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="symptoms"
            name="symptoms"
            placeholder="Describe the patient's symptoms in detail"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicationUsed">Medication Used</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {commonMedications.map((medication) => (
              <div key={medication} className="flex items-center space-x-2">
                <Checkbox
                  id={`medication-${medication.toLowerCase().replace(/\s+/g, "-")}`}
                  name="medicationUsed"
                  value={medication}
                  disabled={isLoading}
                />
                <label htmlFor={`medication-${medication.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm">
                  {medication}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherMedication">Other Medication (if applicable)</Label>
          <Input
            id="otherMedication"
            name="otherMedication"
            placeholder="List any other medications used"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage and Instructions</Label>
          <Textarea
            id="dosage"
            name="dosage"
            placeholder="Specify dosage and instructions for medications"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Vitals & Notes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Vitals & Notes</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              placeholder="e.g., 37.0"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
            <Input id="bloodPressure" name="bloodPressure" placeholder="e.g., 120/80" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" name="weight" type="number" step="0.1" placeholder="e.g., 65.5" disabled={isLoading} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Health Insurance Status</Label>
          <RadioGroup defaultValue="mutuelle" name="insuranceStatus" className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mutuelle" id="mutuelle" />
              <Label htmlFor="mutuelle">Mutuelle de Santé</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rssb" id="rssb" />
              <Label htmlFor="rssb">RSSB</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private">Private Insurance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">None</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clinicalNotes">Clinical Notes</Label>
          <Textarea
            id="clinicalNotes"
            name="clinicalNotes"
            placeholder="Additional clinical observations or notes"
            rows={4}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date (if needed)</Label>
            <Input id="followUpDate" name="followUpDate" type="date" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referral">Referral to Health Facility</Label>
            <Select name="referral" disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select if referral needed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No referral needed</SelectItem>
                <SelectItem value="health-center">Health Center</SelectItem>
                <SelectItem value="district-hospital">District Hospital</SelectItem>
                <SelectItem value="referral-hospital">Referral Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" disabled={isLoading}>
          Save as Draft
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Patient Form"}
        </Button>
      </div>
    </form>
  )
}
