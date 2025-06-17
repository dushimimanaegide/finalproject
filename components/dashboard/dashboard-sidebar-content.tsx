"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  FileTextIcon,
  UsersIcon,
  ActivityIcon,
  ClipboardCheckIcon,
  BarChartIcon,
  SettingsIcon,
  HelpCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  MenuIcon,
} from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface DashboardSidebarContentProps {
  user: AuthUser
  initialCollapsed: boolean
}

export function DashboardSidebarContent({ user, initialCollapsed }: DashboardSidebarContentProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(initialCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Function to toggle sidebar collapse state
  const toggleCollapse = () => {
    const newState = !collapsed
    setCollapsed(newState)

    // Save state to cookie
    document.cookie = `sidebar_collapsed=${newState}; path=/; max-age=31536000`
  }

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  // Admin navigation items
  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: HomeIcon,
    },
    {
      title: "Health Reports",
      href: "/dashboard/admin/reports",
      icon: FileTextIcon,
    },
    {
      title: "Users Management",
      href: "/dashboard/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: SettingsIcon,
    },
  ]

  // CHW navigation items
  const chwNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/chw",
      icon: HomeIcon,
    },
    {
      title: "My Reports",
      href: "/dashboard/chw/reports",
      icon: FileTextIcon,
    },
    {
      title: "Patient Visits",
      href: "/dashboard/chw/visits",
      icon: ActivityIcon,
    },
    {
      title: "New Report",
      href: "/dashboard/chw/new-report",
      icon: ClipboardCheckIcon,
    },
    {
      title: "Patient Form",
      href: "/dashboard/chw/patient-form",
      icon: UserIcon,
    },
    {
      title: "Help & Resources",
      href: "/dashboard/chw/resources",
      icon: HelpCircleIcon,
    },
  ]

  // Select navigation items based on user role
  const navItems = user.role === "ADMIN" ? adminNavItems : chwNavItems

  // Check if we're on mobile based on window width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  // Determine sidebar visibility based on mobile/desktop
  const sidebarVisible = isMobile ? mobileOpen : true

  if (!sidebarVisible && isMobile) {
    return (
      <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="fixed top-4 left-4 z-50">
        <MenuIcon className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "bg-card border-r flex flex-col z-50",
          collapsed ? "w-16" : "w-64",
          isMobile ? "fixed h-full transition-transform duration-300 ease-in-out" : "relative",
          isMobile && !mobileOpen && "-translate-x-full",
        )}
      >
        {/* Sidebar header */}
        <div className={cn("h-16 border-b flex items-center px-4", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">RHIE</span>
            </Link>
          )}

          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8">
              {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  collapsed && "justify-center px-0",
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User info at bottom */}
        {!collapsed && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.role}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
