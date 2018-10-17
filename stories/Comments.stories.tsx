import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { CommentList } from '../src/components/projects/CommentList'
import { UserWithName } from '../src/editor/comment/config'
import { buildName } from '../src/lib/comments'
import { Model } from '../src/types/models'
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

const peopleWithNames: UserWithName[] = people.map(person => ({
  ...person,
  name: buildName(person.bibliographicName),
}))

storiesOf('Projects/Comments', module).add('with comments', () => (
  <div style={{ width: 400 }}>
    <CommentList
      comments={comments}
      doc={doc}
      getCurrentUser={() => people[0]}
      getUser={(id: string) => userMap.get(id)}
      deleteModel={async () => action('delete model')}
      saveModel={async () => action('save model')}
      getCollaborators={() => peopleWithNames}
      createKeyword={async () => action('create keyword')}
      getKeyword={(id: string) => keywordMap.get(id)}
      getKeywords={() => keywords}
      selected={null}
    />
  </div>
))
