export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
}

export type TaskFilter = 'all' | 'completed' | 'incomplete'

export interface TaskOperations {
  onAddTask: (columnId: string, taskText: string) => void
  onRemoveTask: (columnId: string, taskId: string) => void
  onToggleTaskComplete: (columnId: string, taskId: string) => void
  onEditTask?: (columnId: string, taskId: string, newText: string) => void
}

export interface ColumnOperations {
  onAddColumn?: (title: string) => void
  onRemoveColumn?: (columnId: string) => void
  onEditColumn?: (columnId: string, newTitle: string) => void
}

