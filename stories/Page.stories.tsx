import { storiesOf } from '@storybook/react'
import React from 'react'
import { Main, Page } from '../src/components/Page'
import { project } from './data/projects'

storiesOf('Page', module)
  .add('A page', () => (
    <Page>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
  .add('A page with a project', () => (
    <Page project={project}>
      <Main style={{ padding: '10px 20px' }}>This is the main content</Main>
    </Page>
  ))
