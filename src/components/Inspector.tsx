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

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { styled } from '../theme/styled-components'

export const InspectorContainer = styled.div`
  border-left: 1px solid ${props => props.theme.colors.border.tertiary};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;
  overflow: auto;
`

export const InspectorTabs = styled(Tabs)`
  display: flex;
  flex-direction: column;
`

export const InspectorTabList = styled(TabList)`
  && {
    background: none;
    justify-content: center;
    font-size: ${props => props.theme.font.size.normal};
  }
`

export const InspectorPanelTabList = styled(InspectorTabList)`
  margin-bottom: ${props => props.theme.grid.unit * 4}px;
`

export const InspectorTabPanels = styled(TabPanels)`
  flex: 1;
  overflow-y: auto;
`

export const InspectorTabPanel = styled(TabPanel)``

export const InspectorTab = styled(Tab)`
  && {
    background: none;
    padding: ${props => props.theme.grid.unit * 2}px;
    border-bottom-width: 1px;

    &:focus {
      outline: none;
    }

    &[data-selected] {
      border-bottom-color: ${props => props.theme.colors.brand.default};
    }
  }
`

export const InspectorTabPanelHeading = styled.div`
  font-size: ${props => props.theme.font.size.medium};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.grid.unit * 4}px;
`
