# Student Task Tracker - Simplified Hexagonal Architecture

This document explains the architecture pattern used in the Student Task Tracker System.

## Architecture Overview

The application follows a **Simplified Hexagonal Architecture** (also known as Ports & Adapters) to separate business logic from infrastructure concerns.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                            │
│  (Next.js App Router - React Components)                    │
│  app/**, components/**                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │ Uses
┌─────────────────▼───────────────────────────────────────────┐
│                     Service Layer                           │
│  (Business Logic - Use Cases)                               │
│  lib/services/**                                            │
│  - TaskService                                              │
│  - NotificationService                                      │
│  - AnalyticsService                                         │
│  - AuthService                                              │
└─────────────────┬───────────────────────────────────────────┘
                  │ Uses
┌─────────────────▼───────────────────────────────────────────┐
│                   Repository Layer                          │
│  (Data Access Interfaces + Adapters)                        │
│  lib/repositories/**                                        │
│  - ITaskRepository → SupabaseTaskRepository                │
│  - INotificationRepository → SupabaseNotificationRepository│
│  - IAuthRepository → SupabaseAuthRepository                │
└─────────────────┬───────────────────────────────────────────┘
                  │ Implements
┌─────────────────▼───────────────────────────────────────────┐
│                     Domain Layer                            │
│  (Core Business Entities & Rules)                           │
│  lib/domain/**                                              │
│  - Task, Notification, User, Analytics types                │
│  - Validation functions                                     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Layer Responsibilities

### 1. Domain Layer (`lib/domain/*`)
**Pure business logic - No framework dependencies**

- Defines core entities (Task, Notification, User, Analytics)
- Contains business validation rules
- Type definitions for all domain concepts

**Example:**
\`\`\`typescript
// lib/domain/task.ts
export type Task = {
  id: string
  title: string
  status: TaskStatus
  // ... other fields
}

export function validateTask(input: CreateTaskInput): string[] {
  const errors: string[] = []
  if (!input.title || input.title.trim().length === 0) {
    errors.push("Task title is required")
  }
  return errors
}
\`\`\`

### 2. Repository Layer (`lib/repositories/*`)
**Data access abstraction**

- Defines interfaces (ports) for data operations
- Implements adapters (Supabase in our case)
- Can be swapped without affecting business logic

**Example:**
\`\`\`typescript
// lib/repositories/task-repository.ts
export interface ITaskRepository {
  findById(taskId: string): Promise<Task | null>
  create(userId: string, input: CreateTaskInput): Promise<Task>
  // ... other methods
}

class SupabaseTaskRepository implements ITaskRepository {
  // Implementation using Supabase
}

export function createTaskRepository(type: "server" | "client"): ITaskRepository {
  return new SupabaseTaskRepository(...)
}
\`\`\`

### 3. Service Layer (`lib/services/*`)
**Business logic orchestration**

- Coordinates between repositories
- Enforces business rules
- Contains use cases

**Example:**
\`\`\`typescript
// lib/services/task-service.ts
export class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    // Validate
    const errors = validateTask(input)
    if (errors.length > 0) throw new Error(errors.join(", "))

    // Delegate to repository
    return this.taskRepository.create(userId, input)
  }
}
\`\`\`

### 4. UI Layer (`app/*`, `components/*`)
**Presentation and user interaction**

- Next.js pages and components
- Calls services, never repositories directly
- Handles user input and display

**Example:**
\`\`\`typescript
// components/create-task-dialog.tsx
const handleSubmit = async () => {
  const taskRepo = createTaskRepository("client")
  const taskService = new TaskService(taskRepo)
  await taskService.createTask(userId, input)
}
\`\`\`

## Benefits of This Architecture

### 1. **Testability**
- Easy to test business logic without database
- Can create in-memory repositories for tests
- Services can be tested in isolation

### 2. **Flexibility**
- Can swap Supabase for another database
- Only need to change repository implementations
- Business logic remains unchanged

### 3. **Maintainability**
- Clear separation of concerns
- Each layer has a single responsibility
- Easy to locate and fix bugs

### 4. **Team Scalability**
- Different developers can work on different layers
- Well-defined interfaces reduce conflicts
- Clear contracts between layers

## File Structure

\`\`\`
lib/
├── domain/                    # Business entities & rules
│   ├── task.ts
│   ├── notification.ts
│   ├── user.ts
│   └── analytics.ts
├── repositories/              # Data access interfaces & adapters
│   ├── task-repository.ts
│   ├── notification-repository.ts
│   └── auth-repository.ts
├── services/                  # Business logic layer
│   ├── task-service.ts
│   ├── notification-service.ts
│   ├── analytics-service.ts
│   └── auth-service.ts
└── supabase/                  # Infrastructure (Supabase clients)
    ├── client.ts
    ├── server.ts
    └── middleware.ts

app/                           # UI Layer - Next.js routes
components/                    # UI Layer - React components
\`\`\`

## Usage Examples

### Creating a Task (Client-side)

\`\`\`typescript
// 1. Create repository
const taskRepo = createTaskRepository("client")

// 2. Create service
const taskService = new TaskService(taskRepo)

// 3. Use service method
await taskService.createTask(userId, {
  title: "Complete assignment",
  priority: "High",
  due_date: new Date("2024-12-01")
})
\`\`\`

### Fetching Notifications (Server-side)

\`\`\`typescript
// In a server component
const notificationRepo = createNotificationRepository("server")
const taskRepo = createTaskRepository("server")
const notificationService = new NotificationService(notificationRepo, taskRepo)

// Generate notifications based on task deadlines
await notificationService.generateNotificationsForUser(userId)

// Get all notifications
const notifications = await notificationService.getUserNotifications(userId)
\`\`\`

### Authentication

\`\`\`typescript
// Login
const authRepo = createAuthRepository("client")
const authService = new AuthService(authRepo)

await authService.signIn(
  { email, password },
  redirectUrl
)

// Sign out
await authService.signOut()
\`\`\`

## Clean Code Principles Applied

1. **Single Responsibility Principle (SRP)**
   - Each class/function has one reason to change
   - Services handle business logic
   - Repositories handle data access
   - Components handle UI

2. **Dependency Inversion Principle (DIP)**
   - Services depend on interfaces, not concrete implementations
   - Can inject different repository implementations

3. **Interface Segregation Principle (ISP)**
   - Repositories have focused interfaces
   - Clients only depend on methods they use

4. **Open/Closed Principle (OCP)**
   - Open for extension (add new repositories)
   - Closed for modification (existing code unchanged)

## Adding New Features

### To add a new feature:

1. **Define domain model** in `lib/domain/`
2. **Create repository interface** in `lib/repositories/`
3. **Implement Supabase adapter** in same repository file
4. **Create service** in `lib/services/`
5. **Use service in UI** components

### Example: Adding a "Comments" feature

\`\`\`typescript
// 1. Domain
// lib/domain/comment.ts
export type Comment = {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
}

// 2. Repository
// lib/repositories/comment-repository.ts
export interface ICommentRepository {
  findByTaskId(taskId: string): Promise<Comment[]>
  create(input: CreateCommentInput): Promise<Comment>
}

// 3. Service
// lib/services/comment-service.ts
export class CommentService {
  constructor(private commentRepo: ICommentRepository) {}
  
  async addComment(input: CreateCommentInput): Promise<Comment> {
    return this.commentRepo.create(input)
  }
}

// 4. UI
// components/comment-form.tsx
const commentRepo = createCommentRepository("client")
const commentService = new CommentService(commentRepo)
await commentService.addComment({ task_id, content })
\`\`\`

## Migration from Direct Database Calls

### Before (Direct Supabase calls):
\`\`\`typescript
// ❌ Bad: Direct database access in component
const supabase = createClient()
const { data } = await supabase
  .from("tasks")
  .insert({ title, user_id })
\`\`\`

### After (Hexagonal Architecture):
\`\`\`typescript
// ✅ Good: Using service layer
const taskRepo = createTaskRepository("client")
const taskService = new TaskService(taskRepo)
await taskService.createTask(userId, { title, ... })
\`\`\`

## Key Patterns Used

1. **Repository Pattern** - Abstracts data access
2. **Service Layer Pattern** - Encapsulates business logic
3. **Dependency Injection** - Services receive repositories
4. **Factory Pattern** - `createTaskRepository()` functions
5. **Strategy Pattern** - Different repository implementations

## Testing Strategy

\`\`\`typescript
// Create in-memory repository for testing
class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = []
  
  async create(userId: string, input: CreateTaskInput): Promise<Task> {
    const task = { id: uuid(), ...input, user_id: userId }
    this.tasks.push(task)
    return task
  }
  
  async findByUserId(userId: string): Promise<Task[]> {
    return this.tasks.filter(t => t.user_id === userId)
  }
}

// Test without database
describe('TaskService', () => {
  it('creates a task', async () => {
    const repo = new InMemoryTaskRepository()
    const service = new TaskService(repo)
    
    const task = await service.createTask('user-1', {
      title: 'Test task',
      priority: 'High',
      due_date: new Date()
    })
    
    expect(task.title).toBe('Test task')
  })
})
\`\`\`

## Conclusion

This simplified hexagonal architecture provides a clean, maintainable structure without the overwhelming complexity of a full hexagonal implementation. It strikes a balance between architectural purity and practical development speed, making it ideal for a student project that may grow over time.
