import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import InspectorContainer from '../src/containers/InspectorContainer'
import { MANUSCRIPT } from '../src/transformer/object-types'
import { Manuscript } from '../src/types/components'

const manuscript: Manuscript = {
  id: '123',
  objectType: MANUSCRIPT,
  title: 'Test',
  citationStyle: 'apa',
  locale: 'en-GB',
  project: '123',
}

storiesOf('Manuscript', module).add('Inspector', () => (
  <InspectorContainer
    manuscript={manuscript}
    saveManuscript={action('save manuscript')}
  />
))
