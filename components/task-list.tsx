"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskItem } from "@/components/task-item"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task } from "@/lib/domain/task"

export function TaskList({ userId, initialTasks }: { userId: string; initialTasks: Task[] }) {
  const pendingTasks = initialTasks.filter((t) => t.status === "Pending")
  const inProgressTasks = initialTasks.filter((t) => t.status === "In Progress")
  const completedTasks = initialTasks.filter((t) => t.status === "Completed")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Manage your academic tasks and deadlines</CardDescription>
          </div>
          <CreateTaskDialog userId={userId} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {initialTasks.length > 0 ? (
              initialTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No tasks yet. Create your first task to get started!
              </p>
            )}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-center py-8 text-muted-foreground">No pending tasks</p>
            )}
          </TabsContent>
          <TabsContent value="in-progress" className="space-y-4">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-center py-8 text-muted-foreground">No tasks in progress</p>
            )}
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-center py-8 text-muted-foreground">No completed tasks</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
