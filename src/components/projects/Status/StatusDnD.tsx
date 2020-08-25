/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
import { StatusLabel } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import StatusDnDColumn from './StatusDnDColumn'

interface StatusInputDnDProps {
  tasks: StatusLabel[]
  newTask: string
  saveOrder: (label: StatusLabel | string, priority: number) => Promise<void>
}

const StatusDnD: React.FC<StatusInputDnDProps> = ({
  tasks,
  newTask,
  saveOrder,
}) => {
  const dndColumns = ['newStatus', 'orderedStatus']
  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source } = result

      // dropped outside a droppable list
      if (!destination) {
        return
      }

      // dropped in same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return
      }

      // push back the labels that come after the newly reordered
      const tempLabels = tasks.splice(destination.index, tasks.length)
      tempLabels.map(async tempLabel => {
        await saveOrder(
          tempLabel,
          tempLabel.priority ? tempLabel.priority + 1 : 0
        )
      })

      await saveOrder(newTask, destination.index + 1)
    },
    [tasks, saveOrder]
  )
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {dndColumns.map((columnId: string) => (
        <StatusDnDColumn id={columnId} newTask={newTask} tasks={tasks} />
      ))}
    </DragDropContext>
  )
}

export default StatusDnD
