import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { TemplateCategorySelector } from '../src/components/templates/TemplateCategorySelector'
import { TemplateSearchInput } from '../src/components/templates/TemplateSearchInput'
import { TemplateSelectorModal } from '../src/components/templates/TemplateSelectorModal'
import { TemplateTopicSelector } from '../src/components/templates/TemplateTopicSelector'
import { TemplateTopicsList } from '../src/components/templates/TemplateTopicsList'
import { manuscriptCategories } from '../src/lib/__fixtures__/manuscript-categories'
import { researchFields } from '../src/lib/__fixtures__/research-fields'
import { templatesData } from './data/templates-data'

storiesOf('Template Selector', module)
  .add('Modal', () => (
    <TemplateSelectorModal
      items={templatesData}
      categories={manuscriptCategories}
      researchFields={researchFields}
      handleComplete={action('complete')}
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
