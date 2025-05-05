import { requireAuth } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await requireAuth()

  if (!user) {
    redirect("/auth/signin")
  }

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin")
  } else {
    redirect("/dashboard/chw")
  }
}
