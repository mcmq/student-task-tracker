"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { format } from "date-fns"
import { createTaskRepository } from "@/lib/repositories/task-repository.client"
import { TaskService } from "@/lib/services/task-service"
import type { Task } from "@/lib/domain/task"
import { toast } from "sonner"

export function TaskItem({ task }: { task: Task }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const router = useRouter()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Pending":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return ""
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const taskRepo = createTaskRepository()
      const taskService = new TaskService(taskRepo)

      await taskService.deleteTask(task.id)

      toast.success("Task deleted successfully")

      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMarkComplete = async () => {
    try {
      const taskRepo = createTaskRepository()
      const taskService = new TaskService(taskRepo)

      await taskService.completeTask(task.id)

      toast.success("Task marked as complete")

      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete task")
    }
  }

  const dueDate = new Date(task.due_date)
  const isOverdue = dueDate < new Date() && task.status !== "Completed"

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-2">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{task.category}</Badge>
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Due: {format(dueDate, "MMM d, yyyy")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.status !== "Completed" && (
              <Button size="sm" variant="ghost" onClick={handleMarkComplete}>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
      {showEditDialog && <EditTaskDialog task={task} open={showEditDialog} onOpenChange={setShowEditDialog} />}
    </>
  )
}
