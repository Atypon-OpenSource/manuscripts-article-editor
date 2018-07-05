import { storiesOf } from '@storybook/react'
import React from 'react'
import { Main, Page } from '../src/components/Page'

storiesOf('Page', module)
  .add('A page', () => (
    <Page>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
  .add('A page with a projectID', () => (
    <Page projectID={'project-1'}>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
