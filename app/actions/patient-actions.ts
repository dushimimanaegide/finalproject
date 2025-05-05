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
    return { error: "Something went wrong. Please try again. five" }
  }
}
