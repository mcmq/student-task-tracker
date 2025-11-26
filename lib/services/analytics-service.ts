import type { Task } from "@/lib/domain/task"
import type { ITaskRepository } from "@/lib/repositories/task-repository.client"
import {
  AnalyticsCalculator,
  type TaskStats,
  type ProductivityMetrics,
  type CategoryStats,
  type PriorityStats,
} from "@/lib/domain/analytics"

export class AnalyticsService {
  constructor(private taskRepo: ITaskRepository) {}

  async getTaskStats(userId: string): Promise<TaskStats> {
    const tasks = await this.taskRepo.findByUserId(userId)
    return AnalyticsCalculator.calculateTaskStats(tasks)
  }

  async getProductivityMetrics(userId: string): Promise<ProductivityMetrics> {
    const tasks = await this.taskRepo.findByUserId(userId)
    return AnalyticsCalculator.calculateProductivityMetrics(tasks)
  }

  async getCategoryBreakdown(userId: string): Promise<CategoryStats[]> {
    const tasks = await this.taskRepo.findByUserId(userId)
    return AnalyticsCalculator.calculateCategoryBreakdown(tasks)
  }

  async getPriorityDistribution(userId: string): Promise<PriorityStats[]> {
    const tasks = await this.taskRepo.findByUserId(userId)
    return AnalyticsCalculator.calculatePriorityDistribution(tasks)
  }

  async getUpcomingDeadlines(userId: string, limit = 5): Promise<Task[]> {
    const tasks = await this.taskRepo.findByUserId(userId)
    const incompleteTasks = tasks
      .filter((t) => t.status !== "Completed")
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, limit)

    return incompleteTasks
  }
}
