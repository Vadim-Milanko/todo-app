import { useState } from 'react'

import type { Column as ColumnType, BoardOperations } from '../../types'
import { Column } from '../Column/Column'
import { AddColumnForm } from '../AddColumnForm/AddColumnForm'

import styles from './Board.module.css'

interface BoardProps extends BoardOperations {
  columns: ColumnType[]
}

/**
 * Main board component that displays columns and handles column operations
 * Supports adding new columns and manages the overall board layout
 */
export function Board({
  columns,
  searchQuery,
  onAddTask,
  onRemoveTask,
  onToggleTaskComplete,
  onEditTask,
  onMoveTask,
  onToggleTaskSelection,
  onSelectAllTasks,
  onBulkDeleteTasks,
  onBulkToggleComplete,
  onBulkMoveTasks,
  onAddColumn,
  onRemoveColumn,
  onEditColumn,
}: BoardProps) {
  const [isAddingColumn, setIsAddingColumn] = useState(false)

  const handleAddColumn = (title: string) => {
    onAddColumn(title)
    setIsAddingColumn(false)
  }

  return (
    <div className={styles.board}>
      <div className={styles.columnsContainer}>
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            searchQuery={searchQuery}
            onAddTask={onAddTask}
            onRemoveTask={onRemoveTask}
            onToggleTaskComplete={onToggleTaskComplete}
            onEditTask={onEditTask}
            onMoveTask={onMoveTask}
            onToggleTaskSelection={onToggleTaskSelection}
            onSelectAllTasks={onSelectAllTasks}
            onBulkDeleteTasks={onBulkDeleteTasks}
            onBulkToggleComplete={onBulkToggleComplete}
            onBulkMoveTasks={onBulkMoveTasks}
            onRemoveColumn={onRemoveColumn}
            onEditColumn={onEditColumn}
            allColumns={columns}
          />
        ))}

        {isAddingColumn ? (
          <AddColumnForm
            onSubmit={handleAddColumn}
            onCancel={() => setIsAddingColumn(false)}
          />
        ) : (
          <button
            className={styles.addColumnButton}
            onClick={() => setIsAddingColumn(true)}
          >
            <span className={styles.addIcon}>+</span>
            Add Column
          </button>
        )}
      </div>
    </div>
  )
}
