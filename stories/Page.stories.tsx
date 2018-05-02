import { storiesOf } from '@storybook/react'
import React from 'react'
import { IconBar, Main, Page } from '../src/components/Page'

storiesOf('Page', module)
  .add('with iconbar', () => (
    <Page>
      <IconBar />
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
  .add('without iconbar', () => (
    <Page>
      <Main>This is the main content</Main>
    </Page>
  ))
