import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { ToolbarGroup } from '../src/editor/Toolbar'
import { StyledButton } from '../src/editor/ToolbarItemContainer'

storiesOf('Toolbar', module).add('ToolbarGroup', () => (
  <ToolbarGroup>
    <StyledButton onClick={action('click')}>Test</StyledButton>
    <StyledButton onClick={action('click')}>Test</StyledButton>
  </ToolbarGroup>
))
