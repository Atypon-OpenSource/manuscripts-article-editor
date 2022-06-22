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
import { CommentWithUserColor } from '@manuscripts/quarterback-types'
import { TrackedChange } from '@manuscripts/track-changes-plugin'
import React, { useCallback, useState } from 'react'
import { FiEdit3, FiTrash } from 'react-icons/fi'
import styled from 'styled-components'

import { useAuthStore } from '../../../quarterback/useAuthStore'
import { useCommentStore } from '../../../quarterback/useCommentStore'
import { UserCircle } from '../UserCircle'
import { NewCommentForm } from './NewCommentForm'

interface IProps {
  className?: string
  change: TrackedChange
}

export const Comments = (props: IProps) => {
  const { className, change } = props
  const user = useAuthStore((state) => state.user)
  const isAdmin = false // useMemo(() => false, [user])
  const comments = useCommentStore(
    (state) => state.changeComments.get(change.id) || []
  )
  const isVisible = useCommentStore((state) =>
    state.openCommentLists.has(change.id)
  )
  const { updateComment, deleteComment } = useCommentStore()
  const isEditable = useCallback(
    (c: CommentWithUserColor) => isAdmin || c.user_model_id === user?.id,
    [user, isAdmin]
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editedCommentId, setEditedCommentId] = useState<string | undefined>()
  const [editedBody, setEditedBody] = useState('')

  function handleEdit(c: CommentWithUserColor) {
    if (editedCommentId === c.id) {
      setEditedCommentId(undefined)
      setEditedBody('')
    } else {
      setEditedCommentId(c.id)
      setEditedBody(c.body)
    }
  }
  function handleDelete(c: CommentWithUserColor) {
    deleteComment!(c.id)
  }
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editedCommentId) {
      setError('No edited comment')
      return
    }
    setLoading(true)
    try {
      const resp = await updateComment!(editedCommentId, { body: editedBody })
      if ('data' in resp) {
        setEditedCommentId(undefined)
        setEditedBody('')
      } else {
        setError(resp.err)
      }
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }
  function handleEditCancel() {
    setEditedCommentId(undefined)
    setEditedBody('')
  }
  return (
    <Container className={`${className || ''} ${isVisible ? '' : 'hidden'}`}>
      <Title>Comments</Title>
      <List>
        {comments.map((c: CommentWithUserColor, i: number) => (
          <ListItem key={`${c.id}-${i}`}>
            <CommentAuthor>
              <UserCircle color={c.user.color} currentUser={false}>
                {c.user.name.charAt(0)}
              </UserCircle>
            </CommentAuthor>
            <Body>
              <CommentTop>
                <CommentName>
                  <Name>{c.user.name}</Name>
                  {isEditable(c) && (
                    <IconButtons>
                      <Button onClick={() => handleEdit(c)}>
                        <FiEdit3 size={16} />
                      </Button>
                      <Button onClick={() => handleDelete(c)}>
                        <FiTrash size={16} />
                      </Button>
                    </IconButtons>
                  )}
                </CommentName>
                <Time>{new Date(c.createdAt).toLocaleString()}</Time>
              </CommentTop>
              <Text>
                {editedCommentId === c.id ? (
                  <EditForm onSubmit={handleEditSubmit}>
                    <textarea
                      value={editedBody}
                      required
                      onChange={(e) => setEditedBody(e.target.value)}
                    />
                    {error && <ErrorMsg>{error}</ErrorMsg>}
                    <button type="submit" disabled={loading}>
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </EditForm>
                ) : (
                  <span>{c.body}</span>
                )}
              </Text>
            </Body>
          </ListItem>
        ))}
      </List>
      <NewCommentForm change={change} />
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid #e7e7e7;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  &.hidden {
    display: none;
    visibility: hidden;
  }
`
const Title = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  margin: 0.5rem;
  text-transform: uppercase;
`
const List = styled.ul<{ indent?: boolean }>`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
`
const ListItem = styled.li`
  display: flex;
  margin: 0.5rem 0;
`
const CommentAuthor = styled.div`
  margin: 0.5rem 0.75rem;
`
const CommentTop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const CommentName = styled.div`
  display: flex;
  justify-content: space-between;
`
const Name = styled.small`
  font-weight: 600;
`
const Time = styled.small`
  color: rgb(110, 110, 110);
`
const IconButtons = styled.div`
  & > button + button {
    margin-left: 0.25rem;
  }
`
const Button = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
  &:hover {
    opacity: 0.7;
  }
`
const Body = styled.div`
  flex-grow: 1;
  margin-right: 0.5rem;
`
const Text = styled.div`
  align-items: center;
  display: flex;
  margin: 0.25rem 0 0 0;
  white-space: pre-line;
`
const EditForm = styled.form`
  margin: 0;
  width: 100%;
  textarea {
    height: 5rem;
    margin: 0 0 0.5rem 0;
    padding: 4px;
    width: calc(100% - 8px);
  }
  button {
    cursor: pointer;
  }
  button + button {
    margin-left: 0.5rem;
  }
`
const ErrorMsg = styled.small`
  color: red;
`
