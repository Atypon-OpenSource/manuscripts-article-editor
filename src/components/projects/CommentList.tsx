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
  CommentAnnotation,
  UserProfile
} from '@manuscripts/json-schema'
import {
  CommentTarget, CommentType,
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
  usePermissions,
} from '@manuscripts/style-guide'
import {buildKeyword} from '@manuscripts/transform'
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
import {
  getCommentMarkerID
} from "@manuscripts/body-editor";
import {
  commentsKey
} from "@manuscripts/body-editor";
import {scrollIntoViewIfNeeded} from "../../lib/scroll";

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}

export const CommentList: React.FC<Props> = ({ editor }) => {
  const [
    {
      selectedCommentID,
      newComments,
      user,
      collaborators,
      collaboratorsById,
      keywords,
      saveTrackModel,
    },
    dispatch,
  ] = useStore((store) => ({
    selectedCommentID: store.selectedCommentID,
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

  const setSelectedCommentID = (id?: string) => {
    const comments = commentsKey.getState(state)
    if (comments && id) {
      id = comments.commentIDs.get(id) || id
    }
    dispatch({
      selectedCommentID: id,
    })
  }

  const createKeyword = useCallback(
    (name: string) => saveTrackModel(buildKeyword(name)),
    [saveTrackModel]
  )

  const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
    Pattern.CommentFilter.ALL
  )

  const { comments, saveComment, setResolved, createReply, deleteComment } =
    useCommentOperation(view, setSelectedCommentID)

  const commentsLabels = useCommentLabel()

  useEffect(() => {
    document.querySelectorAll('.selected-comment').forEach((e) => e.classList.remove('selected-comment'))
    if (!selectedCommentID) {
      return
    }
    const markerID = getCommentMarkerID(selectedCommentID)
    const marker = document.getElementById(markerID)
    if (marker) {
      marker.classList.add('selected-comment')
      scrollIntoViewIfNeeded(marker)
    }
  }, [selectedCommentID])

  const onFocusOut = (id: string, content: string) => {
    if (id && newComments.has(id) && content.length < 1) {
      deleteComment(id)
    }
    return true
  }

  const isNew = (comment: CommentAnnotation) => newComments.has(comment._id)

  const isSelected = (comment: CommentType) => {
    const comments = commentsKey.getState(state)
    if (!comments) {
      return false
    }
    return selectedCommentID === comments.commentIDs.get(comment._id)
  }

  const can = usePermissions()

  const selectedCommentStyle = selectedCommentID ? `#${CSS.escape(getCommentMarkerID(selectedCommentID))}.highlight { background-color: #ffe0b2 !important; }` : ''

  if (!comments.length) {
    return <Pattern.EmptyCommentsListPlaceholder />
  }

  return (
    <React.Fragment>
      <style>
        {selectedCommentStyle}
      </style>
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
                      scrollIntoHighlight={() => setSelectedCommentID(comment._id)}
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
