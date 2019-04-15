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

import { Bundle } from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { FixedSizeList } from 'react-window'
import { CitationStyleEmpty } from '../src/components/templates/CitationStyleEmpty'
import { CitationStyleListItem } from '../src/components/templates/CitationStyleListItem'
import { CitationStyleSelectorList } from '../src/components/templates/CitationStyleSelectorList'
import { CitationStyleSelectorModal } from '../src/components/templates/CitationStyleSelectorModal'

const listRef: React.RefObject<FixedSizeList> = React.createRef()
const bundles: Bundle[] = [
  {
    _id: 'MPBundle:example',
    objectType: 'MPBundle',
    createdAt: 0,
    updatedAt: 0,
    csl: {
      title: 'Example Journal',
    },
  },
  {
    _id: 'MPBundle:another',
    objectType: 'MPBundle',
    createdAt: 0,
    updatedAt: 0,
    csl: {
      title: 'Another Journal',
    },
  },
  {
    _id: 'MPBundle:something',
    objectType: 'MPBundle',
    createdAt: 0,
    updatedAt: 0,
    csl: {
      title: 'Something Different',
    },
  },
  {
    _id: 'MPBundle:science',
    objectType: 'MPBundle',
    createdAt: 0,
    updatedAt: 0,
    csl: {
      title: 'Science',
    },
  },
  {
    _id: 'MPBundle:nature',
    objectType: 'MPBundle',
    createdAt: 0,
    updatedAt: 0,
    csl: {
      title: 'Nature',
    },
  },
  {
    _id: 'MPBundle:stick',
    objectType: 'MPBundle',
    createdAt: 0,
    updatedAt: 0,
    csl: {
      title:
        'Stick Stick Stick Stick Stick Stick Stick Stick Stick Stick Stick Stick Stick',
    },
  },
]
const bundle = bundles[0]

storiesOf('Citation Style Selector', module)
  .add('Modal', () => (
    <div style={{ height: 400, width: 600 }}>
      <CitationStyleSelectorModal
        items={bundles}
        handleComplete={action('complete')}
        selectBundle={action('select bundle')}
      />
    </div>
  ))
  .add('Empty search results', () => (
    <CitationStyleEmpty searchText={'example'} />
  ))
  .add('Results list', () => (
    <div style={{ height: 400, width: 600 }}>
      <CitationStyleSelectorList
        filteredItems={bundles}
        listRef={listRef}
        selectBundle={action('select bundle')}
      />
    </div>
  ))
  .add('Result', () => (
    <div style={{ width: 600 }}>
      <CitationStyleListItem
        item={bundle}
        selectBundle={action('select bundle')}
      />
    </div>
  ))
