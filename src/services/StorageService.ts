import type { Column } from '../types'

export class StorageService {
  private static readonly STORAGE_KEY = 'taskboard_data'
  private static readonly VERSION_KEY = 'taskboard_version'
  private static readonly CURRENT_VERSION = '1.0.0'

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

  static clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.VERSION_KEY)
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }

  static isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  static getStorageInfo(): { used: number; available: boolean } {
    const available = this.isStorageAvailable()
    let used = 0

    if (available) {
      try {
        const data = localStorage.getItem(this.STORAGE_KEY)
        used = data ? new Blob([data]).size : 0
      } catch (error) {
        console.error('Failed to calculate storage usage:', error)
      }
    }

    return { used, available }
  }
}
