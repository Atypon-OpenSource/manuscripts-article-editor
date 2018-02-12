import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Main, Page, Sidebar } from '../src/components/Page'

storiesOf('Page', module)
  .add('with sidebar', () => (
    <Page>
      <Sidebar>This is the sidebar</Sidebar>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
  .add('without sidebar', () => (
    <Page>
      <Main>This is the main content</Main>
    </Page>
  ))
