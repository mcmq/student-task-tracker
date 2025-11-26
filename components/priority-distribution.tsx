"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PriorityStats } from "@/lib/domain/analytics"

export function PriorityDistribution({ priorityStats }: { priorityStats: PriorityStats[] }) {
  const priorityColors: Record<string, string> = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
        <CardDescription>Task completion rates by priority level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {priorityStats.map((priority) => (
          <div key={priority.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${priorityColors[priority.name]}`} />
                <span className="font-medium">{priority.name} Priority</span>
              </div>
              <span className="text-muted-foreground">
                {priority.completed} / {priority.total} completed
              </span>
            </div>
            <Progress value={priority.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
