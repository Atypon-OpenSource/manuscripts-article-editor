/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { styled } from '../theme/styled-components'

export const Sidebar = styled.div`
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 16px 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.sidebar.background.default};
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 12px;
  flex-shrink: 0;
`

export const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  padding: 0 12px;
  flex-shrink: 0;
`

export const SidebarTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.sidebar.text.primary};
  flex: 1;
  white-space: nowrap;
`

export const SidebarContent = styled.div`
  flex: 1;
  padding: 0 12px;
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
    props.selected ? props.theme.colors.sidebar.background.selected : 'unset'};

  &:hover {
    background-color: ${props =>
      props.theme.colors.sidebar.background.selected};
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
  font-size: 14px;
  border: none;
  border-radius: ${props => props.theme.radius}px;
  background-color: transparent;
  line-height: 30px;
  position: relative;
  left: -16px;
  right: -16px;
  padding: 0 12px 0 24px;

  &:hover,
  &:focus {
    background-color: ${props =>
      props.theme.colors.sidebar.background.selected};
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`

export const SidebarSearchIconContainer = styled.span`
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`
