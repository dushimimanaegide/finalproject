"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { hashPassword, verifyPassword } from "@/lib/password"

// Session cookie name
const SESSION_COOKIE_NAME = "session_id"
const SESSION_DURATION = 7 * 24 * 60 * 60 

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  telephone: z.string().min(10, "Please enter a valid telephone number"),
  gender: z.enum(["male", "female", "other"]),
})

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const telephone = formData.get("telephone") as string
  const gender = formData.get("gender") as string

  try {
    const validatedData = signUpSchema.parse({
      name,
      email,
      password,
      telephone,
      gender,
    })

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { error: "Email already in use" }
    }

    // Use the custom password hashing function
    const hashedPassword = await hashPassword(validatedData.password)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        telephone: validatedData.telephone,
        gender: validatedData.gender,
      },
    })

    // Create session after successful signup
    await createSession(user.id)
    return { 
      success: true,
      user:{
        id: user.id,
        role: user.role,
      }
     }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    if (error instanceof Error) {
      console.error("Error in signUpAction:", error)
      return { error: error.message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "Invalid email or password" }
    }

    // Use the custom password verification function
    const isPasswordMatch = await verifyPassword(user.password, password)

    if (!isPasswordMatch) {
      return { error: "Invalid email or password" }
    }

    // Create session after successful login
    await createSession(user.id)
    return { 
      success: true,
      user:{
        id: user.id,
        role: user.role,
      }
     }
  } catch (error) {
    console.error("Login error:", error)
    return {
      error:
        error instanceof Error ? error.message : "Authentication failed. Please check your credentials and try again.",
    }
  }
}

export async function signOutAction() {
  clearSession()
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
  const  userCookie = cookieStore.get(SESSION_COOKIE_NAME)
  if (!userCookie) {
    return null
  }
  const userId = userCookie.value
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
