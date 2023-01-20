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

import { Manuscript } from '@manuscripts/json-schema'
import React, { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'

interface DragItem {
  type: string
  id: string
}

type Side = 'before' | 'after'

export const SortableManuscript: React.FC<{
  setIndex: (id: string, index: number) => void
  index: number
  item: Manuscript
}> = ({ setIndex, children, item, index }) => {
  const [side, setSide] = useState<Side>()

  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, dragSource] = useDrag<
    DragItem,
    undefined,
    { isDragging: boolean }
  >({
    item: { type: 'manuscript', id: item._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, dropTarget] = useDrop<
    DragItem,
    undefined,
    { isOver: boolean }
  >({
    accept: 'manuscript',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover: (item, monitor) => {
      if (ref.current) {
        const offset = monitor.getClientOffset()

        if (offset) {
          const { bottom, top } = ref.current.getBoundingClientRect()
          const verticalHover = offset.y - top
          const verticalMiddle = (bottom - top) / 2

          setSide(verticalHover < verticalMiddle ? 'before' : 'after')
        }
      }
    },
    drop: (item, monitor) => {
      const fraction = side === 'before' ? -0.5 : 0.5
      setIndex(item.id, index + fraction)
      return undefined
    },
  })

  dragSource(dropTarget(ref))

  return (
    <div ref={ref}>
      <Container isDragging={isDragging}>
        <BeforeDropPreview isOver={isOver} side={side} />
        {children}
        <AfterDropPreview isOver={isOver} side={side} />
      </Container>
    </div>
  )
}

const DropPreview = styled.div<{ isOver: boolean; side?: Side }>`
  background: #65a3ff;
  height: 1px;
  z-index: 2;
  width: 100%;
  position: absolute;
`

const BeforeDropPreview = styled(DropPreview)`
  top: 0;
  visibility: ${(props) =>
    props.isOver && props.side === 'before' ? 'visible' : 'hidden'};
`

const AfterDropPreview = styled(DropPreview)`
  bottom: -1px;
  visibility: ${(props) =>
    props.isOver && props.side === 'after' ? 'visible' : 'hidden'};
`

const Container = styled.div<{ isDragging: boolean }>`
  opacity: ${(props) => (props.isDragging ? 0.25 : 1)};
  position: relative;
`
