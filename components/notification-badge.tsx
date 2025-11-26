import { Badge } from "@/components/ui/badge"
import { createNotificationRepository } from "@/lib/repositories/notification-repository"
import { createTaskRepository } from "@/lib/repositories/task-repository.client"
import { NotificationService } from "@/lib/services/notification-service"

export async function NotificationBadge({ userId }: { userId: string }) {
  const notificationRepo = createNotificationRepository("server")
  const taskRepo = createTaskRepository("server")
  const notificationService = new NotificationService(notificationRepo, taskRepo)

  const count = await notificationService.getUnreadCount(userId)

  if (count === 0) return null

  return (
    <Badge
      variant="destructive"
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {count > 9 ? "9+" : count}
    </Badge>
  )
}
