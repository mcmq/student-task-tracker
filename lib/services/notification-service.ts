import type { Notification, CreateNotificationInput } from "@/lib/domain/notification"
import type { INotificationRepository } from "@/lib/repositories/notification-repository"
import type { ITaskRepository } from "@/lib/repositories/task-repository.client"
import { validateNotification } from "@/lib/domain/notification"
import { format } from "date-fns"

export class NotificationService {
  constructor(
    private notificationRepo: INotificationRepository,
    private taskRepo: ITaskRepository,
  ) {}

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepo.findByUserId(userId)
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepo.countUnread(userId)
  }

  async createNotification(input: CreateNotificationInput): Promise<Notification> {
    validateNotification(input)
    return this.notificationRepo.create(input)
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.notificationRepo.markAsRead(notificationId)
  }

  // Business logic: Generate notifications based on task deadlines
  async generateNotificationsForUser(userId: string): Promise<void> {
    const tasks = await this.taskRepo.findByUserId(userId)
    const incompleteTasks = tasks.filter((t) => t.status !== "Completed")

    const now = new Date()
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    for (const task of incompleteTasks) {
      const dueDate = new Date(task.due_date)

      // Check if notification already exists
      const exists = await this.notificationRepo.checkExists(userId, task.id)
      if (exists) continue

      // Task is overdue
      if (dueDate < now) {
        await this.createNotification({
          user_id: userId,
          task_id: task.id,
          type: "task_overdue",
          message: `Task "${task.title}" is overdue!`,
        })
      }
      // Task due within 24 hours
      else if (dueDate <= oneDayFromNow) {
        await this.createNotification({
          user_id: userId,
          task_id: task.id,
          type: "deadline_approaching",
          message: `Task "${task.title}" is due within 24 hours!`,
        })
      }
      // Task due within 3 days
      else if (dueDate <= threeDaysFromNow) {
        await this.createNotification({
          user_id: userId,
          task_id: task.id,
          type: "deadline_approaching",
          message: `Task "${task.title}" is due soon on ${format(dueDate, "MMM d, yyyy")}`,
        })
      }
    }
  }
}
