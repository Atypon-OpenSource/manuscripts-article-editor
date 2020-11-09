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

import keywords from '@manuscripts/data/dist/shared/keywords.json'
import manuscriptCategories from '@manuscripts/data/dist/shared/manuscript-categories.json'
import {
  ObjectTypes,
  ResearchField,
} from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { VariableSizeList } from 'react-window'

import { TemplateCategorySelector } from '../src/components/templates/TemplateCategorySelector'
import { TemplateEmpty } from '../src/components/templates/TemplateEmpty'
import { TemplateListItem } from '../src/components/templates/TemplateListItem'
import { TemplateSearchInput } from '../src/components/templates/TemplateSearchInput'
import { TemplateSelectorList } from '../src/components/templates/TemplateSelectorList'
import { TemplateSelectorModal } from '../src/components/templates/TemplateSelectorModal'
import { TemplateTopicSelector } from '../src/components/templates/TemplateTopicSelector'
import { TemplateTopicsList } from '../src/components/templates/TemplateTopicsList'
import { TemplateData } from '../src/lib/templates'
import { templatesData } from './data/templates-data'

const researchFields = (keywords as ResearchField[]).filter(
  (keyword) => keyword.objectType === ObjectTypes.ResearchField
)

const listRef: React.RefObject<VariableSizeList> = React.createRef()

const templatesDataWithType: TemplateData[] = templatesData.map(
  (templateData) => {
    return {
      ...templateData,
      titleAndType: [templateData.title, templateData.articleType].join(' '),
    }
  }
)

const [templateData] = templatesDataWithType

storiesOf('Template Selector', module)
  .add('Modal', () => (
    <TemplateSelectorModal
      items={templatesDataWithType}
      categories={manuscriptCategories}
      researchFields={researchFields}
      handleComplete={action('complete')}
      // importManuscript={action('import manuscript')}
      selectTemplate={action('select template')}
      createEmpty={action('create empty')}
    />
  ))
  .add('Search input', () => (
    <TemplateSearchInput value={''} handleChange={action('search')} />
  ))
  .add('Category selector', () => (
    <TemplateCategorySelector
      value={'MPManuscriptCategory:research-article'}
      handleChange={action('select category')}
      options={manuscriptCategories}
    />
  ))
  .add('Topic selector', () => (
    <div style={{ width: 200 }}>
      <TemplateTopicSelector
        handleChange={action('select topic')}
        options={researchFields}
      />
    </div>
  ))
  .add('Topics list', () => (
    <TemplateTopicsList
      handleChange={action('select topic')}
      options={researchFields}
    />
  ))
  .add('Empty search results', () => (
    <TemplateEmpty
      searchText={'example'}
      selectedCategoryName={'selected'}
      createEmpty={action('create empty')}
    />
  ))
  .add('Empty category', () => (
    <TemplateEmpty
      searchText={''}
      selectedCategoryName={'Biology'}
      createEmpty={action('create empty')}
    />
  ))
  .add('Results list', () => (
    <div style={{ height: 400, width: 600 }}>
      <TemplateSelectorList
        filteredItems={templatesDataWithType}
        listRef={listRef}
        resetList={action('reset list')}
        selectItem={action('return selection')}
        height={400}
        width={600}
      />
    </div>
  ))
  .add('Result', () => (
    <div style={{ width: 600 }}>
      <TemplateListItem
        articleType={templateData.articleType}
        item={templateData}
        publisher={templateData.publisher}
        selected={false}
        selectItem={action('select item')}
        template={templateData.template}
        title={templateData.title}
      />
    </div>
  ))
  .add('Result: selected', () => (
    <div style={{ width: 600 }}>
      <TemplateListItem
        articleType={templateData.articleType}
        item={templateData}
        publisher={templateData.publisher}
        selected={true}
        selectItem={action('select item')}
        template={templateData.template}
        title={templateData.title}
      />
    </div>
  ))
