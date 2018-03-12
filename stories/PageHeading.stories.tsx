import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { ActionButton } from '../src/components/Button'
import { PageHeading } from '../src/components/PageHeading'

storiesOf('Page Heading', module)
  .add('with action', () => (
    <PageHeading
      title={'Example Page'}
      action={<ActionButton>+</ActionButton>}
    />
  ))
  .add('without action', () => <PageHeading title={'Example Page'} />)
