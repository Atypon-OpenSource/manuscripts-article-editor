import { storiesOf } from '@storybook/react'
import React from 'react'
import { Main, Page } from '../src/components/Page'
import SidebarContainer from '../src/containers/SidebarContainer'

storiesOf('Page', module)
  .add('with sidebar', () => (
    <Page>
      <SidebarContainer />
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
  .add('without sidebar', () => (
    <Page>
      <Main>This is the main content</Main>
    </Page>
  ))
