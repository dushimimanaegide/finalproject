import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { User } from "@prisma/client"
import * as bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export type AuthUser = Omit<User, "password">

export async function getSession(): Promise<{ user: AuthUser } | null> {
  const sessionId = (await cookies()).get("session_id")?.value

  if (!sessionId) {
    return null
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: sessionId },
    })

    if (!user) {
      return null
    }

    const { password, ...authUser } = user
    return { user: authUser }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return null
  }

  (await cookies()).set("session_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  const { password: _, ...authUser } = user
  return authUser
}

export async function signOut() {
  (await cookies()).delete("session_id")
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return session.user
}

export async function requireAdmin() {
  const user = await requireAuth()

  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return user
}
