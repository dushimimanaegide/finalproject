"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOutAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import type { AuthUser } from "@/lib/auth"

interface DashboardNavProps {
  user: AuthUser
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <header className="bg-primary py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <h1 className="text-2xl font-bold text-white">RCHW</h1>
          </Link>

          <nav className="hidden md:flex space-x-6">
            {user.role === "ADMIN" ? (
              <>
                <Link
                  href="/dashboard/admin"
                  className={`text-white/90 hover:text-white ${pathname === "/dashboard/admin" ? "font-semibold" : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/reports"
                  className={`text-white/90 hover:text-white ${
                    pathname === "/dashboard/admin/reports" ? "font-semibold" : ""
                  }`}
                >
                  Reports
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className={`text-white/90 hover:text-white ${
                    pathname === "/dashboard/admin/users" ? "font-semibold" : ""
                  }`}
                >
                  Users
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/chw"
                  className={`text-white/90 hover:text-white ${pathname === "/dashboard/chw" ? "font-semibold" : ""}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/chw/reports"
                  className={`text-white/90 hover:text-white ${
                    pathname === "/dashboard/chw/reports" ? "font-semibold" : ""
                  }`}
                >
                  My Reports
                </Link>
                <Link
                  href="/dashboard/chw/visits"
                  className={`text-white/90 hover:text-white ${
                    pathname === "/dashboard/chw/visits" ? "font-semibold" : ""
                  }`}
                >
                  Patient Visits
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-white/90">
            <span className="font-medium text-white">{user.name}</span>
            <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
              {user.role === "ADMIN" ? "Admin" : "CHW"}
            </span>
          </div>

          <form action={signOutAction}>
            <Button variant="secondary" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
