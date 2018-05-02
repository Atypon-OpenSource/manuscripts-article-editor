import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { MenuBarGroup, StyledButton } from '../src/editor/MenuBar'

storiesOf('MenuBar', module).add('MenuBarGroup', () => (
  <MenuBarGroup>
    <StyledButton onClick={action('click')}>Test</StyledButton>
    <StyledButton onClick={action('click')}>Test</StyledButton>
  </MenuBarGroup>
))
