import { storiesOf } from '@storybook/react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ActionButton } from '../src/components/Button'
import { PageHeading } from '../src/components/PageHeading'

storiesOf('Page Heading', module)
  .add('with action', () => (
    <PageHeading action={<ActionButton>+</ActionButton>}>
      <FormattedMessage
        id={'example_page_title'}
        defaultMessage={'Example Page'}
      />
    </PageHeading>
  ))
  .add('without action', () => (
    <PageHeading>
      <FormattedMessage
        id={'example_page_title'}
        defaultMessage={'Example Page'}
      />
    </PageHeading>
  ))
