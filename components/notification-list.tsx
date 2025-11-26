import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { MarkAsReadButton } from "@/components/mark-as-read-button"
import { GenerateNotifications } from "@/components/generate-notifications"
import type { Notification } from "@/lib/domain/notification"

export function NotificationList({
  userId,
  notifications,
}: {
  userId: string
  notifications: Notification[]
}) {
  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">
              {"You're all caught up! Notifications will appear here when you have upcoming deadlines."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deadline_approaching":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "task_overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "task_completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-3">
      <GenerateNotifications userId={userId} />
      {notifications.map((notification) => (
        <Card key={notification.id} className={notification.is_read ? "opacity-60" : ""}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(notification.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.is_read && (
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                )}
                {!notification.is_read && <MarkAsReadButton notificationId={notification.id} />}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
