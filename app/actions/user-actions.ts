"use server"

import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sendWelcomeEmail } from "@/lib/email-service"
import { generatePassword, hashPassword } from "@/lib/password"

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  telephone: z.string().min(10, "Please enter a valid telephone number"),
  role: z.enum(["ADMIN", "CHW"]),
})

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  telephone: z.string().min(10, "Please enter a valid telephone number"),
  gender: z.enum(["male", "female", "other"]),
  role: z.enum(["ADMIN", "CHW"]),
})

export async function updateUserAction(formData: FormData) {
  // Ensure the user is an admin
  await requireAdmin()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const telephone = formData.get("telephone") as string
  const role = formData.get("role") as "ADMIN" | "CHW"

  try {
    const validatedData = updateUserSchema.parse({
      id,
      name,
      email,
      telephone,
      role,
    })

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        id: { not: validatedData.id },
      },
    })

    if (existingUser) {
      return { error: "Email is already in use by another user" }
    }

    // Update the user
    await prisma.user.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        telephone: validatedData.telephone,
        role: validatedData.role,
      },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: "User updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function deactivateUserAction(id: string) {
  try {
    // Ensure the user is an admin
    await requireAdmin()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Prevent deactivating yourself
    const session = await requireAdmin()
    if (session.id === id) {
      return { error: "You cannot deactivate your own account" }
    }

    // Deactivate the user
    await prisma.user.update({
      where: { id },
      data: { active: false },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: "User deactivated successfully" }
  } catch (error) {
    console.error("Error deactivating user:", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function activateUserAction(id: string) {
  try {
    // Ensure the user is an admin
    await requireAdmin()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Activate the user
    await prisma.user.update({
      where: { id },
      data: { active: true },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: "User activated successfully" }
  } catch (error) {
    console.error("Error activating user:", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function deleteUserAction(id: string) {
  try {
    // Ensure the user is an admin
    await requireAdmin()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Prevent deleting yourself
    const session = await requireAdmin()
    if (session.id === id) {
      return { error: "You cannot delete your own account" }
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { error: "Something went wrong. Please try again." }
  }
}

export async function createUserAction(formData: FormData) {
  // Ensure the user is an admin
  await requireAdmin()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const telephone = formData.get("telephone") as string
  const gender = formData.get("gender") as "male" | "female" | "other"
  const role = formData.get("role") as "ADMIN" | "CHW"

  try {
    const validatedData = createUserSchema.parse({
      name,
      email,
      telephone,
      gender,
      role,
    })

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { error: "Email is already in use" }
    }

    // Generate a secure temporary password
    const temporaryPassword = generatePassword(12)
    const hashedPassword = await hashPassword(temporaryPassword)

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        telephone: validatedData.telephone,
        gender: validatedData.gender,
        role: validatedData.role,
        active: true,
      },
    })

    // Send welcome email
    const emailResult = await sendWelcomeEmail({
      name: newUser.name,
      email: newUser.email,
      password: temporaryPassword,
      role: newUser.role,
    })

    revalidatePath("/dashboard/admin/users")

    if (emailResult.success) {
      if (emailResult.error) {
        // Success but with a warning (test mode)
        return {
          success: `User created successfully! ${emailResult.error}`,
        }
      }
      return {
        success: `User created successfully! Welcome email sent to ${newUser.email}.`,
      }
    } else {
      return {
        success: `User created successfully, but email failed: ${emailResult.error}. Manual credentials - Email: ${newUser.email}, Password: ${temporaryPassword}`,
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Error creating user:", error)
    return { error: "Something went wrong. Please try again." }
  }
}
