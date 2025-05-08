import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin")
  } else {
    redirect("/dashboard/chw")
  }
}
