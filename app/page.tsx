import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, BarChart3, Bell } from 'lucide-react'
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TaskTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-24 md:py-32">
          <div className="flex max-w-5xl flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Stay on top of your academic tasks
            </h1>
            <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl text-pretty">
              A modern task management system designed for students. Track
              assignments, manage deadlines, and boost your productivity.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Start tracking for free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Task Management</h3>
              <p className="text-sm text-muted-foreground">
                Create and organize tasks by category and priority
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Calendar View</h3>
              <p className="text-sm text-muted-foreground">
                Visualize deadlines and plan your schedule
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your productivity with detailed analytics
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-lg bg-primary/10 p-3">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Smart Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Never miss a deadline with timely reminders
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex items-center justify-center text-sm text-muted-foreground">
          Built for students, by students
        </div>
      </footer>
    </div>
  )
}
