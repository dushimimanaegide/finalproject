"use server"

import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const patientVisitSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientAge: z.coerce.number().int().positive("Age must be a positive number"),
  symptoms: z.string().min(5, "Symptoms must be at least 5 characters"),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  followUpDate: z.string().optional(),
  location: z.string().min(3, "Location must be at least 3 characters"),
})

const patientFormSchema = z.object({
  patientFirstName: z.string().min(2, "First name must be at least 2 characters"),
  patientLastName: z.string().min(2, "Last name must be at least 2 characters"),
  patientAge: z.coerce.number().int().positive("Age must be a positive number"),
  patientGender: z.string(),
  patientPhone: z.string().optional(),
  nationalId: z.string().optional(),
  visitDate: z.string(),

  // Address fields
  province: z.string(),
  district: z.string(),
  sector: z.string(),
  cell: z.string(),
  village: z.string(),
  homeDescription: z.string().optional(),

  // Medical information
  diseaseType: z.string(),
  otherDiseaseType: z.string().optional(),
  symptoms: z.string().min(5, "Symptoms must be at least 5 characters"),
  medicationUsed: z.union([z.string(), z.array(z.string())]).optional(),
  otherMedication: z.string().optional(),
  dosage: z.string().optional(),

  // Vitals and notes
  temperature: z.string().optional(),
  bloodPressure: z.string().optional(),
  weight: z.string().optional(),
  insuranceStatus: z.string().optional(),
  clinicalNotes: z.string().optional(),
  followUpDate: z.string().optional(),
  referral: z.string().optional(),
})

export async function createPatientVisitAction(formData: FormData) {
  const user = await requireAuth()

  const patientName = formData.get("patientName") as string
  const patientAge = formData.get("patientAge") as string
  const symptoms = formData.get("symptoms") as string
  const diagnosis = formData.get("diagnosis") as string
  const treatment = formData.get("treatment") as string
  const followUpDate = formData.get("followUpDate") as string
  const location = formData.get("location") as string

  try {
    const validatedData = patientVisitSchema.parse({
      patientName,
      patientAge: Number.parseInt(patientAge),
      symptoms,
      diagnosis,
      treatment,
      followUpDate,
      location,
    })

    await prisma.patientVisit.create({
      data: {
        patientName: validatedData.patientName,
        patientAge: validatedData.patientAge,
        symptoms: validatedData.symptoms,
        diagnosis: validatedData.diagnosis || null,
        treatment: validatedData.treatment || null,
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
        location: validatedData.location,
        userId: user.id,
      },
    })

    revalidatePath("/dashboard")
    return { success: "Patient visit recorded successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function submitPatientFormAction(formData: FormData) {
  const user = await requireAuth()

  // Process form data
  const patientFirstName = formData.get("patientFirstName") as string
  const patientLastName = formData.get("patientLastName") as string
  const patientFullName = `${patientFirstName} ${patientLastName}`
  const patientAge = formData.get("patientAge") as string
  const patientGender = formData.get("patientGender") as string
  const symptoms = formData.get("symptoms") as string

  // Get location from address fields
  const province = formData.get("province") as string
  const district = formData.get("district") as string
  const sector = formData.get("sector") as string
  const cell = formData.get("cell") as string
  const village = formData.get("village") as string
  const location = `${village}, ${cell}, ${sector}, ${district}, ${province}`

  // Get disease and medication info
  const diseaseType = formData.get("diseaseType") as string
  const otherDiseaseType = formData.get("otherDiseaseType") as string
  const diagnosis = diseaseType === "other" ? otherDiseaseType : diseaseType

  // Get medication info - handle multiple selections
  const medicationValues = formData.getAll("medicationUsed") as string[]
  const otherMedication = formData.get("otherMedication") as string
  const treatment = [...medicationValues, otherMedication].filter(Boolean).join(", ")

  // Get follow-up date
  const followUpDate = formData.get("followUpDate") as string

  try {
    // Create a patient visit record
    await prisma.patientVisit.create({
      data: {
        patientName: patientFullName,
        patientAge: Number.parseInt(patientAge),
        symptoms,
        diagnosis: diagnosis || null,
        treatment: treatment || null,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        location,
        userId: user.id,
      },
    })

    // Create a health report for significant cases
    if (diseaseType && diseaseType !== "none") {
      const clinicalNotes = formData.get("clinicalNotes") as string
      const reportTitle = `${diagnosis} case in ${village}, ${cell}`
      const reportDescription = `Patient: ${patientFullName} (${patientAge}y, ${patientGender})
Symptoms: ${symptoms}
Treatment: ${treatment || "None provided"}
${clinicalNotes ? `Notes: ${clinicalNotes}` : ""}`

      await prisma.healthReport.create({
        data: {
          title: reportTitle,
          description: reportDescription,
          location,
          userId: user.id,
        },
      })
    }

    revalidatePath("/dashboard/chw")
    return { success: "Patient information recorded successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Form submission error:", error)
    return { error: "Something went wrong. Please try again." }
  }
}
