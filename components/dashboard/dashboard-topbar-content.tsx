"use client"

import { useState } from "react"
import { signOutAction } from "@/app/actions/auth-actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { BellIcon, SearchIcon, UserIcon, LogOutIcon, SettingsIcon, MenuIcon } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface Notification {
  id: string
  title: string
  time: string
}

interface DashboardTopbarContentProps {
  user: AuthUser
  notifications: Notification[]
}

export function DashboardTopbarContent({ user, notifications }: DashboardTopbarContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    document.cookie = `sidebar_mobile_open=true; path=/; max-age=3600`
    window.location.reload() // Force reload to apply the cookie change
  }

  // Check if we're on mobile based on window width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  return (
    <header className="bg-background border-b h-16 flex items-center px-4 sticky top-0 z-30">
      <div className="flex items-center w-full justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
              <MenuIcon className="h-5 w-5" />
            </Button>
          )}

          <div className="relative w-64 hidden md:block">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                <span className="text-xs mt-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">
                  {user.role === "ADMIN" ? "Administrator" : "Community Health Worker"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={signOutAction}>
                <DropdownMenuItem asChild>
                  <button className="w-full flex items-center cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
