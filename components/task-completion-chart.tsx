"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns"

interface Task {
  id: string
  completed_at?: string | null
}

export function TaskCompletionChart({ tasks }: { tasks: Task[] }) {
  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const chartData = daysOfWeek.map((day) => {
    const completedOnDay = tasks.filter((task) => {
      if (!task.completed_at) return false
      const completedDate = new Date(task.completed_at)
      return isSameDay(completedDate, day)
    }).length

    return {
      day: format(day, "EEE"),
      completed: completedOnDay,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Completion</CardTitle>
        <CardDescription>Tasks completed this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar
              dataKey="completed"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
