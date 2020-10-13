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

import { ManuscriptNode } from '@manuscripts/manuscript-transform'
import {
  BibliographicName,
  CommentAnnotation,
} from '@manuscripts/manuscripts-json-schema'

export interface CommentData {
  comment: CommentAnnotation
  children: CommentAnnotation[]
}

const oldestFirst = (a: CommentAnnotation, b: CommentAnnotation) =>
  Number(a.createdAt) - Number(b.createdAt)

type CommentsMap = Map<string, CommentData>

const buildCommentsMap = (comments: CommentAnnotation[]) => {
  const map: CommentsMap = new Map()

  for (const comment of comments.sort(oldestFirst)) {
    if (map.has(comment.target)) {
      // child
      const data = map.get(comment.target)!

      map.set(comment.target, {
        comment: data.comment,
        children: data.children.concat(comment),
      })
    } else {
      // parent
      map.set(comment._id, {
        comment,
        children: [],
      })
    }
  }

  return map
}

type TargetsMap = Map<string, CommentData[]>

const buildTargetsMap = (commentsMap: CommentsMap) => {
  const map: TargetsMap = new Map()

  for (const commentData of commentsMap.values()) {
    const { target } = commentData.comment

    if (map.has(target)) {
      map.set(target, map.get(target)!.concat(commentData))
    } else {
      map.set(target, [commentData])
    }
  }

  return map
}

type CommentsTreeMap = Map<string, CommentData[]>

const buildTreeMap = (doc: ManuscriptNode, targetsMap: TargetsMap) => {
  const map: CommentsTreeMap = new Map()

  doc.descendants((node) => {
    const targetID = node.attrs.rid || node.attrs.id

    if (targetID) {
      const target = targetsMap.get(targetID)

      if (target) {
        map.set(targetID, target)
      }
    }
  })

  // TODO: what does this do?
  if (map.size < targetsMap.size) {
    for (const commentsData of targetsMap.values()) {
      const comments = commentsData
      if (
        !map.has(comments[0].comment.target) &&
        comments[0].comment.target.startsWith('MPHighlight') &&
        comments[0].comment.originalText
      ) {
        map.set(comments[0].comment.target, comments)
      }
    }
  }
  return map
}

export const buildCommentTree = (
  doc: ManuscriptNode,
  comments: CommentAnnotation[]
): CommentsTreeMap => {
  const commentsMap = buildCommentsMap(comments)
  const targetsMap = buildTargetsMap(commentsMap)

  return buildTreeMap(doc, targetsMap)
}

export const buildName = (
  name: Pick<BibliographicName, 'given' | 'family'>
): string => [name.given, name.family].filter((item) => item).join(' ')
