import { useState, useMemo } from 'react'

import type { Column as ColumnType, TaskOperations } from '../../types'
import { TaskCard } from '../TaskCard/TaskCard'
import { AddTaskForm } from '../AddTaskForm/AddTaskForm'

import styles from './Column.module.css'

interface ColumnProps extends TaskOperations {
  column: ColumnType
  searchQuery: string
  allColumns: ColumnType[]
  onRemoveColumn: (columnId: string) => void
  onEditColumn: (columnId: string, newTitle: string) => void
}

/**
 * Column component that displays tasks and handles column-specific operations
 * Supports task selection, bulk operations, and column management
 */
export function Column({
  column,
  searchQuery,
  allColumns,
  onAddTask,
  onRemoveTask,
  onToggleTaskComplete,
  onEditTask,
  onToggleTaskSelection,
  onSelectAllTasks,
  onBulkDeleteTasks,
  onBulkToggleComplete,
  onBulkMoveTasks,
  onRemoveColumn,
  onEditColumn
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)

  // Calculate task statistics
  const { completedCount, totalCount, selectedTasks, selectedCount } = useMemo(() => {
    const completed = column.tasks.filter(task => task.completed).length
    const total = column.tasks.length
    const selected = column.tasks.filter(task => task.selected)
    return {
      completedCount: completed,
      totalCount: total,
      selectedTasks: selected,
      selectedCount: selected.length
    }
  }, [column.tasks])

  const allSelected = selectedCount > 0 && selectedCount === totalCount
  const someSelected = selectedCount > 0 && selectedCount < totalCount

  // Task operations
  const handleAddTask = (taskText: string) => {
    onAddTask(column.id, taskText)
    setIsAddingTask(false)
  }

  const handleSelectAll = () => {
    onSelectAllTasks(column.id, !allSelected)
  }

  // Column operations
  const handleEditTitle = () => {
    if (editTitle.trim() && editTitle !== column.title) {
      onEditColumn(column.id, editTitle.trim())
    }
    setIsEditingTitle(false)
    setEditTitle(column.title)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditTitle()
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
      setEditTitle(column.title)
    }
  }

  const handleDeleteColumn = () => {
    if (window.confirm(`Are you sure you want to delete "${column.title}" column? All tasks will be lost.`)) {
      onRemoveColumn(column.id)
    }
  }

  // Bulk operations
  const handleBulkDelete = () => {
    const selectedIds = selectedTasks.map(task => task.id)
    onBulkDeleteTasks(column.id, selectedIds)
  }

  const handleBulkComplete = () => {
    const selectedIds = selectedTasks.map(task => task.id)
    onBulkToggleComplete(column.id, selectedIds, true)
  }

  const handleBulkIncomplete = () => {
    const selectedIds = selectedTasks.map(task => task.id)
    onBulkToggleComplete(column.id, selectedIds, false)
  }

  const handleBulkMove = (targetColumnId: string) => {
    const selectedIds = selectedTasks.map(task => task.id)
    onBulkMoveTasks(selectedIds, column.id, targetColumnId)
  }

  // Show bulk actions when tasks are selected
  const shouldShowBulkActions = selectedCount > 0

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditTitle}
              onKeyDown={handleKeyDown}
              className={styles.titleInput}
              autoFocus
              maxLength={50}
            />
          ) : (
            <h2
              className={styles.title}
              onClick={() => setIsEditingTitle(true)}
              title="Click to edit column title"
            >
              {column.title}
            </h2>
          )}

          <button
            className={styles.deleteColumnButton}
            onClick={handleDeleteColumn}
            title="Delete column"
          >
            ×
          </button>
        </div>

        <div className={styles.stats}>
          <span className={styles.count}>
            {completedCount}/{totalCount}
          </span>

          {totalCount > 0 && (
            <label className={styles.selectAllLabel} title={allSelected ? 'Deselect all tasks' : 'Select all tasks'}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected
                }}
                onChange={handleSelectAll}
                className={styles.selectAllCheckbox}
              />

              <span className={styles.selectAllCustom}>
                {allSelected && <span className={styles.selectAllMark}>✓</span>}
              </span>

              <span className={styles.selectAllText}>
                {allSelected ? 'Deselect All' : 'Select All'}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {shouldShowBulkActions && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkInfo}>
            {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
          </div>

          <div className={styles.bulkButtons}>
            <button
              className={styles.bulkButton}
              onClick={handleBulkComplete}
              title="Mark selected as complete"
            >
              ✓ Complete
            </button>

            <button
              className={styles.bulkButton}
              onClick={handleBulkIncomplete}
              title="Mark selected as incomplete"
            >
              ○ Incomplete
            </button>

            <button
              className={styles.bulkButton}
              onClick={handleBulkDelete}
              title="Delete selected tasks"
            >
              🗑 Delete
            </button>

            {allColumns.length > 1 && (
              <div className={styles.moveDropdown}>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkMove(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className={styles.moveSelect}
                  defaultValue=""
                >
                  <option value="" disabled>Move to...</option>
                  {allColumns
                    .filter(col => col.id !== column.id)
                    .map(col => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.tasks}>
          {column.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              searchQuery={searchQuery}
              onRemove={() => onRemoveTask(column.id, task.id)}
              onToggleComplete={() => onToggleTaskComplete(column.id, task.id)}
              onEdit={(newText: string) => onEditTask(column.id, task.id, newText)}
              onToggleSelection={() => onToggleTaskSelection(column.id, task.id)}
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
