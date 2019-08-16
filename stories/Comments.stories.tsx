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

import { Model } from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { CommentList } from '../src/components/projects/CommentList'
import { comments } from './data/comments'
import { doc } from './data/doc'
import { keywords } from './data/keywords'
import { people } from './data/people'

const buildMap = <T extends Model>(items: T[]) => {
  const map = new Map()

  for (const item of items) {
    map.set(item._id, item)
  }

  return map
}

const keywordMap = buildMap(keywords)
const userMap = buildMap(people)

storiesOf('Projects/Comments', module).add('with comments', () => (
  <div style={{ width: 400 }}>
    <CommentList
      comments={comments}
      doc={doc}
      getCurrentUser={() => people[0]}
      getCollaborator={(id: string) => userMap.get(id)}
      deleteModel={async () => action('delete model')}
      saveModel={async () => action('save model')}
      listCollaborators={() => people}
      createKeyword={async () => action('create keyword')}
      getKeyword={(id: string) => keywordMap.get(id)}
      listKeywords={() => keywords}
      selected={null}
      setCommentTarget={action('set comment target')}
    />
  </div>
))
