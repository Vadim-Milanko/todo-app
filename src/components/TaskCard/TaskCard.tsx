import type { Task } from '../../types'
import { formatDate } from '../../utils/date'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  task: Task
  onRemove: () => void
  onToggleComplete: () => void
}

export function TaskCard({ task, onRemove, onToggleComplete }: TaskCardProps) {
  return (
    <div className={`${styles.taskCard} ${task.completed ? styles.completed : ''}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              className={styles.checkbox}
              checked={task.completed}
              onChange={onToggleComplete}
            />
            <span className={styles.checkboxCustom}>
              {task.completed && <span className={styles.checkmark}>✓</span>}
            </span>
          </label>

          <button className={styles.deleteButton} onClick={onRemove}>
            ×
          </button>
        </div>

        <div className={styles.text}>
          {task.text}
        </div>

        <div className={styles.footer}>
          <span className={styles.date}>
            {formatDate(task.createdAt)}
          </span>

          {task.priority && (
            <span className={`${styles.priority} ${styles[task.priority]}`}>
              {task.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
