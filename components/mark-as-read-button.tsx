"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createNotificationRepository } from "@/lib/repositories/notification-repository"
import { createTaskRepository } from "@/lib/repositories/task-repository.client"
import { NotificationService } from "@/lib/services/notification-service"

export function MarkAsReadButton({ notificationId }: { notificationId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleMarkAsRead = async () => {
    setIsLoading(true)

    const notificationRepo = createNotificationRepository("client")
    const taskRepo = createTaskRepository("client")
    const notificationService = new NotificationService(notificationRepo, taskRepo)

    await notificationService.markAsRead(notificationId)

    router.refresh()
    setIsLoading(false)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleMarkAsRead} disabled={isLoading}>
      <Check className="h-4 w-4" />
    </Button>
  )
}
