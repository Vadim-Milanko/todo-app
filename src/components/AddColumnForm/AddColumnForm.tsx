import { useState } from 'react'

import styles from './AddColumnForm.module.css'

interface AddColumnFormProps {
  onSubmit: (title: string) => void
  onCancel: () => void
}

/**
 * Form component for adding new columns to the board
 * Provides input validation and handles form submission
 */
export function AddColumnForm({ onSubmit, onCancel }: AddColumnFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()

    if (trimmedTitle) {
      onSubmit(trimmedTitle)
      setTitle('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className={styles.addColumnForm}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter column title..."
          className={styles.input}
          autoFocus
          maxLength={50}
        />
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!title.trim()}
          >
            Add Column
          </button>

          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
