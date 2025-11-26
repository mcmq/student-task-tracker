export type NotificationType = "deadline_approaching" | "task_overdue" | "task_completed"

export interface Notification {
  id: string
  user_id: string
  task_id: string | null
  type: NotificationType
  message: string
  is_read: boolean
  created_at: string
}

export interface CreateNotificationInput {
  user_id: string
  task_id: string | null
  type: NotificationType
  message: string
}

export function validateNotification(input: CreateNotificationInput): void {
  if (!input.message || input.message.trim().length === 0) {
    throw new Error("Notification message is required")
  }
  if (!input.user_id) {
    throw new Error("User ID is required")
  }
}
