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
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
} from '@manuscripts/style-guide'
import React, { useState, useRef, useMemo, ChangeEvent } from 'react'
import styled from 'styled-components'

interface ReplyBoxProps {
  insertCommentReply: (target: string, contents: string) => void
  commentId: string
}

export const ReplyBox: React.FC<ReplyBoxProps> = ({
  insertCommentReply,
  commentId,
}) => {
  const [isTextBoxFocused, setIsTextBoxFocused] = useState(false)
  const [value, setValue] = useState('')
  const replyRef = useRef<HTMLTextAreaElement | null>(null)

  const handleFocus = () => setIsTextBoxFocused(true)
  const handleBlur = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!event.target.value.length) setIsTextBoxFocused(false)
  }

  const reply = () => {
    if (replyRef.current) {
      insertCommentReply(commentId, replyRef.current.value)
      setIsTextBoxFocused(false)
      setValue('')
      replyRef.current.value = ''
      replyRef.current.style.height = '30px' // Reset the height
    }
  }

  const disableSaveButton = useMemo(() => !value.length, [value])
  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (replyRef.current) {
      replyRef.current.style.height = '30px' // Reset the height
      replyRef.current.style.height = `${Math.min(
        replyRef.current.scrollHeight,
        55
      )}px` // Set the height based on content
    }
  }

  return (
    <>
      <TextBox
        data-cy="reply"
        placeholder="Reply..."
        ref={replyRef}
        onChange={onTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isTextBoxFocused && (
        <Actions data-cy="reply-actions">
          <SecondaryButton
            onClick={() => {
              setIsTextBoxFocused(false)
              setValue('')
              if (replyRef.current) {
                replyRef.current.value = ''
                replyRef.current.style.height = '30px' // Reset the height
              }
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={reply} disabled={disableSaveButton}>
            Reply
          </PrimaryButton>
        </Actions>
      )}
    </>
  )
}
const TextBox = styled.textarea`
  cursor: text;
  font-family: ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.primary};
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  resize: none;

  width: 100%;

  height: 30px;
  max-height: 55px;

  outline: 0;
  border: 1px solid #e2e2e2;
  border-radius: 6px;

  &:focus {
    background: #f2fbfc;
    border: 1px solid #bce7f6;
    border-radius: 6px;
  }

  box-sizing: border-box;
  padding: 3px 16px 3px 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
`

const Actions = styled(ButtonGroup)`
  & button:not(:last-of-type) {
    margin-right: 4px;
  }
`
