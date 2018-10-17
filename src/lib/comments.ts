import { Node as ProsemirrorNode } from 'prosemirror-model'
import { iterateChildren } from '../editor/lib/utils'
import { BibliographicName, CommentAnnotation } from '../types/models'

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

const buildTreeMap = (doc: ProsemirrorNode, targetsMap: TargetsMap) => {
  const map: CommentsTreeMap = new Map()

  for (const node of iterateChildren(doc, true)) {
    if (node.attrs.id && targetsMap.has(node.attrs.id)) {
      map.set(node.attrs.id, targetsMap.get(node.attrs.id)!)
    }
  }

  return map
}

export const buildCommentTree = (
  doc: ProsemirrorNode,
  comments: CommentAnnotation[]
): CommentsTreeMap => {
  const commentsMap = buildCommentsMap(comments)
  const targetsMap = buildTargetsMap(commentsMap)

  return buildTreeMap(doc, targetsMap)
}

export const buildName = (
  name: Pick<BibliographicName, 'given' | 'family'>
): string => [name.given, name.family].filter(item => item).join(' ')
