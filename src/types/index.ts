/**
 * Represents a single task in the application
 */
export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
  selected?: boolean
}

/**
 * Represents a column containing tasks
 */
export interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
  order?: number
}

/**
 * Filter options for tasks
 */
export type TaskFilter = 'all' | 'completed' | 'incomplete'

/**
 * Search and filter state
 */
export interface SearchAndFilter {
  searchQuery: string
  filter: TaskFilter
}

/**
 * Operations available for tasks
 */
export interface TaskOperations {
  onAddTask: (columnId: string, taskText: string) => void
  onRemoveTask: (columnId: string, taskId: string) => void
  onToggleTaskComplete: (columnId: string, taskId: string) => void
  onEditTask: (columnId: string, taskId: string, newText: string) => void
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string, newIndex?: number) => void
  onToggleTaskSelection: (columnId: string, taskId: string) => void
  onSelectAllTasks: (columnId: string, selected: boolean) => void
  onBulkDeleteTasks: (columnId: string, taskIds: string[]) => void
  onBulkToggleComplete: (columnId: string, taskIds: string[], completed: boolean) => void
  onBulkMoveTasks: (taskIds: string[], fromColumnId: string, toColumnId: string) => void
}

/**
 * Operations available for columns
 */
export interface ColumnOperations {
  onAddColumn: (title: string) => void
  onRemoveColumn: (columnId: string) => void
  onEditColumn: (columnId: string, newTitle: string) => void
  onMoveColumn: (columnId: string, newIndex: number) => void
}

/**
 * Combined operations interface
 */
export interface BoardOperations extends TaskOperations, ColumnOperations {
  searchQuery: string
}

