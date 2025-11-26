import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TaskList } from "@/components/task-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskStats } from "@/components/task-stats"
import { UpcomingDeadlines } from "@/components/upcoming-deadlines"
import { TaskService } from "@/lib/services/task-service"
import { createTaskRepository } from "@/lib/repositories/task-repository.server"
import { AnalyticsService } from "@/lib/services/analytics-service"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const taskRepository = createTaskRepository()
  const taskService = new TaskService(taskRepository)
  const analyticsService = new AnalyticsService(taskRepository)

  const tasks = await taskService.getUserTasks(data.user.id)
  const stats = await analyticsService.getTaskStats(data.user.id)
  const upcomingDeadlines = await analyticsService.getUpcomingDeadlines(data.user.id, 5)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 bg-muted/40">
        <div className="container py-6 space-y-6">
          <TaskStats stats={stats} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TaskList userId={data.user.id} initialTasks={tasks} />
            </div>
            <div>
              <UpcomingDeadlines tasks={upcomingDeadlines} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
