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
  commentsKey,
  InlineComment,
  isNodeComment,
  setCommentSelection,
} from '@manuscripts/body-editor'
import { CommentAnnotation, UserProfile } from '@manuscripts/json-schema'
import {
  CommentTarget,
  CommentType,
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
  usePermissions,
} from '@manuscripts/style-guide'
import { buildKeyword, schema } from '@manuscripts/transform'
import { NodeSelection, TextSelection } from 'prosemirror-state'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import {
  default as useCommentOperation,
  useCommentLabel,
} from '../../hooks/use-comment-manager'
import { useStore } from '../../store'
import { scrollToElement } from '../track-changes/TrackChangesPanel'
import * as Pattern from './CommentListPatterns'
import { HighlightedText } from './HighlightedText'

const scrollIntoView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  if (rect.bottom > window.innerHeight || rect.top < 150) {
    element.scrollIntoView()
  }
}

export const CommentList: React.FC = () => {
  const [
    {
      editor,
      selectedCommentKey,
      newCommentID,
      user,
      collaborators,
      collaboratorsById,
      keywords,
      saveTrackModel,
    },
  ] = useStore((store) => ({
    editor: store.editor,
    selectedCommentKey: store.selectedCommentKey,
    user: store.user,
    collaborators: store.collaborators || new Map<string, UserProfile>(),
    collaboratorsById: store.collaboratorsById,
    //removed from the store but left here to limit scope of changes.
    keywords: new Map(),
    manuscriptID: store.manuscriptID,
    saveTrackModel: store.saveTrackModel,
    newCommentID: store.newCommentID,
  }))
  const { state, view } = editor

  const selectedRef = useCallback((n) => {
    if (n !== null) {
      scrollIntoView(n as HTMLElement)
    }
  }, [])

  const getComment = (id?: string): Comment | undefined => {
    if (!id) {
      return
    }
    const com = commentsKey.getState(state)
    return com?.comments.get(id)
  }

  const setSelectedCommentID = (id?: string) => {
    const comment = getComment(id)
    if (!comment || !view) {
      return
    }
    const tr = state.tr
    setCommentSelection(tr, comment.key, id, false)
    if (isNodeComment(comment)) {
      tr.setSelection(NodeSelection.create(state.doc, comment.target.pos))
    } else {
      const range = (comment as InlineComment).range
      const from = range.pos
      const to = from + range.size
      tr.setSelection(TextSelection.create(state.doc, from, to))
    }

    const node = tr.doc.nodeAt(comment.target.pos)

    if (node && node.type === schema.nodes.bibliography_item) {
      const bibItemElement = document.querySelector(
        `[id="${node.attrs.id}"]`
      ) as HTMLElement
      bibItemElement && scrollToElement(bibItemElement)
    } else {
      tr.scrollIntoView()
    }
    view.focus()
    view.dispatch(tr)
  }

  const createKeyword = useCallback(
    (name: string) => saveTrackModel(buildKeyword(name)),
    [saveTrackModel]
  )

  const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
    Pattern.CommentFilter.ALL
  )

  const { comments, saveComment, setResolved, createReply, deleteComment } =
    useCommentOperation()

  const commentsLabels = useCommentLabel()

  const onFocusOut = (id: string, content: string) => {
    if (newCommentID === id && content.length < 1) {
      deleteComment(id)
    }
    return true
  }

  const isSelected = (comment: CommentType) => {
    const com = commentsKey.getState(state)
    return selectedCommentKey === com?.comments.get(comment._id)?.key
  }

  const can = usePermissions()

  if (!comments.length) {
    return <Pattern.EmptyCommentsListPlaceholder />
  }

  return (
    <React.Fragment>
      <Pattern.SeeResolvedCheckbox
        isEmpty={!comments.length}
        commentFilter={commentFilter}
        setCommentFilter={setCommentFilter}
      />
      <Container className={'comments-group'}>
        {comments.map(([target, commentData]) => {
          // TODO: move this into a child component?
          const selectedNoteData =
            commentFilter === Pattern.CommentFilter.ALL
              ? commentData
              : commentData.filter((note) => !note.comment.resolved)
          return (
            <CommentTarget key={target} isSelected={false}>
              {selectedNoteData.map(({ comment, children }) => (
                <Pattern.Thread key={comment._id}>
                  <NoteBodyContainer
                    id={`${comment._id}-card`}
                    isSelected={isSelected(comment)}
                    ref={isSelected(comment) ? selectedRef : null}
                    isNew={comment._id === newCommentID}
                  >
                    <CommentWrapper
                      comment={comment}
                      createKeyword={createKeyword}
                      deleteComment={deleteComment}
                      getCollaborator={(id) => collaboratorsById?.get(id)}
                      getKeyword={(id) => keywords.get(id)}
                      listCollaborators={() =>
                        Array.from(collaborators.values())
                      }
                      listKeywords={() => []}
                      saveComment={saveComment}
                      scrollIntoHighlight={() =>
                        setSelectedCommentID(comment._id)
                      }
                      onFocusOut={onFocusOut}
                      handleCreateReply={createReply}
                      can={can}
                      currentUserId={user._id}
                      handleSetResolved={() => setResolved(comment)}
                      isNew={comment._id === newCommentID}
                    >
                      <HighlightedText
                        state={state}
                        commentsLabels={commentsLabels}
                        comment={comment as CommentAnnotation}
                        onClick={() => setSelectedCommentID(comment._id)}
                      />
                    </CommentWrapper>
                  </NoteBodyContainer>

                  {children.map((comment) => (
                    <ReplyBodyContainer key={comment._id}>
                      <CommentWrapper
                        comment={comment}
                        createKeyword={createKeyword}
                        deleteComment={deleteComment}
                        getCollaborator={(id) => collaboratorsById?.get(id)}
                        getKeyword={(key: string) => keywords.get(key)}
                        isReply={true}
                        listCollaborators={() =>
                          Array.from(collaborators.values())
                        }
                        listKeywords={() => []}
                        saveComment={saveComment}
                        handleCreateReply={createReply}
                        can={can}
                        currentUserId={user._id}
                        isNew={comment._id === newCommentID}
                      />
                    </ReplyBodyContainer>
                  ))}
                </Pattern.Thread>
              ))}
            </CommentTarget>
          )
        })}
      </Container>
    </React.Fragment>
  )
}

const Container = styled(Pattern.Container)`
  .selected-comment {
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-left: 4px solid ${(props) => props.theme.colors.border.primary};
    background: ${(props) => props.theme.colors.background.selected};
  }
`
