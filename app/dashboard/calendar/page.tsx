import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { CalendarView } from "@/components/calendar-view"
import { createTaskRepository } from "@/lib/repositories/task-repository.server"
import { TaskService } from "@/lib/services/task-service"

export default async function CalendarPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const taskRepository = createTaskRepository()
  const taskService = new TaskService(taskRepository)
  const tasks = await taskService.getUserTasks(data.user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 bg-muted/40">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">View your tasks and deadlines in calendar format</p>
          </div>
          <CalendarView tasks={tasks} />
        </div>
      </main>
    </div>
  )
}
