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
import {
  clearCommentSelection,
  Comment,
  CommentAttrs,
  commentsKey,
  InlineComment,
  isNodeComment,
  setCommentSelection,
} from '@manuscripts/body-editor'
import { CheckboxField, CheckboxLabel } from '@manuscripts/style-guide'
import { NodeSelection, TextSelection } from 'prosemirror-state'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { buildCommentTrees } from '../../lib/comments'
import { useStore } from '../../store'
import { CommentThread } from './CommentThread'

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px;
`

const CheckboxLabelText = styled.div`
  color: ${(props) => props.theme.colors.text.primary} !important;
`

export const CommentsPanel: React.FC = () => {
  const [{ view, newCommentID, selectedCommentKey }] = useStore((state) => ({
    view: state.view,
    newCommentID: state.newCommentID,
    selectedCommentKey: state.selectedCommentKey,
  }))

  const [showResolved, setShowResolved] = useState(true)

  const comments = useMemo(
    () =>
      view?.state ? commentsKey.getState(view.state)?.comments : undefined,
    [view?.state]
  )
  const trees = useMemo(
    () =>
      comments ? buildCommentTrees([...comments.values()], newCommentID) : [],
    [comments, newCommentID]
  )

  const setSelectedComment = (comment: Comment) => {
    if (!view) {
      return
    }
    const tr = view.state.tr
    setCommentSelection(tr, comment.key, comment.node.attrs.id, false)
    if (isNodeComment(comment)) {
      tr.setSelection(NodeSelection.create(view.state.doc, comment.target.pos))
    } else {
      const range = (comment as InlineComment).range
      const from = range.pos
      const to = from + range.size
      tr.setSelection(TextSelection.create(view.state.doc, from, to))
    }
    tr.scrollIntoView()
    view.focus()
    view.dispatch(tr)
  }

  const handleSave = (attrs: CommentAttrs) => {
    const comment = comments?.get(attrs.id)
    if (!comment) {
      return
    }
    const tr = view.state.tr
    tr.setNodeMarkup(comment.pos, undefined, attrs)
    clearCommentSelection(tr)
    view.dispatch(tr)
  }

  const handleDelete = (id: string) => {
    const comment = comments?.get(id)
    if (!comment) {
      return
    }
    const tr = view.state.tr
    tr.delete(comment.pos, comment.pos + comment.node.nodeSize)
    clearCommentSelection(tr)
    view.dispatch(tr)
  }

  return (
    <>
      <Header>
        <CheckboxLabel>
          <CheckboxField
            name={'show-resolved'}
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          <CheckboxLabelText>See resolved</CheckboxLabelText>
        </CheckboxLabel>
      </Header>
      {trees
        .filter((c) => showResolved || !c.comment.node.attrs.resolved)
        .map((c) => (
          <CommentThread
            key={c.comment.node.attrs.id}
            tree={c}
            isSelected={selectedCommentKey === c.comment.key}
            onSelect={() => setSelectedComment(c.comment)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))}
    </>
  )
}
