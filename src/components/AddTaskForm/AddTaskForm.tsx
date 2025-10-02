import { useState, useRef, useEffect } from 'react'

import styles from './AddTaskForm.module.css'

interface AddTaskFormProps {
  onSubmit: (taskText: string) => void
  onCancel: () => void
}

export function AddTaskForm({ onSubmit, onCancel }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedText = taskText.trim()

    if (trimmedText) {
      onSubmit(trimmedText)
      setTaskText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        className={styles.textarea}
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter task description..."
        rows={3}
        maxLength={500}
      />
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!taskText.trim()}
        >
          Add Task
        </button>

        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      <div className={styles.hint}>
        Press Enter to add, Escape to cancel
      </div>
    </form>
  )
}

