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

import { css, styled } from '../theme/styled-components'

export const Sidebar = styled.div`
  // overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: ${props => props.theme.grid.unit * 4}px
    ${props => props.theme.grid.unit * 2}px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.primary};
`

const commonStyles = css`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 0 ${props => props.theme.grid.unit * 3}px;
`

export const SidebarHeader = styled.div`
  ${commonStyles}
  margin-bottom: 54px;
`

export const SidebarFooter = styled.div`
  ${commonStyles}
  margin-top: ${props => props.theme.grid.unit * 4}px;
`

export const SidebarTitle = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  font-weight: ${props => props.theme.font.weight.semibold};
  color: ${props => props.theme.colors.text.primary};
  flex: 1;
  white-space: nowrap;
`

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 ${props => props.theme.grid.unit * 3}px;
  position: relative;
  flex-shrink: 0;
`

interface SidebarPersonContainerProps {
  selected?: boolean
}

export const SidebarPersonContainer = styled.div<SidebarPersonContainerProps>`
  display: flex;
  margin: 0 -22px;
  padding: 10px 20px;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  background-color: ${props =>
    props.selected ? props.theme.colors.brand.xlight : 'unset'};

  &:hover {
    background-color: ${props => props.theme.colors.brand.xlight};
  }
`

export const SidebarSearchField = styled.div`
  display: flex;
  margin: 10px;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
`

export const SidebarSearchText = styled.input`
  display: flex;
  flex: 1;
  font-size: ${props => props.theme.font.size.normal};
  border: none;
  border-radius: ${props => props.theme.grid.radius.default};
  background-color: transparent;
  line-height: 30px;
  position: relative;
  left: -${props => props.theme.grid.unit * 4}px;
  right: -${props => props.theme.grid.unit * 4}px;
  padding: 0 ${props => props.theme.grid.unit * 3}px 0
    ${props => props.theme.grid.unit * 6}px;

  &:hover,
  &:focus {
    background-color: ${props => props.theme.colors.brand.xlight};
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.muted};
  }
`

export const SidebarSearchIconContainer = styled.span`
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`
