import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle } from "lucide-react"
import { format, differenceInDays, isPast } from "date-fns"
import type { Task } from "@/lib/domain/task"

export function UpcomingDeadlines({ tasks }: { tasks: Task[] }) {
  if (!tasks || tasks.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const dueDate = new Date(task.due_date)
            const daysUntil = differenceInDays(dueDate, new Date())
            const isOverdue = isPast(dueDate)

            return (
              <div
                key={task.id}
                className="flex items-start justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
              >
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(dueDate, "MMM d, yyyy 'at' h:mm a")}</span>
                    {isOverdue ? (
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Overdue
                      </Badge>
                    ) : daysUntil === 0 ? (
                      <Badge variant="default" className="text-xs">
                        Today
                      </Badge>
                    ) : daysUntil === 1 ? (
                      <Badge variant="default" className="text-xs">
                        Tomorrow
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        In {daysUntil} days
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    task.priority === "High"
                      ? "bg-red-500/10 text-red-500"
                      : task.priority === "Medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
