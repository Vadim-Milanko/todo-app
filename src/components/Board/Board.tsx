import type { Column as ColumnType, TaskOperations } from '../../types'
import { Column } from '../Column/Column'
import styles from './Board.module.css'

interface BoardProps extends TaskOperations {
  columns: ColumnType[]
}

export function Board({
  columns,
  onAddTask,
  onRemoveTask,
  onToggleTaskComplete
}: BoardProps) {
  return (
    <div className={styles.board}>
      <div className={styles.columnsContainer}>
        {columns.map(column => (
          <Column
            key={column.id}
            column={column}
            onAddTask={onAddTask}
            onRemoveTask={onRemoveTask}
            onToggleTaskComplete={onToggleTaskComplete}
          />
        ))}
      </div>
    </div>
  )
}
