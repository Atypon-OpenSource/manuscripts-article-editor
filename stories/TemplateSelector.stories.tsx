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
import { manuscriptCategories } from '../src/lib/__fixtures__/manuscript-categories'
import { researchFields } from '../src/lib/__fixtures__/research-fields'
import { templatesData } from './data/templates-data'

const listRef: React.RefObject<VariableSizeList> = React.createRef()
const [templateData] = templatesData

storiesOf('Template Selector', module)
  .add('Modal', () => (
    <TemplateSelectorModal
      items={templatesData}
      categories={manuscriptCategories}
      researchFields={researchFields}
      handleComplete={action('complete')}
      importManuscript={action('import manuscript')}
      selectTemplate={action('select template')}
      createEmpty={action('create empty')}
      projectID={'MPProject:story'}
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
        value={null}
        handleChange={action('select topic')}
        options={researchFields}
      />
    </div>
  ))
  .add('Topics list', () => (
    <TemplateTopicsList
      value={null}
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
        filteredItems={templatesData}
        listRef={listRef}
        resetList={action('reset list')}
        selectTemplate={action('select template')}
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
        selectTemplate={action('select template')}
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
        selectTemplate={action('select template')}
        template={templateData.template}
        title={templateData.title}
      />
    </div>
  ))
