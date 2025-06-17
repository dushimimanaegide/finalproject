"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verifyPassword } from "@/lib/password"

// Session cookie name
const SESSION_COOKIE_NAME = "session_id"
const SESSION_DURATION = 7 * 24 * 60 * 60

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validatedData = signInSchema.parse({ email, password })

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      return { error: "Invalid email or password" }
    }

    // Check if user is active
    if (!user.active) {
      return { error: "Your account has been deactivated. Please contact an administrator." }
    }

    // Verify password
    const isPasswordMatch = await verifyPassword(user.password, validatedData.password)

    if (!isPasswordMatch) {
      return { error: "Invalid email or password" }
    }

    // Create session after successful login
    await createSession(user.id)

    // Redirect based on role
    if (user.role === "ADMIN") {
      redirect("/dashboard/admin")
    } else {
      redirect("/dashboard/chw")
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Login error:", error)
    return { error: "Authentication failed. Please check your credentials and try again." }
  }
}

export async function signOutAction() {
  await clearSession()
  redirect("/")
}

// Helper functions for session management
async function createSession(userId: string) {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!userCookie) {
    return null
  }

  const userId = userCookie.value

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        active: true, // Only return active users
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        telephone: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
