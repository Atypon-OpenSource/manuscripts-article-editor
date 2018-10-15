import {
  ConnectDragSource,
  ConnectDropTarget,
  DragDropContext,
} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Contributor } from '../types/components'

export interface AuthorItem {
  _id: string
  index: number
  priority: number | null
}

export type DropSide = 'before' | 'after' | null

export type DropHandler = (
  source: AuthorItem,
  target: AuthorItem,
  position: DropSide,
  authors: Contributor[]
) => void

export interface DragSourceProps {
  authorItem: AuthorItem
  position: DropSide
}

export interface ConnectedDragSourceProps {
  connectDragSource: ConnectDragSource
  isDragging: boolean
  // canDrag: boolean
  item: DragSourceProps
}

export interface ConnectedDropTargetProps {
  connectDropTarget: ConnectDropTarget
  isOver: boolean
  isOverCurrent: boolean
  canDrop: boolean
}

export const withDragDropContext = DragDropContext(HTML5Backend)
