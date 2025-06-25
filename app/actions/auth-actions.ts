// app/actions/auth-actions.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
// ...rest of your signInAction logic

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

    if (!user.active) {
      return { error: "Your account has been deactivated. Please contact an administrator." }
    }

    const isPasswordMatch = await verifyPassword(user.password, validatedData.password)

    if (!isPasswordMatch) {
      return { error: "Invalid email or password" }
    }

    await createSession(user.id)

    // ✅ Return user to the client to redirect from there
    return { user }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Login error:", error)
    return { error: "Authentication failed. Please check your credentials and try again." }
  }
}

async function createSession(userId: string) {
  const cookieStore = cookies()

  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export async function signOutAction() {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  redirect("/")
}

export async function getCurrentUser() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!userCookie) return null

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userCookie.value,
        active: true,
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
