import { prisma } from "@/lib/prisma"
import { DashboardTopbarContent } from "./dashboard-topbar-content"
import type { AuthUser } from "@/lib/auth"

interface Notification {
  id: string
  title: string
  time: string
}

interface DashboardTopbarProps {
  user: AuthUser
}

// This must be an async Server Component
export async function DashboardTopbar({ user }: DashboardTopbarProps) {
  let notifications: Notification[] = []

  if (user.role === "ADMIN") {
    const pendingReportsCount = await prisma.healthReport.count({
      where: { status: "PENDING" },
    })

    const newUsersCount = await prisma.user.count({
      where: {
        role: "CHW",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    })

    notifications = [
      {
        id: "pending-reports",
        title: `${pendingReportsCount} pending health reports`,
        time: "Needs review",
      },
      {
        id: "new-users",
        title: `${newUsersCount} new CHWs registered`,
        time: "Last 7 days",
      },
    ]
  } else {
    const reviewedReportsCount = await prisma.healthReport.count({
      where: {
        userId: user.id,
        status: {
          in: ["REVIEWED", "RESOLVED"],
        },
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    const upcomingFollowUpsCount = await prisma.patientVisit.count({
      where: {
        userId: user.id,
        followUpDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
    })

    notifications = [
      {
        id: "reviewed-reports",
        title: `${reviewedReportsCount} reports reviewed`,
        time: "Last 24 hours",
      },
      {
        id: "upcoming-followups",
        title: `${upcomingFollowUpsCount} upcoming follow-ups`,
        time: "Next 7 days",
      },
    ]
  }

  return <DashboardTopbarContent user={user} notifications={notifications} />
}
