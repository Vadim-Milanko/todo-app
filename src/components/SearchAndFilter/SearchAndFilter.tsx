import type { TaskFilter } from '../../types'

import styles from './SearchAndFilter.module.css'

interface SearchAndFilterProps {
  searchQuery: string
  filter: TaskFilter
  onSearchChange: (query: string) => void
  onFilterChange: (filter: TaskFilter) => void
  totalTasks: number
  completedTasks: number
}

/**
 * Component for searching and filtering tasks
 * Provides search input and filter buttons with task statistics
 */
export function SearchAndFilter({
  searchQuery,
  filter,
  onSearchChange,
  onFilterChange,
  totalTasks,
  completedTasks
}: SearchAndFilterProps) {
  const incompleteTasks = totalTasks - completedTasks

  return (
    <div className={styles.searchAndFilter}>
      <div className={styles.searchSection}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className={styles.searchInput}
          />

          <div className={styles.searchIcon}>
            🔍
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All ({totalTasks})
          </button>

          <button
            className={`${styles.filterButton} ${filter === 'incomplete' ? styles.active : ''}`}
            onClick={() => onFilterChange('incomplete')}
          >
            Active ({incompleteTasks})
          </button>

          <button
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Completed ({completedTasks})
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className={styles.searchInfo}>
          Searching for: <span className={styles.searchTerm}>"{searchQuery}"</span>
        </div>
      )}
    </div>
  )
}
