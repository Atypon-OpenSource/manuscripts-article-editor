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

import { hasObjectType } from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Keyword,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import CitationEditor from '../src/components/library/CitationEditor'
import { CitationSearchSection } from '../src/components/library/CitationSearchSection'
import { CitationViewer } from '../src/components/library/CitationViewer'
import { modelMap } from './data/doc'

const isBibliographyItem = hasObjectType<BibliographyItem>(
  ObjectTypes.BibliographyItem
)

const isKeyword = hasObjectType<Keyword>(ObjectTypes.Keyword)

const keywords = new Map<string, Keyword>()
const bibliographyItems = new Map<string, BibliographyItem>()

for (const model of modelMap.values()) {
  if (isBibliographyItem(model)) {
    bibliographyItems.set(model._id, model)
  } else if (isKeyword(model)) {
    keywords.set(model._id, model)
  }
}

const items = [...bibliographyItems.values()]

storiesOf('Library', module)
  .add('Citation Editor', () => (
    <CitationEditor
      filterLibraryItems={() => []}
      handleCancel={action('handle cancel')}
      handleCite={action('handle cite')}
      handleRemove={action('handle remove')}
      items={items}
      projectID={'MPProject:1'}
      scheduleUpdate={action('schedule update')}
      selectedText={'foo'}
    />
  ))
  .add('Citation Search Section', () => (
    <CitationSearchSection
      query={'foo'}
      source={{
        id: 'stories',
        title: 'Stories',
        search: async () => ({ items, total: items.length }),
      }}
      addToSelection={action('add to selection')}
      selectSource={action('select source')}
      rows={10}
      selected={new Map()}
      fetching={new Set()}
    />
  ))
  .add('Citation Viewer', () => <CitationViewer items={items} />)
