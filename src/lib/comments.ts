/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  CommentAnnotation,
  ManuscriptNode,
} from '@manuscripts/manuscript-editor'
import { BibliographicName } from '@manuscripts/manuscripts-json-schema'

interface CommentData {
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

  doc.descendants(node => {
    if (node.attrs.id && targetsMap.has(node.attrs.id)) {
      map.set(node.attrs.id, targetsMap.get(node.attrs.id)!)
    }
  })

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
): string => [name.given, name.family].filter(item => item).join(' ')
