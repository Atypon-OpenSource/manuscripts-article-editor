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
  ExtraObjectTypes,
} from '@manuscripts/manuscript-transform'

export const comments: CommentAnnotation[] = [
  {
    _id: 'comment-1',
    objectType: ExtraObjectTypes.CommentAnnotation,
    containerID: 'project-1',
    manuscriptID: 'manuscript-1',
    userID: 'user-1',
    target: 'MPParagraphElement:150780D7-CFED-4529-9398-77B5C7625044',
    contents:
      '<div><blockquote>some quoted text</blockquote><p>This is a <span class="keyword" data-keyword="keyword-1">#comment</span> for <span class="user" data-user="user-2">@test</span>.</p></div>',
    createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
    updatedAt: Math.floor(new Date('2018-01-23T08:00:00Z').getTime() / 1000),
  },
]
