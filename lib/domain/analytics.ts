import type { Task } from "./task"

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  pending: number
}

export interface ProductivityMetrics {
  completionRate: number
  completedThisWeek: number
  avgEstimatedTime: number
  avgActualTime: number
}

export interface CategoryStats {
  name: string
  value: number
}

export interface PriorityStats {
  name: string
  total: number
  completed: number
  percentage: number
}

export interface WeeklyCompletionData {
  day: string
  completed: number
}

// Business logic for analytics calculations
export class AnalyticsCalculator {
  static calculateTaskStats(tasks: Task[]): TaskStats {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      pending: tasks.filter((t) => t.status === "Pending").length,
    }
  }

  static calculateProductivityMetrics(tasks: Task[]): ProductivityMetrics {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "Completed").length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const tasksWithTime = tasks.filter((t) => t.estimated_time && t.actual_time && t.status === "Completed")
    const avgEstimated =
      tasksWithTime.length > 0
        ? Math.round(tasksWithTime.reduce((acc, t) => acc + (t.estimated_time || 0), 0) / tasksWithTime.length)
        : 0
    const avgActual =
      tasksWithTime.length > 0
        ? Math.round(tasksWithTime.reduce((acc, t) => acc + (t.actual_time || 0), 0) / tasksWithTime.length)
        : 0

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const completedThisWeek = tasks.filter((t) => {
      if (!t.completed_at) return false
      const completedDate = new Date(t.completed_at)
      return completedDate >= weekAgo && completedDate <= now
    }).length

    return {
      completionRate,
      completedThisWeek,
      avgEstimatedTime: avgEstimated,
      avgActualTime: avgActual,
    }
  }

  static calculateCategoryBreakdown(tasks: Task[]): CategoryStats[] {
    const categoryCounts = tasks.reduce(
      (acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }

  static calculatePriorityDistribution(tasks: Task[]): PriorityStats[] {
    const priorities: Array<"High" | "Medium" | "Low"> = ["High", "Medium", "Low"]

    return priorities.map((priority) => {
      const priorityTasks = tasks.filter((t) => t.priority === priority)
      const completed = priorityTasks.filter((t) => t.status === "Completed").length
      const total = priorityTasks.length
      const percentage = total > 0 ? (completed / total) * 100 : 0

      return {
        name: priority,
        total,
        completed,
        percentage,
      }
    })
  }
}
