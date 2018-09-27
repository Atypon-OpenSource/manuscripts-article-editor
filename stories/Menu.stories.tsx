import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { GlobalMenu } from '../src/components/GlobalMenu'
import { Menu } from '../src/components/Menu'

storiesOf('Menu', module)
  .add('Global Menu', () => <GlobalMenu active={'projects'} />)
  .add('Global Menu with projects dropdown', () => (
    <GlobalMenu active={'people'} />
  ))
  .add('Project Menu', () => (
    <Menu projectID={'project-1'} handleClose={action('close')} />
  ))
