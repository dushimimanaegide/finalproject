"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage }  from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MenuIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  HelpCircleIcon,
  ShieldIcon,
} from "lucide-react"
import type { AuthUser } from "@/lib/auth"
import { signOutAction } from "@/app/actions/auth-actions"

// Notification type
interface Notification {
  id: string
  title: string
  time: string
}

// Props interface
export interface DashboardTopbarContentProps {
  user: AuthUser
  notifications?: Notification[]
}

// Component
export function DashboardTopbarContent({
  user,
  notifications = [],
}: DashboardTopbarContentProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOutAction()
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      setIsSigningOut(false)
    }
  }

  const toggleMobileSidebar = () => {
    const event = new CustomEvent("toggle-sidebar")
    document.dispatchEvent(event)
  }

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileSidebar}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          <div className="hidden md:block">
            <h1 className="text-lg font-semibold">
              {user.role === "ADMIN" ? "Admin Dashboard" : "CHW Dashboard"}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
                  <AvatarFallback className="bg-primary/10">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {user.role === "ADMIN" ? (
                        <>
                          <ShieldIcon className="h-3 w-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        "CHW"
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
