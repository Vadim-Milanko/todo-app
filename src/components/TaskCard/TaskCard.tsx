import { useState } from 'react'

import type { Task } from '../../types'
import { formatDate } from '../../utils/date'

import styles from './TaskCard.module.css'

interface TaskCardProps {
  task: Task
  searchQuery: string
  onRemove: () => void
  onToggleComplete: () => void
  onEdit: (newText: string) => void
  onToggleSelection: () => void
}

/**
 * TaskCard component with support for editing, selection, and search highlighting
 * Provides inline editing, selection checkbox, and highlights search terms
 */
export function TaskCard({
  task,
  searchQuery,
  onRemove,
  onToggleComplete,
  onEdit,
  onToggleSelection
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  /**
   * Highlights search terms in the task text
   */
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className={styles.highlight}>
            {part}
          </mark>
        )
      }
      return part
    })
  }

  const handleEdit = () => {
    const trimmedText = editText.trim()
    if (trimmedText && trimmedText !== task.text) {
      onEdit(trimmedText)
    }
    setIsEditing(false)
    setEditText(task.text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditText(task.text)
    }
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  return (
    <div className={`${styles.taskCard} ${task.completed ? styles.completed : ''} ${task.selected ? styles.selected : ''}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <label className={styles.selectionLabel} title="Select for bulk operations">
            <input
              type="checkbox"
              className={styles.selectionCheckbox}
              checked={task.selected || false}
              onChange={onToggleSelection}
            />

            <span className={styles.selectionCustom}>
              {task.selected && <span className={styles.selectionMark}>✓</span>}
            </span>

            <span className={styles.selectionText}>Select</span>
          </label>

          <button className={styles.deleteButton} onClick={onRemove} title="Delete task">
            ×
          </button>
        </div>

        <div className={styles.statusSection}>
          <label className={styles.statusLabel} title={task.completed ? "Mark as incomplete" : "Mark as complete"}>
            <input
              type="checkbox"
              className={styles.statusCheckbox}
              checked={task.completed}
              onChange={onToggleComplete}
            />

            <span className={styles.statusCustom}>
              {task.completed && <span className={styles.statusMark}>✓</span>}
            </span>

            <span className={styles.statusText}>
              {task.completed ? 'Completed' : 'Complete'}
            </span>
          </label>
        </div>

        <div className={styles.textSection}>
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyDown}
              className={styles.textInput}
              autoFocus
              rows={2}
            />
          ) : (
            <div
              className={styles.text}
              onDoubleClick={handleDoubleClick}
              title="Double-click to edit"
            >
              {highlightSearchTerm(task.text, searchQuery)}
            </div>
          )}
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
