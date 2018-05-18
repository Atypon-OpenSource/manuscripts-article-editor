import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import InspectorContainer from '../src/containers/InspectorContainer'
import manuscripts from './data/manuscripts'

storiesOf('Inspector', module).add('Inspector', () => (
  <InspectorContainer
    manuscript={manuscripts[0]}
    saveManuscript={action('save manuscript')}
  />
))
