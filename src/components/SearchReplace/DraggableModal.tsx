/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { ModalContainer, StyledModal } from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export const DraggableModal: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  onRequestClose: () => void
}> = ({ children, isOpen, onRequestClose }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: 0, top: 0, prevX: 0, prevY: 0 })
  const [drag, setDrag] = useState(false)

  const mouseDown = (event: React.MouseEvent) => {
    if (
      event.target instanceof Element &&
      (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON')
    ) {
      return
    }
    pos.prevX = event.screenX
    pos.prevY = event.screenY
    setPos((state) => ({
      ...state,
      prevX: event.screenX,
      prevY: event.screenY,
    }))
    setDrag(true)
  }

  const mouseMove = useCallback(
    function (event: React.MouseEvent) {
      if (!drag) {
        return
      }
      const left = pos.left + event.screenX - pos.prevX
      const top = pos.top + event.screenY - pos.prevY

      setPos((state) => ({
        ...state,
        left,
        top,
        prevX: event.screenX,
        prevY: event.screenY,
      }))
    },
    [pos, drag]
  )

  useEffect(() => {
    const mouseup = () => {
      setDrag(false)
    }
    document.addEventListener('mouseup', mouseup)
    return () => {
      document.removeEventListener('mouseup', mouseup)
    }
  }, [])

  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      pointerEventsOnBackdrop="none"
      style={{
        content: {
          left: pos.left + 'px',
          top: pos.top + 'px',
          transition: 'none',
        },
      }}
    >
      <DraggableModalContainer
        ref={ref}
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        data-cy="find-replace-modal"
      >
        {children}
      </DraggableModalContainer>
    </StyledModal>
  )
}

const DraggableModalContainer = styled(ModalContainer)`
  padding: 0 2rem 2rem 2rem;
`
