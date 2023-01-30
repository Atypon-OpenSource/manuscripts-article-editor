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
  BibliographyItem,
  Citation,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { hasObjectType } from '@manuscripts/transform'
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

const bibliographyItems = new Map<string, BibliographyItem>()

for (const model of modelMap.values()) {
  if (isBibliographyItem(model)) {
    bibliographyItems.set(model._id, model)
  }
}

const items = [...bibliographyItems.values()]

const citation = modelMap.get(
  'MPCitation:31E42852-8377-4550-8C25-9E602EE657B0'
) as Citation

storiesOf('Citation', module)
  .add('Citation Editor', () => (
    <CitationEditor
      filterLibraryItems={async () => []}
      setLibraryItem={() => action('set library item')}
      removeLibraryItem={() => action('remove library item')}
      modelMap={new Map()}
      saveModel={action('save model')}
      deleteModel={action('delete model')}
      handleCancel={action('handle cancel')}
      handleCite={action('handle cite')}
      handleClose={action('handle close')}
      handleRemove={action('handle remove')}
      items={items}
      projectID={'MPProject:1'}
      scheduleUpdate={action('schedule update')}
      selectedText={'foo'}
      setComment={action('set new comment')}
      importItems={action('import items')}
      citation={citation}
      updateCitation={action('update citation')}
      updatePopper={action('update popper')}
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
