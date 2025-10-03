import { useState, useEffect, useMemo } from 'react'

import { Board } from '../../components/Board/Board'
import { SearchAndFilter } from '../../components/SearchAndFilter/SearchAndFilter'
import { StorageService } from '../../services/StorageService'
import { useDragMonitor } from '../../hooks/useDragAndDrop'
import type { Column as ColumnType, Task, TaskFilter, SearchAndFilter as SearchAndFilterType } from '../../types'

import styles from './BoardPage.module.css'

const DEFAULT_COLUMNS: ColumnType[] = [
  { id: '1', title: 'To Do', tasks: [], order: 0 },
  { id: '2', title: 'In Progress', tasks: [], order: 1 },
  { id: '3', title: 'Done', tasks: [], order: 2 }
]

/**
 * Main board page component that manages the entire application state
 * Handles all task and column operations, search, and filtering
 */
export function BoardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [searchAndFilter, setSearchAndFilter] = useState<SearchAndFilterType>({
    searchQuery: '',
    filter: 'all'
  })

  // Monitor drag operations globally
  useDragMonitor()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedColumns = StorageService.getColumns()
    if (savedColumns.length === 0) {
      setColumns(DEFAULT_COLUMNS)
      StorageService.saveColumns(DEFAULT_COLUMNS)
    } else {
      // Ensure columns have order property for backward compatibility
      const columnsWithOrder = savedColumns.map((col, index) => ({
        ...col,
        order: col.order ?? index
      }))
      setColumns(columnsWithOrder.sort((a, b) => a.order! - b.order!))
    }
  }, [])

  const updateColumns = (newColumns: ColumnType[]) => {
    setColumns(newColumns)
    StorageService.saveColumns(newColumns)
  }

  const filterTasks = (tasks: Task[]): Task[] => {
    let filtered = tasks

    if (searchAndFilter.filter === 'completed') {
      filtered = filtered.filter(task => task.completed)
    } else if (searchAndFilter.filter === 'incomplete') {
      filtered = filtered.filter(task => !task.completed)
    }

    if (searchAndFilter.searchQuery) {
      const query = searchAndFilter.searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: filterTasks(column.tasks)
    }))
  }, [columns, searchAndFilter])

  const taskStats = useMemo(() => {
    const allTasks = columns.flatMap(col => col.tasks)
    return {
      total: allTasks.length,
      completed: allTasks.filter(task => task.completed).length
    }
  }, [columns])

  // Task Operations
  const addTask = (columnId: string, taskText: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      selected: false
    }

    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: [...column.tasks, newTask] }
        : column
    )
    updateColumns(updatedColumns)
  }

  const removeTask = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    )
    updateColumns(updatedColumns)
  }

  const toggleTaskComplete = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : column
    )
    updateColumns(updatedColumns)
  }

  const editTask = (columnId: string, taskId: string, newText: string) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task =>
              task.id === taskId ? { ...task, text: newText } : task
            )
          }
        : column
    )
    updateColumns(updatedColumns)
  }

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string, newIndex?: number) => {
    let taskToMove: Task | null = null

    // Remove task from source column
    const updatedColumns = columns.map(column => {
      if (column.id === fromColumnId) {
        const task = column.tasks.find(t => t.id === taskId)
        if (task) {
          taskToMove = task
          return { ...column, tasks: column.tasks.filter(t => t.id !== taskId) }
        }
      }
      return column
    })

    // Add task to target column
    if (taskToMove) {
      const finalColumns = updatedColumns.map(column => {
        if (column.id === toColumnId) {
          const newTasks = [...column.tasks]
          if (newIndex !== undefined) {
            newTasks.splice(newIndex, 0, taskToMove!)
          } else {
            newTasks.push(taskToMove!)
          }
          return { ...column, tasks: newTasks }
        }
        return column
      })
      updateColumns(finalColumns)
    }
  }

  const toggleTaskSelection = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task =>
              task.id === taskId ? { ...task, selected: !task.selected } : task
            )
          }
        : column
    )
    updateColumns(updatedColumns)
  }

  const selectAllTasks = (columnId: string, selected: boolean) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task => ({ ...task, selected }))
          }
        : column
    )
    updateColumns(updatedColumns)
  }

  const bulkDeleteTasks = (columnId: string, taskIds: string[]) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => !taskIds.includes(task.id)) }
        : column
    )
    updateColumns(updatedColumns)
  }

  const bulkToggleComplete = (columnId: string, taskIds: string[], completed: boolean) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map(task =>
              taskIds.includes(task.id) ? { ...task, completed, selected: false } : task
            )
          }
        : column
    )
    updateColumns(updatedColumns)
  }

  const bulkMoveTasks = (taskIds: string[], fromColumnId: string, toColumnId: string) => {
    const tasksToMove: Task[] = []

    // Remove tasks from source column
    const updatedColumns = columns.map(column => {
      if (column.id === fromColumnId) {
        const remainingTasks = column.tasks.filter(task => {
          if (taskIds.includes(task.id)) {
            tasksToMove.push({ ...task, selected: false })
            return false
          }
          return true
        })
        return { ...column, tasks: remainingTasks }
      }
      return column
    })

    // Add tasks to target column
    const finalColumns = updatedColumns.map(column =>
      column.id === toColumnId
        ? { ...column, tasks: [...column.tasks, ...tasksToMove] }
        : column
    )
    updateColumns(finalColumns)
  }

  // Column Operations
  const addColumn = (title: string) => {
    const newColumn: ColumnType = {
      id: Date.now().toString(),
      title,
      tasks: [],
      order: columns.length
    }
    updateColumns([...columns, newColumn])
  }

  const removeColumn = (columnId: string) => {
    const updatedColumns = columns.filter(col => col.id !== columnId)
    // Reorder remaining columns
    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index
    }))
    updateColumns(reorderedColumns)
  }

  const editColumn = (columnId: string, newTitle: string) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId ? { ...column, title: newTitle } : column
    )
    updateColumns(updatedColumns)
  }

  const moveColumn = (columnId: string, newIndex: number) => {
    const columnsCopy = [...columns]
    const columnIndex = columnsCopy.findIndex(col => col.id === columnId)

    if (columnIndex !== -1) {
      const [movedColumn] = columnsCopy.splice(columnIndex, 1)
      columnsCopy.splice(newIndex, 0, movedColumn)

      // Update order property
      const reorderedColumns = columnsCopy.map((col, index) => ({
        ...col,
        order: index
      }))
      updateColumns(reorderedColumns)
    }
  }

  const updateSearch = (query: string) => {
    setSearchAndFilter(prev => ({ ...prev, searchQuery: query }))
  }

  const updateFilter = (filter: TaskFilter) => {
    setSearchAndFilter(prev => ({ ...prev, filter }))
  }

  return (
    <div className={styles.boardPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Board</h1>

        <SearchAndFilter
          searchQuery={searchAndFilter.searchQuery}
          filter={searchAndFilter.filter}
          onSearchChange={updateSearch}
          onFilterChange={updateFilter}
          totalTasks={taskStats.total}
          completedTasks={taskStats.completed}
        />
      </header>

      <main className={styles.main}>
        <Board
          columns={filteredColumns}
          searchQuery={searchAndFilter.searchQuery}
          onAddTask={addTask}
          onRemoveTask={removeTask}
          onToggleTaskComplete={toggleTaskComplete}
          onEditTask={editTask}
          onMoveTask={moveTask}
          onToggleTaskSelection={toggleTaskSelection}
          onSelectAllTasks={selectAllTasks}
          onBulkDeleteTasks={bulkDeleteTasks}
          onBulkToggleComplete={bulkToggleComplete}
          onBulkMoveTasks={bulkMoveTasks}
          onAddColumn={addColumn}
          onRemoveColumn={removeColumn}
          onEditColumn={editColumn}
          onMoveColumn={moveColumn}
        />
      </main>
    </div>
  )
}
