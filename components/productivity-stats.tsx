"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Clock, Zap } from "lucide-react"
import type { ProductivityMetrics } from "@/lib/domain/analytics"

export function ProductivityStats({ metrics }: { metrics: ProductivityMetrics }) {
  const stats = [
    {
      title: "Completion Rate",
      value: `${metrics.completionRate}%`,
      description: `Overall task completion percentage`,
      icon: Target,
    },
    {
      title: "This Week",
      value: metrics.completedThisWeek,
      description: "Tasks completed in the last 7 days",
      icon: TrendingUp,
    },
    {
      title: "Avg. Estimated Time",
      value: metrics.avgEstimatedTime > 0 ? `${metrics.avgEstimatedTime}m` : "N/A",
      description: "Average time estimated per task",
      icon: Clock,
    },
    {
      title: "Avg. Actual Time",
      value: metrics.avgActualTime > 0 ? `${metrics.avgActualTime}m` : "N/A",
      description: "Average time spent per task",
      icon: Zap,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
