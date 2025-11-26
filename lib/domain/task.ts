export type TaskPriority = "Low" | "Medium" | "High"
export type TaskStatus = "Pending" | "In Progress" | "Completed"
export type TaskCategory = "Assignment" | "Project" | "Exam" | "Reading" | "Other"

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  due_date: string
  estimated_time: number | null
  actual_time: number | null
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  due_date: Date
  estimated_time?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  category?: TaskCategory
  priority?: TaskPriority
  status?: TaskStatus
  due_date?: Date
  estimated_time?: number
  actual_time?: number
}

// Business Rules
export function isTaskOverdue(task: Task): boolean {
  return new Date(task.due_date) < new Date() && task.status !== "Completed"
}

export function validateTask(input: CreateTaskInput): string[] {
  const errors: string[] = []

  if (!input.title || input.title.trim().length === 0) {
    errors.push("Title is required")
  }

  if (input.title && input.title.length > 200) {
    errors.push("Title must be less than 200 characters")
  }

  if (input.due_date < new Date()) {
    errors.push("Due date cannot be in the past")
  }

  if (input.estimated_time && input.estimated_time < 0) {
    errors.push("Estimated time must be positive")
  }

  return errors
}
