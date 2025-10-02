import { useState, useEffect } from 'react'
import { Board } from '../../components/Board/Board'
import { StorageService } from '../../services/StorageService'
import type { Column as ColumnType, Task } from '../../types'
import styles from './BoardPage.module.css'

const DEFAULT_COLUMNS: ColumnType[] = [
  { id: '1', title: 'To Do', tasks: [] },
  { id: '2', title: 'In Progress', tasks: [] },
  { id: '3', title: 'Done', tasks: [] }
]

export function BoardPage() {
  const [columns, setColumns] = useState<ColumnType[]>([])

  useEffect(() => {
    const savedColumns = StorageService.getColumns()
    if (savedColumns.length === 0) {
      setColumns(DEFAULT_COLUMNS)
      StorageService.saveColumns(DEFAULT_COLUMNS)
    } else {
      setColumns(savedColumns)
    }
  }, [])

  const updateColumns = (newColumns: ColumnType[]) => {
    setColumns(newColumns)
    StorageService.saveColumns(newColumns)
  }

  const addTask = (columnId: string, taskText: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
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

  return (
    <div className={styles.boardPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Board</h1>
      </header>

      <main className={styles.main}>
        <Board
          columns={columns}
          onAddTask={addTask}
          onRemoveTask={removeTask}
          onToggleTaskComplete={toggleTaskComplete}
        />
      </main>
    </div>
  )
}
