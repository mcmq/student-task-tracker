import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react"
import type { TaskStats as TaskStatsType } from "@/lib/domain/analytics"

export function TaskStats({ stats }: { stats: TaskStatsType }) {
  const statsDisplay = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: AlertCircle,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsDisplay.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
