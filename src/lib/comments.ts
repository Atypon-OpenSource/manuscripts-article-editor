/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import { Comment, isReply } from '@manuscripts/body-editor'
import { UserProfile } from '@manuscripts/json-schema'

export type Thread = {
  comment: Comment
  isNew: boolean
  replies: Comment[]
}

export const getAuthorID = (comment: Comment) => {
  const contributions = comment.node.attrs.contributions
  if (!contributions?.length) {
    return undefined
  }
  return contributions[0].profileID
}

export const buildThreads = (
  comments: Comment[],
  newCommentID?: string
): Thread[] => {
  return comments
    .filter((c) => !isReply(c)) // Filter out replies
    .map((c) => ({
      comment: c,
      isNew: newCommentID === c.node.attrs.id,
      replies: comments.filter(
        (reply) => reply.node.attrs.target === c.node.attrs.id // Find replies for each comment
      ),
    }))
}

export const buildAuthorName = (user: UserProfile | undefined) => {
  if (!user) {
    return ''
  }
  return [user.bibliographicName.given, user.bibliographicName.family]
    .filter(Boolean)
    .join(' ')
}

export const commentsByTime = (a: Comment, b: Comment) => {
  const aTimestamp = a.node.attrs.contributions?.[0].timestamp || 0
  const bTimestamp = b.node.attrs.contributions?.[0].timestamp || 0
  return aTimestamp - bTimestamp
}
