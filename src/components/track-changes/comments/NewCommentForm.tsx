/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { TrackedChange } from '@manuscripts/track-changes-plugin'
import React, { useState } from 'react'
import styled from 'styled-components'

import { useAuthStore } from '../../../quarterback/useAuthStore'
import { useCommentStore } from '../../../quarterback/useCommentStore'
import { useDocStore } from '../../../quarterback/useDocStore'
import { UserCircle } from '../UserCircle'

interface IProps {
  className?: string
  change: TrackedChange
}

export const NewCommentForm = (props: IProps) => {
  const { className, change } = props
  const { user } = useAuthStore()
  const commentStore = useCommentStore()
  const docStore = useDocStore()

  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const docId = docStore.quarterbackDoc?.manuscript_model_id
    if (!docId) {
      setError('Failed to fetch quarterback document')
      return
    } else if (!user) {
      setError('Not logged in')
      return
    }
    setLoading(true)
    return commentStore
      .createComment(
        {
          body,
          target_id: change.id,
          doc_id: docId,
          snapshot_id: null,
        },
        user
      )
      .then((resp) => {
        if ('data' in resp) {
          setBody('')
          setError('')
        } else {
          setError(resp.err)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  function handleCancel() {
    setBody('')
  }
  return (
    <ReplyBox className={className || ''}>
      <CommentAuthor>
        <UserCircle color={user?.color || 'red'} currentUser={false}>
          {user?.name.charAt(0).toUpperCase()}
        </UserCircle>
      </CommentAuthor>
      <ReplyBody onSubmit={handleSubmit}>
        <Input
          placeholder="Reply..."
          value={body}
          required
          onChange={(e) => setBody(e.target.value)}
        />
        <ErrorMsg>{error}</ErrorMsg>
        <ReplyButtons>
          <SendButton type="submit" disabled={loading}>
            Send
          </SendButton>
          <SendButton type="button" disabled={loading} onClick={handleCancel}>
            Cancel
          </SendButton>
        </ReplyButtons>
      </ReplyBody>
    </ReplyBox>
  )
}

const CommentAuthor = styled.div`
  margin: 0.5rem 0.75rem;
`
const ReplyBox = styled.div`
  background: #e7e7e7;
  display: flex;
  padding: 0.25rem 0;
`
const ReplyBody = styled.form`
  align-items: end;
  display: flex;
  flex-direction: column;
  margin: 0 0.25rem 0 0;
  width: 100%;
`
const Input = styled.textarea`
  background: transparent;
  border: 0;
  box-sizing: border-box;
  height: 4rem;
  outline: none;
  padding: 8px 1rem 8px 0;
  width: 100%;
`
const ErrorMsg = styled.small`
  color: red;
`
const ReplyButtons = styled.div`
  & > button + button {
    margin-left: 0.5rem;
  }
`
const SendButton = styled.button`
  cursor: pointer;
`
