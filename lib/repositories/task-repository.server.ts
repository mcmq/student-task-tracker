import type { Task, CreateTaskInput, UpdateTaskInput } from "@/lib/domain/task"
import type { SupabaseClient } from "@supabase/supabase-js"

export interface ITaskRepository {
  findById(taskId: string): Promise<Task | null>
  findByUserId(userId: string): Promise<Task[]>
  create(userId: string, input: CreateTaskInput): Promise<Task>
  update(taskId: string, input: UpdateTaskInput): Promise<Task>
  delete(taskId: string): Promise<void>
  markComplete(taskId: string, actualTime?: number): Promise<Task>
}

// Supabase Implementation (Adapter)
import { createClient as createServerClient } from "@/lib/supabase/server"

class SupabaseTaskRepository implements ITaskRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(taskId: string): Promise<Task | null> {
    const { data, error } = await this.supabase.from("tasks").select("*").eq("id", taskId).single()

    if (error || !data) return null
    return data as Task
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const supabase = await this.supabase   // <-- make sure it is resolved
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true })

    if (error || !data) return []
    return data as Task[]
  }

  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const { data, error } = await this.supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: input.title,
        description: input.description || null,
        category: input.category,
        priority: input.priority,
        due_date: input.due_date.toISOString(),
        estimated_time: input.estimated_time || null,
        status: "Pending",
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data as Task
  }

  async update(taskId: string, input: UpdateTaskInput): Promise<Task> {
    const updateData: any = { ...input }
    if (input.due_date) {
      updateData.due_date = input.due_date.toISOString()
    }

    const { data, error } = await this.supabase.from("tasks").update(updateData).eq("id", taskId).select().single()

    if (error) throw new Error(error.message)
    return data as Task
  }

  async delete(taskId: string): Promise<void> {
    const { error } = await this.supabase.from("tasks").delete().eq("id", taskId)

    if (error) throw new Error(error.message)
  }

  async markComplete(taskId: string, actualTime?: number): Promise<Task> {
    const updateData: any = {
      status: "Completed",
      completed_at: new Date().toISOString(),
    }

    if (actualTime !== undefined) {
      updateData.actual_time = actualTime
    }

    const { data, error } = await this.supabase.from("tasks").update(updateData).eq("id", taskId).select().single()

    if (error) throw new Error(error.message)
    return data as Task
  }
}

// Factory functions for easy creation
export function createTaskRepository(): ITaskRepository {
  // For server-side, return a wrapper that awaits the client
  return new SupabaseTaskRepository(createServerClient() as any)
}
