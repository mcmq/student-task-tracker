"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, User, LogOut, Bell } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"

export function DashboardHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TaskTracker</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Tasks
            </Link>
            <Link
              href="/dashboard/calendar"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Calendar
            </Link>
            <Link
              href="/dashboard/analytics"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}