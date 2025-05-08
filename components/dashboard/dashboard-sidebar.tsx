import { cookies } from "next/headers"
import { DashboardSidebarContent } from "./dashboard-sidebar-content"
import type { AuthUser } from "@/lib/auth"

interface DashboardSidebarProps {
  user: AuthUser
}

export async function DashboardSidebar({ user }: DashboardSidebarProps) {
  // Get sidebar state from cookies
  const cookieStore = await cookies()
  const sidebarCollapsed = cookieStore.get("sidebar_collapsed")?.value === "true"

  return <DashboardSidebarContent user={user} initialCollapsed={sidebarCollapsed} />
}
