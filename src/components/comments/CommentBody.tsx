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
import { Comment } from '@manuscripts/body-editor'
import {
  ButtonGroup,
  PrimaryButton,
  TertiaryButton,
} from '@manuscripts/style-guide'
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'

import { decodeHTMLEntities } from '../../lib/utils'

const CommentEditor = styled.textarea`
  cursor: text;
  font-family: ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.primary};
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  resize: none;

  width: 100%;
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
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
`

const CommentViewer = styled.div`
  flex: 1;

  font-family: ${(props) => props.theme.font.family.sans};
  line-height: 1.06;
  letter-spacing: -0.2px;
  color: ${(props) => props.theme.colors.text.primary};
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  word-wrap: break-word;
`

const EditorActions = styled(ButtonGroup)`
  & button:not(:last-of-type) {
    margin-right: 4px;
  }

  & ${TertiaryButton} {
    &:hover {
      background-color: inherit !important;
      border-color: transparent !important;
    }
  }
`

export interface CommentBodyProps {
  comment: Comment
  isEditing: boolean
  onSave: (content: string) => void
  onCancel: () => void
}

export const CommentBody: React.FC<CommentBodyProps> = ({
  comment,
  isEditing,
  onSave,
  onCancel,
}) => {
  const editor = useRef<HTMLTextAreaElement | null>(null)
  const handleSave = () => {
    if (editor.current) {
      onSave(editor.current.value)
    }
  }

  const ref = useCallback((e: HTMLTextAreaElement | null) => {
    if (e && editor.current !== e) {
      e.focus()
    }
    editor.current = e
  }, [])

  const [value, setValue] = useState(editor.current?.value || '')

  const disableSaveButton = useMemo(
    () => !value.length || comment.node.attrs.contents === value,
    [comment.node.attrs.contents, value]
  )
  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value)

  return (
    <>
      {isEditing ? (
        <>
          <CommentEditor
            data-cy="comment-editor"
            ref={ref}
            defaultValue={comment.node.attrs.contents}
            onChange={onTextChange}
            onBlur={(event) => !event.target.value.length && onCancel()}
          ></CommentEditor>
          <EditorActions data-cy="comment-actions">
            <TertiaryButton onClick={onCancel}>Cancel</TertiaryButton>
            <PrimaryButton onClick={handleSave} disabled={disableSaveButton}>
              Save
            </PrimaryButton>
          </EditorActions>
        </>
      ) : (
        <>
          <CommentViewer data-cy="comment-text">
            {decodeHTMLEntities(comment.node.attrs.contents)}
          </CommentViewer>
        </>
      )}
    </>
  )
}
