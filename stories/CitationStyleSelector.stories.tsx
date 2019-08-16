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
