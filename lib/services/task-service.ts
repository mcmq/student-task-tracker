import type { ITaskRepository } from "@/lib/repositories/task-repository.client"
import { type CreateTaskInput, type UpdateTaskInput, validateTask, type Task } from "@/lib/domain/task"

export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    // Validate business rules
    const errors = validateTask(input)
    if (errors.length > 0) {
      throw new Error(errors.join(", "))
    }

    // Delegate to repository
    return this.taskRepository.create(userId, input)
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    // Add validation if needed
    return this.taskRepository.update(taskId, input)
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId)
  }

  async completeTask(taskId: string, actualTime?: number): Promise<Task> {
    return this.taskRepository.markComplete(taskId, actualTime)
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUserId(userId)
  }

  async getPendingTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.findByUserId(userId)
    return tasks.filter((task) => task.status === "Pending")
  }

  async getOverdueTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.findByUserId(userId)
    return tasks.filter((task) => new Date(task.due_date) < new Date() && task.status !== "Completed")
  }
}
