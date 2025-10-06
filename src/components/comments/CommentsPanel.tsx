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
  Comment,
  CommentAttrs,
  commentsKey,
  HighlightMarkerAttrs,
  InlineComment,
  isNodeComment,
  setCommentSelection,
} from '@manuscripts/body-editor'
import { buildContribution } from '@manuscripts/json-schema'
import {
  CheckboxField,
  CheckboxLabel,
  ToggleHeader,
} from '@manuscripts/style-guide'
import { skipTracking } from '@manuscripts/track-changes-plugin'
import { generateNodeID, schema } from '@manuscripts/transform'
import { NodeSelection, TextSelection, Transaction } from 'prosemirror-state'
import { findChildrenByType } from 'prosemirror-utils'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { buildThreads, getOrphanComments, Thread } from '../../lib/comments'
import { useStore } from '../../store'
import { CommentsPlaceholder } from './CommentsPlaceholder'
import { CommentThread } from './CommentThread'

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px;
`

const CheckboxLabelText = styled.div`
  color: ${(props) => props.theme.colors.text.primary} !important;
  margin: 0 !important;
`

const scrollIntoView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  if (rect.bottom > window.innerHeight || rect.top < 150) {
    element.scrollIntoView()
  }
}

export const CommentsPanel: React.FC = () => {
  const [{ view, newCommentID, selectedCommentKey, user, doc }] = useStore(
    (state) => ({
      view: state.view,
      doc: state.doc,
      newCommentID: state.newCommentID,
      selectedCommentKey: state.selectedCommentKey,
      user: state.user,
    })
  )

  const [showResolved, setShowResolved] = useState(true)
  const [isActiveCommentsCollapsed, setToggleActiveComments] = useState(true)
  const [isOrphanCommentsCollapsed, setToggleOrphanComments] = useState(false)

  const toggleActiveComments = () =>
    setToggleActiveComments(!isActiveCommentsCollapsed)
  const toggleOrphanComments = () =>
    setToggleOrphanComments(!isOrphanCommentsCollapsed)

  const comments = useMemo(
    () =>
      view?.state ? commentsKey.getState(view.state)?.comments : undefined,
    [view?.state, doc] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const orphanComments = useMemo(
    () => view?.state && getOrphanComments(view.state),
    [view?.state] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const threads = useMemo(
    () => (comments ? buildThreads([...comments.values()], newCommentID) : []),
    [comments, newCommentID]
  )

  const orphanThreads = useMemo(
    () => (orphanComments ? buildThreads([...orphanComments.values()]) : []),
    [orphanComments]
  )

  const selectedRef = useCallback((e: HTMLElement | null) => {
    if (e) {
      scrollIntoView(e)
    }
  }, [])

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

  const insertCommentReply = (target: string, contents: string) => {
    if (!view) {
      return
    }
    const attrs = {
      id: generateNodeID(schema.nodes.comment),
      contents,
      target,
      contributions: [buildContribution(user._id)],
      resolved: false,
    }

    const comment = view.state.schema.nodes.comment.create(attrs)
    const comments = findChildrenByType(
      view.state.doc,
      view.state.schema.nodes.comments
    )[0]
    if (comments) {
      const pos = comments.pos + 1
      const tr = view.state.tr.insert(pos, comment)
      view.dispatch(skipTracking(tr))
    }
  }

  const handleSave = (attrs: CommentAttrs) => {
    const comment = comments?.get(attrs.id)
    if (!comment || !view) {
      return
    }
    const tr = view.state.tr
    tr.setNodeMarkup(comment.pos, undefined, attrs)
    view.dispatch(skipTracking(tr))
  }

  const deleteHighlightMarkers = (id: string, tr: Transaction) => {
    const nodes = findChildrenByType(doc, schema.nodes.highlight_marker)

    // Sort nodes in reverse order by position to ensure deletions do not affect the positions of subsequent nodes
    nodes.sort((a, b) => b.pos - a.pos)
    nodes.forEach(({ node, pos }) => {
      const attrs = node.attrs as HighlightMarkerAttrs

      if (attrs.id === id) {
        tr.delete(pos, pos + node.nodeSize)
      }
    })
  }

  const handleDelete = (id: string) => {
    const comment = comments?.get(id) || orphanComments?.get(id)
    if (!comment || !view) {
      return
    }
    const tr = view.state.tr
    tr.delete(comment.pos, comment.pos + comment.node.nodeSize)
    if (orphanComments?.get(id)) {
      const thread = orphanThreads.find(
        ({ comment }) => comment.node.attrs.id === id
      )
      thread?.replies.map((reply) =>
        tr.delete(reply.pos, reply.pos + reply.node.nodeSize)
      )
    }
    deleteHighlightMarkers(id, tr)
    view.dispatch(skipTracking(tr))
  }

  const isSelected = (thread: Thread) => {
    return thread && selectedCommentKey === thread.comment.key
  }

  if (!view) {
    return null
  }

  if (!threads.length && !orphanThreads.length) {
    return <CommentsPlaceholder />
  }

  return (
    <>
      <ToggleHeader
        title={`Active comments (${threads.length})`}
        isOpen={isActiveCommentsCollapsed}
        onToggle={toggleActiveComments}
      />
      {isActiveCommentsCollapsed && (
        <div data-cy="active-comments">
          {!!threads.length && (
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
          )}
          {threads
            .filter((c) => showResolved || !c.comment.node.attrs.resolved)
            .map((c, i, a) => (
              <CommentThread
                key={c.comment.node.attrs.id}
                ref={
                  isSelected(c) && !isSelected(a[i - 1]) ? selectedRef : null
                }
                thread={c}
                isSelected={isSelected(c)}
                onSelect={() => setSelectedComment(c.comment)}
                onSave={handleSave}
                onDelete={handleDelete}
                insertCommentReply={insertCommentReply}
              />
            ))}
        </div>
      )}
      <ToggleHeader
        title={`Orphan Comments (${orphanThreads.length})`}
        isOpen={isOrphanCommentsCollapsed}
        onToggle={toggleOrphanComments}
      />
      {isOrphanCommentsCollapsed && (
        <div data-cy="orphan-comments">
          {orphanThreads
            .filter((c) => showResolved || !c.comment.node.attrs.resolved)
            .map((c, i, a) => (
              <CommentThread
                key={c.comment.node.attrs.id}
                ref={
                  isSelected(c) && !isSelected(a[i - 1]) ? selectedRef : null
                }
                thread={c}
                isSelected={false}
                isOrphanComment={true}
                onSelect={() => ''}
                onSave={handleSave}
                onDelete={handleDelete}
                insertCommentReply={insertCommentReply}
              />
            ))}
        </div>
      )}
    </>
  )
}
