import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationList } from "@/components/notification-list"
import { createNotificationRepository } from "@/lib/repositories/notification-repository"
import { createTaskRepository } from "@/lib/repositories/task-repository.client"
import { NotificationService } from "@/lib/services/notification-service"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const notificationRepo = createNotificationRepository("server")
  const taskRepo = createTaskRepository("server")
  const notificationService = new NotificationService(notificationRepo, taskRepo)

  // Generate notifications based on deadlines
  await notificationService.generateNotificationsForUser(data.user.id)

  const notifications = await notificationService.getUserNotifications(data.user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 bg-muted/40">
        <div className="container py-6 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your task deadlines and completions</p>
          </div>
          <NotificationList userId={data.user.id} notifications={notifications} />
        </div>
      </main>
    </div>
  )
}
