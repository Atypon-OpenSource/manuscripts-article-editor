/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Contributor } from '@manuscripts/manuscripts-json-schema'
import { ConnectDragSource, ConnectDropTarget } from 'react-dnd'

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
