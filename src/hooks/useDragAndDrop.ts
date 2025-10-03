import { useEffect, useRef } from 'react'
import { 
  draggable, 
  dropTargetForElements,
  monitorForElements
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export interface DragData extends Record<string | symbol, unknown> {
  type: 'task'
  taskId: string
  columnId: string
}

export interface DropData extends Record<string | symbol, unknown> {
  type: 'column'
  columnId: string
}

/**
 * Hook for making a task draggable
 */
export function useDraggable(
  data: DragData,
  onDragStart?: () => void,
  onDragEnd?: () => void
) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    return draggable({
      element,
      getInitialData: () => data,
      onDragStart: () => {
        onDragStart?.()
        element.style.opacity = '0.6'
        element.style.transform = 'rotate(3deg)'
      },
      onDrop: () => {
        onDragEnd?.()
        element.style.opacity = '1'
        element.style.transform = 'rotate(0deg)'
      }
    })
  }, [data, onDragStart, onDragEnd])

  return elementRef
}

/**
 * Hook for making a column a drop target
 */
export function useDropTarget(
  data: DropData,
  onDrop: (dragData: DragData) => void
) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData: () => data,
      canDrop: ({ source }) => {
        const dragData = source.data as unknown as DragData
        return dragData.type === 'task' && dragData.columnId !== data.columnId
      },
      onDragEnter: () => {
        element.style.backgroundColor = 'rgba(212, 184, 150, 0.1)'
        element.style.borderColor = '#d4b896'
      },
      onDragLeave: () => {
        element.style.backgroundColor = ''
        element.style.borderColor = ''
      },
      onDrop: ({ source }) => {
        element.style.backgroundColor = ''
        element.style.borderColor = ''
        const dragData = source.data as unknown as DragData
        onDrop(dragData)
      }
    })
  }, [data, onDrop])

  return elementRef
}

/**
 * Hook for monitoring drag operations globally
 */
export function useDragMonitor(
  onDragStart?: () => void,
  onDragEnd?: () => void
) {
  useEffect(() => {
    return monitorForElements({
      onDragStart: () => {
        onDragStart?.()
        document.body.style.cursor = 'grabbing'
        document.body.classList.add('dragging')
      },
      onDrop: () => {
        onDragEnd?.()
        document.body.style.cursor = ''
        document.body.classList.remove('dragging')
      }
    })
  }, [onDragStart, onDragEnd])
}