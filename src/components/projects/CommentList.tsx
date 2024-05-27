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
  commentScroll,
  isHighlightComment,
  isThereSelector,
} from '@manuscripts/body-editor'
import { CommentAnnotation, UserProfile } from '@manuscripts/json-schema'
import {
  CommentTarget,
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
  usePermissions,
} from '@manuscripts/style-guide'
import { buildKeyword } from '@manuscripts/transform'
import { TextSelection } from 'prosemirror-state'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  default as useCommentOperation,
  useCommentLabel,
} from '../../hooks/use-comment-manager'
import { useCreateEditor } from '../../hooks/use-create-editor'
import { useStore } from '../../store'
import * as Pattern from './CommentListPatterns'
import { HighlightedText } from './HighlightedText'

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}

export const CommentList: React.FC<Props> = ({ editor }) => {
  const [
    {
      newComments,
      user,
      collaborators,
      collaboratorsById,
      keywords,
      saveTrackModel,
    },
  ] = useStore((store) => ({
    user: store.user,
    collaborators: store.collaborators || new Map<string, UserProfile>(),
    collaboratorsById: store.collaboratorsById,
    //removed from the store but left here to limit scope of changes.
    keywords: new Map(),
    manuscriptID: store.manuscriptID,
    saveTrackModel: store.saveTrackModel,
    newComments: store.newComments,
  }))
  const { state, view } = editor

  const createKeyword = useCallback(
    (name: string) => saveTrackModel(buildKeyword(name)),
    [saveTrackModel]
  )

  const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
    Pattern.CommentFilter.ALL
  )

  const [selectedHighlightId, setSelectedHighlightId] = useState<string>()

  const { comments, saveComment, setResolved, createReply, deleteComment } =
    useCommentOperation(view, setSelectedHighlightId)

  const commentsLabels = useCommentLabel()

  /**
   * check if the selection pointing to a highlight node
   */
  useEffect(() => {
    const childCount = state.selection.$from.parent.content.childCount
    const nodeIndex = state.selection.$from.index()

    if (state.selection instanceof TextSelection && childCount > nodeIndex) {
      const nodeBeforePos = state.selection.$from.posAtIndex(nodeIndex - 1)
      const nodeAfterPos = state.selection.$from.posAtIndex(nodeIndex + 1)
      const nodeBeforeNode = state.doc.nodeAt(nodeBeforePos)
      const nodeAfterNode = state.doc.nodeAt(nodeAfterPos)
      if (
        nodeBeforeNode &&
        nodeAfterNode &&
        nodeBeforeNode.type === state.schema.nodes.highlight_marker &&
        nodeAfterNode.type === state.schema.nodes.highlight_marker
      ) {
        setSelectedHighlightId(nodeAfterNode.attrs.id)
        return
      }
    }
    setSelectedHighlightId(undefined)
  }, [state])

  useEffect(() => {
    if (selectedHighlightId) {
      commentScroll(selectedHighlightId, 'inspector', true)
    }
  }, [selectedHighlightId])

  const onFocusOut = useCallback(
    (id: string, content: string) => {
      if (id && newComments.has(id) && content.length < 1) {
        deleteComment(id)
      }
      return true
    },
    [deleteComment, newComments]
  )

  const scrollIntoHighlight = (comment: CommentAnnotation) => {
    const commentId = isThereSelector(comment.selector)
      ? comment._id
      : comment.target
    commentScroll(commentId, 'editor', isHighlightComment(comment))
    setSelectedHighlightId(undefined)
  }

  const isNew = (comment: CommentAnnotation) => newComments.has(comment._id)

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
                    id={
                      isThereSelector(comment.selector)
                        ? comment._id
                        : comment.target
                    }
                    isSelected={false}
                    isNew={isNew(comment as CommentAnnotation)}
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
                      scrollIntoHighlight={scrollIntoHighlight}
                      onFocusOut={onFocusOut}
                      handleCreateReply={createReply}
                      can={can}
                      currentUserId={user._id}
                      handleSetResolved={() => setResolved(comment)}
                      isNew={isNew(comment as CommentAnnotation)}
                    >
                      <HighlightedText
                        state={state}
                        commentsLabels={commentsLabels}
                        comment={comment as CommentAnnotation}
                        onClick={scrollIntoHighlight}
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
                        isNew={isNew(comment as CommentAnnotation)}
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
