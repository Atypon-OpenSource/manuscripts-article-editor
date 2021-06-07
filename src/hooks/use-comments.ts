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
  Build,
  buildComment,
  buildContribution,
  ManuscriptEditorState,
  ManuscriptSchema,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import {
  CommentAnnotation,
  Contribution,
} from '@manuscripts/manuscripts-json-schema'
import {
  Annotation,
  commands,
  getTrackPluginState,
} from '@manuscripts/track-changes'
import { Command } from 'prosemirror-commands'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { useCallback, useEffect, useState } from 'react'

import { useManuscriptModels } from './use-manuscript-models'
import { useMicrostore } from './use-microstore'

interface UnsavedComment extends Build<CommentAnnotation> {
  contributions: Contribution[]
}

type CommentState = Array<{
  comment: CommentAnnotation | UnsavedComment
  annotation?: Annotation
  saveStatus: string
}>

export const getInitialCommentState = (
  comments: CommentAnnotation[],
  annotations: Annotation[]
): CommentState => {
  return comments.map((comment) => ({
    comment,
    annotation: annotations.find(
      (annotation) => annotation.uid === comment.target
    ),
    saveStatus: '',
  }))
}

export const updateComment = (
  id: string,
  commentData?: Partial<CommentAnnotation>,
  status?: string
) => (current: CommentState): CommentState => {
  return current.map((item) => {
    if (item.comment._id !== id) {
      return item
    }
    return {
      comment: { ...item.comment, ...commentData },
      annotation: item.annotation,
      saveStatus: status || item.saveStatus,
    }
  })
}

export const insertCommentFromAnnotation = (
  annotation: Annotation,
  doc: ProsemirrorNode<ManuscriptSchema>,
  user: UserProfileWithAvatar
) => (current: CommentState): CommentState => {
  const exists = !!current.find(
    (item) => item.comment.target === annotation.uid
  )
  if (exists) {
    return current
  }

  const newComment: UnsavedComment = {
    ...buildComment(annotation.uid),
    contributions: [buildContribution(user._id)],
    originalText: doc.textBetween(annotation.from, annotation.to),
    selector: {
      from: annotation.from,
      to: annotation.to,
    },
    resolved: false,
  }
  return current.concat({ comment: newComment, annotation, saveStatus: '' })
}

export const insertCommentReply = (
  target: string,
  user: UserProfileWithAvatar
) => (current: CommentState): CommentState => {
  const newComment: UnsavedComment = {
    ...buildComment(target),
    contributions: [buildContribution(user._id)],
    resolved: false,
  }
  return current.concat({ comment: newComment, saveStatus: '' })
}

export const removeComment = (id: string) => (
  current: CommentState
): CommentState => {
  return current.filter((item) => {
    if (item.comment._id === id || item.comment.target === id) {
      return false
    }
    return true
  })
}

// TODO: filter the comments by whether they are "RESOLVED"
export const topLevelComments = (state: CommentState): CommentState => {
  return state.filter((item) => item.comment.selector)
}

export const repliesOf = (
  state: CommentState,
  parentID: string
): CommentState => {
  return state.filter((item) => item.comment.target === parentID)
}

export const isSavedComment = (
  comment: CommentAnnotation | UnsavedComment
): comment is CommentAnnotation => {
  return !!(comment as CommentAnnotation).createdAt
}

export const getUnsavedComment = (state: CommentState): string | null => {
  const item = state.find((item) => !isSavedComment(item.comment))
  return item?.comment._id || null
}

export const getHighlightColor = (
  state: CommentState,
  comment: CommentAnnotation | UnsavedComment
): string | undefined => {
  const uid = comment.target
  const item = state.find((item) => item.annotation?.uid === uid)
  if (!item) {
    return undefined
  }
  return item.annotation?.color
}

export const useNewAnnotationEffect = (
  effect: (annotation: Annotation) => void,
  annotations: Annotation[]
) => {
  const [prevLastUpdated, setLastUpdated] = useState<number>()
  const lastUpdated = annotations[annotations.length - 1]?.updatedAt || 0
  useEffect(() => {
    if (
      typeof prevLastUpdated !== 'undefined' &&
      lastUpdated > prevLastUpdated
    ) {
      // this will run anytime there is a NEW annotation
      effect(annotations[annotations.length - 1])
    }

    // this will get updated every time
    setLastUpdated(lastUpdated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated, effect])
}

export const useComments = (
  comments: CommentAnnotation[],
  userProfile: UserProfileWithAvatar,
  editorState: ManuscriptEditorState,
  doCommand: (command: Command) => void
) => {
  const { annotations } = getTrackPluginState(editorState)
  const [state, dispatch] = useMicrostore(
    getInitialCommentState(comments, annotations)
  )

  useNewAnnotationEffect((newAnnotation: Annotation) => {
    dispatch(
      insertCommentFromAnnotation(newAnnotation, editorState.doc, userProfile)
    )
  }, annotations)

  const { saveModel, deleteModel } = useManuscriptModels()

  const saveComment = useCallback(
    (
      comment: UnsavedComment | CommentAnnotation
    ): Promise<CommentAnnotation> => {
      const annotationColor = getHighlightColor(state, comment)
      return saveModel<CommentAnnotation>({ ...comment, annotationColor }).then(
        (comment) => {
          dispatch(updateComment(comment._id, comment))
          return comment
        }
      )
    },
    [state, saveModel, dispatch]
  )

  const deleteComment = useCallback(
    (id: string) => {
      const item = state.find((item) => item.comment._id === id)
      if (!item) {
        return
      }
      const { target } = item.comment

      doCommand(commands.removeAnnotation(target))

      // the original item plus all if its replies (if it had any)
      ;[item, ...repliesOf(state, id)].map(({ comment }) => {
        dispatch(removeComment(comment._id))
        deleteModel(comment._id).catch(() => {
          // fail silently - probably the comment never existed
          return
        })
      })
    },
    [deleteModel, state, dispatch, doCommand]
  )

  const handleCreateReply = useCallback(
    (id: string) => {
      dispatch(insertCommentReply(id, userProfile))
    },
    [userProfile, dispatch]
  )

  return {
    items: state,
    saveComment,
    deleteComment,
    handleCreateReply,
  }
}
