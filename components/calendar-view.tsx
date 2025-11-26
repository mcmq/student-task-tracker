"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { Task } from "@/lib/domain/task"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns"

export function CalendarView({ tasks }: { tasks: Task[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.due_date)
      return isSameDay(taskDate, date)
    })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              const dayTasks = getTasksForDate(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isTodayDate = isToday(day)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative p-2 text-sm rounded-lg border transition-colors min-h-20
                    ${!isCurrentMonth ? "text-muted-foreground bg-muted/50" : ""}
                    ${isTodayDate ? "border-primary bg-primary/5" : "border-border"}
                    ${isSelected ? "ring-2 ring-primary" : ""}
                    hover:bg-accent
                  `}
                >
                  <div className="font-medium mb-1">{format(day, "d")}</div>
                  <div className="flex flex-col gap-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className={`h-1 w-full rounded ${getPriorityColor(task.priority)}`} />
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 2} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg space-y-2">
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${task.priority === "High"
                            ? "bg-red-500/10 text-red-500"
                            : task.priority === "Medium"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-green-500/10 text-green-500"
                          }`}
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${task.status === "Completed"
                            ? "bg-green-500/10 text-green-500"
                            : task.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {format(new Date(task.due_date), "h:mm a")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No tasks scheduled for this day</p>
            )
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Click on a date to view tasks</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
