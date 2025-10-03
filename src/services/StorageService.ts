import type { Column } from '../types'

/**
 * Service class for handling localStorage operations
 * Provides methods to save and retrieve task board data
 */
export class StorageService {
  private static readonly STORAGE_KEY = 'taskboard_data'
  private static readonly VERSION_KEY = 'taskboard_version'
  private static readonly CURRENT_VERSION = '1.0.0'

  /**
   * Save columns to localStorage
   * @param columns Array of columns to save
   */
  static saveColumns(columns: Column[]): void {
    try {
      const data = {
        columns,
        version: this.CURRENT_VERSION,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION)
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
    }
  }

  /**
   * Get columns from localStorage
   * @returns Array of columns or empty array if none found
   */
  static getColumns(): Column[] {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY)
      if (!storedData) {
        return []
      }

      const data = JSON.parse(storedData)

      const storedVersion = localStorage.getItem(this.VERSION_KEY)
      if (storedVersion !== this.CURRENT_VERSION) {
        console.warn('Storage version mismatch, clearing data')
        this.clearStorage()
        return []
      }

      return data.columns || []
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
      return []
    }
  }

  /**
   * Clear all stored data
   */
  static clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.VERSION_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}
