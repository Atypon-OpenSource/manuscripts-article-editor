/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { ArrowUpIcon, SecondaryButton } from '@manuscripts/style-guide'
import styled from 'styled-components'

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const Dropdown = styled.div<{
  direction?: 'left' | 'right'
  minWidth?: number
  top?: number
}>`
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  color: ${(props) => props.theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.normal};
  max-height: 80vh;
  max-width: 300px;
  ${(props) => props.minWidth && 'min-width: ' + props.minWidth + 'px;'}
  ${(props) => (props.direction === 'right' ? ' right: 0' : 'left : 0')};
  top: ${(props) => (props.top ? props.top : props.theme.grid.unit * 10)}px;
  position: absolute;
  z-index: 10;
`

interface DropdownProps {
  isOpen: boolean
}

export const DropdownToggle = styled(ArrowUpIcon)`
  margin-left: 6px;
  transform: rotate(180deg);

  &.open {
    transform: rotate(0deg);
  }
`

export const DropdownButtonContainer = styled(SecondaryButton).attrs(
  (props: DropdownProps) => ({
    selected: props.isOpen,
  })
)<DropdownProps>`
  .inheritColors path {
    fill: currentColor;
    stroke: currentColor;
  }
`
