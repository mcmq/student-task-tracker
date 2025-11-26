import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskCompletionChart } from "@/components/task-completion-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { PriorityDistribution } from "@/components/priority-distribution"
import { ProductivityStats } from "@/components/productivity-stats"
import { createTaskRepository } from "@/lib/repositories/task-repository.server"
import { AnalyticsService } from "@/lib/services/analytics-service"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const taskRepository = createTaskRepository()
  const analyticsService = new AnalyticsService(taskRepository)

  const [tasks, productivityMetrics, categoryStats, priorityStats] = await Promise.all([
    taskRepository.findByUserId(data.user.id),
    analyticsService.getProductivityMetrics(data.user.id),
    analyticsService.getCategoryBreakdown(data.user.id),
    analyticsService.getPriorityDistribution(data.user.id),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 bg-muted/40">
        <div className="container py-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your productivity and task completion patterns</p>
          </div>
          <ProductivityStats metrics={productivityMetrics} />
          <div className="grid gap-6 lg:grid-cols-2">
            <TaskCompletionChart tasks={tasks} />
            <CategoryBreakdown categoryStats={categoryStats} />
          </div>
          <PriorityDistribution priorityStats={priorityStats} />
        </div>
      </main>
    </div>
  )
}
