/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */

import {
  AttentionOrangeIcon,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;

  svg {
    padding-left: 14px;
  }
`

const CancelButton = styled(SecondaryButton)`
  padding: 4px ${(props) => props.theme.grid.unit * 3}px;
  font-size: 14px;
`
const DeleteButton = styled(PrimaryButton)`
  padding: 4px ${(props) => props.theme.grid.unit * 3}px;
  margin-right: 16px;
  font-size: 14px;
`
const Message = styled.div`
  font-weight: 700;
  color: #000;
  font-size: 14px;
  line-height: 16px;
  margin: 0 8px;
`

const DeleteConfirmation = styled.div<{ isReply?: boolean }>`
  position: absolute;
  top: -8px;
  left: ${(props) => (props.isReply ? '-24px' : '-8px')};
  right: -8px;
  bottom: -16px;
  opacity: 0.95;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  z-index: 10;
`

const Buttons = styled(ButtonGroup)`
  & button:not(:last-of-type) {
    margin-right: 4px;
  }
`

interface DeleteCommentConfirmationProps {
  isReply: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const DeleteCommentConfirmation: React.FC<
  DeleteCommentConfirmationProps
> = ({ isReply, onCancel, onConfirm }) => {
  return (
    <DeleteConfirmation isReply={isReply}>
      <MessageContainer>
        <AttentionOrangeIcon />
        <Message>Delete this comment?</Message>
      </MessageContainer>
      <Buttons>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <DeleteButton onClick={onConfirm}>Delete</DeleteButton>
      </Buttons>
    </DeleteConfirmation>
  )
}
