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
      deleteComment={async () => action('delete model')}
      saveComment={async () => action('save model')}
      listCollaborators={() => people}
      createKeyword={async () => action('create keyword')}
      getKeyword={(id: string) => keywordMap.get(id)}
      listKeywords={() => keywords}
      selected={null}
    />
  </div>
))
