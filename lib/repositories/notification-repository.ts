import type { Notification, CreateNotificationInput } from "@/lib/domain/notification"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export interface INotificationRepository {
  findByUserId(userId: string): Promise<Notification[]>
  findUnreadByUserId(userId: string): Promise<Notification[]>
  countUnread(userId: string): Promise<number>
  create(notification: CreateNotificationInput): Promise<Notification>
  markAsRead(notificationId: string): Promise<void>
  checkExists(userId: string, taskId: string): Promise<boolean>
}

class SupabaseNotificationRepository implements INotificationRepository {
  constructor(private supabase: any) {}

  async findByUserId(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*, tasks(title)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) throw new Error(error.message)
    return data || []
  }

  async countUnread(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) throw new Error(error.message)
    return count || 0
  }

  async create(notification: CreateNotificationInput): Promise<Notification> {
    const { data, error } = await this.supabase.from("notifications").insert(notification).select().single()

    if (error) throw new Error(error.message)
    return data
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

    if (error) throw new Error(error.message)
  }

  async checkExists(userId: string, taskId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("id")
      .eq("user_id", userId)
      .eq("task_id", taskId)
      .single()

    return !!data && !error
  }
}

export function createNotificationRepository(context: "server" | "client"): INotificationRepository {
  if (context === "server") {
    return new SupabaseNotificationRepository(createServerClient())
  }
  return new SupabaseNotificationRepository(createBrowserClient())
}
