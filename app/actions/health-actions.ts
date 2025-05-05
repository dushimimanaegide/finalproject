"use server"

import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const healthReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
})

export async function createHealthReportAction(formData: FormData) {
  const user = await requireAuth()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const location = formData.get("location") as string

  try {
    const validatedData = healthReportSchema.parse({
      title,
      description,
      location,
    })

    await prisma.healthReport.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        userId: user.id,
      },
    })

    revalidatePath("/dashboard")
    return { success: "Health report created successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again. three" }
  }
}

export async function updateHealthReportStatusAction(id: string, status: "PENDING" | "REVIEWED" | "RESOLVED") {
  await requireAuth()

  try {
    await prisma.healthReport.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/dashboard/admin")
    return { success: "Health report status updated successfully" }
  } catch (error) {
    return { error: "Something went wrong. Please try again. four" }
  }
}
