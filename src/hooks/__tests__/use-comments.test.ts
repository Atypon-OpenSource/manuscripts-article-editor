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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  CommentAnnotation,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { Annotation } from '@manuscripts/track-changes'
import deepFreeze from 'deep-freeze'

import {
  getInitialCommentState,
  insertCommentReply,
  updateComment,
} from '../use-comments'

const comments: CommentAnnotation[] = [
  {
    _id: 'comment-1',
    objectType: ObjectTypes.CommentAnnotation,
    containerID: 'project-1',
    manuscriptID: 'manuscript-1',
    target: 'annotation-1',
    contents:
      '<div><blockquote>some quoted text</blockquote><p>This is a <span class="keyword" data-keyword="keyword-1">#comment</span> for <span class="user" data-user="user-2">@test</span>.</p></div>',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-23T08:00:00Z').getTime() / 1000),
    sessionID: 'foo',
    originalText: '',
    selector: {
      from: 50,
      to: 100,
    },
    contributions: [
      {
        _id: 'MPContribution:1',
        objectType: ObjectTypes.Contribution,
        profileID: 'user-1',
        timestamp: 0,
      },
    ],
  },
]

const person = {
  _id: 'user-1',
  userID: 'user_1',
  objectType: 'MPUserProfile',
  bibliographicName: {
    _id: 'name-1',
    objectType: 'MPBibliographicName',
    given: 'Janine',
    family: 'Melnitz',
  },
  email: 'janine.melnitz@example.com',
  createdAt: 0,
  updatedAt: 0,
} as UserProfileWithAvatar

const annotations: Annotation[] = [
  {
    uid: 'annotation-1',
  } as Annotation,
]

const baseState = getInitialCommentState(comments, annotations)
deepFreeze(baseState)

describe('getInitialCommentState', () => {
  it('joins annotations with their corresponding comments', () => {
    expect(baseState).toHaveLength(1)
  })

  it('ignores annotations that are not targetted by a comment', () => {
    const annotations: Annotation[] = [
      {
        uid: 'annotation-2',
      } as Annotation,
    ]
    const state = getInitialCommentState(comments, annotations)
    expect(state).toHaveLength(1)
  })
})

describe('updateComment', () => {
  it('updates any value in a comment', () => {
    const final = updateComment('comment-1', { contents: 'New contents' })(
      baseState
    )
    expect(final).toHaveLength(1)
    expect(final[0]).toHaveProperty('comment.contents', 'New contents')
  })

  it('noop when the comment id is not present already', () => {
    const final = updateComment('comment-2', { contents: 'New contents' })(
      baseState
    )
    expect(final).toEqual(baseState)
  })
})

describe('insertCommentReply', () => {
  it('creates a new comment', () => {
    const final = insertCommentReply('comment-1', person)(baseState)
    expect(final).toHaveLength(2)
  })
})
