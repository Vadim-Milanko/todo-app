import { useState } from 'react'

import type { Column as ColumnType, TaskOperations } from '../../types'
import { TaskCard } from '../TaskCard/TaskCard'
import { AddTaskForm } from '../AddTaskForm/AddTaskForm'

import styles from './Column.module.css'

interface ColumnProps extends TaskOperations {
  column: ColumnType
}

export function Column({
  column,
  onAddTask,
  onRemoveTask,
  onToggleTaskComplete
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleAddTask = (taskText: string) => {
    onAddTask(column.id, taskText)
    setIsAddingTask(false)
  }

  const completedCount = column.tasks.filter(task => task.completed).length
  const totalCount = column.tasks.length

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.title}>{column.title}</h2>

        <div className={styles.stats}>
          <span className={styles.count}>
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tasks}>
          {column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onRemove={() => onRemoveTask(column.id, task.id)}
              onToggleComplete={() => onToggleTaskComplete(column.id, task.id)}
            />
          ))}
        </div>

        {isAddingTask ? (
          <AddTaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        ) : (
          <button
            className={styles.addButton}
            onClick={() => setIsAddingTask(true)}
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  )
}
