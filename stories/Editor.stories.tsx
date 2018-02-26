import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { MenuBarGroup, StyledButton } from '../src/editor/MenuBar'

storiesOf('Editor', module).add('MenuBarGroup', () => (
  <MenuBarGroup>
    <StyledButton>Test</StyledButton>
    <StyledButton>Test</StyledButton>
  </MenuBarGroup>
))
