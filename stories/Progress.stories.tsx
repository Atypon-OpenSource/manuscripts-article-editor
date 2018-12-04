import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { ProgressModal } from '../src/components/projects/ProgressModal'

storiesOf('Progress', module)
  .add('converting', () => (
    <ProgressModal
      canCancel={true}
      handleCancel={action('cancel')}
      status={'Converting manuscript…'}
    />
  ))
  .add('importing', () => (
    <ProgressModal
      canCancel={false}
      handleCancel={action('cancel')}
      status={'Importing manuscript…'}
    />
  ))
  .add('exporting', () => (
    <ProgressModal
      canCancel={true}
      handleCancel={action('cancel')}
      status={'Exporting manuscript…'}
    />
  ))
