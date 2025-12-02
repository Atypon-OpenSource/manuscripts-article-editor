/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import styled from 'styled-components'

export const InspectorContainer = styled.div`
  border-left: 1px solid ${(props) => props.theme.colors.border.tertiary};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  height: 100%;
  overflow: hidden;
`

export const InspectorTabs = styled(TabGroup)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const InspectorTabList = styled(TabList)`
  && {
    background: none;
    justify-content: flex-start;
    font-size: ${(props) => props.theme.font.size.normal};
    color: ${(props) => props.theme.colors.text.primary};
    flex-shrink: 0;
    display: flex;
  }
`

export const PrimaryTabList = styled(InspectorTabList)`
  background-color: #fafafa !important;
`

export const InspectorTabPanels = styled(TabPanels)`
  flex: 1;
  overflow-y: auto;
`

export const InspectorTabPanel = styled(TabPanel).attrs({
  tabIndex: -1,
})`
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.secondary};
  height: 98%;

  &:focus {
    outline: none;
  }
`

const BaseInspectorTab = styled(Tab)`
  && {
    font-size: ${(props) => props.theme.font.size.normal};
    font-family: inherit;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
`
export const PrimaryInspectorTab = styled(BaseInspectorTab)`
  && {
    padding: ${(props) => props.theme.grid.unit * 2.5}px
      ${(props) => props.theme.grid.unit * 4}px
      ${(props) => props.theme.grid.unit * 2.5}px;
    border: 1px solid #f2f2f2;
    white-space: nowrap;
    display: flex;
    align-items: center;
    position: relative;
    gap: 2px;

    /* Style the wrapper div */
    div {
      display: flex;
      align-items: center;
      gap: 2px;
      justify-content: center;
    }

    /* Show text when tab is active */
    &[aria-selected='true'] {
      padding-top: ${(props) => props.theme.grid.unit * 2.5 - 2}px;
      border-top-color: #6e6e6e;
      border-top-width: 3px;
      border-bottom-color: transparent;
      background: ${(props) => props.theme.colors.background.primary};
      margin-bottom: -1px;
      span {
        display: inline;
        margin-left: 4px;
      }
    }

    &[data-headlessui-state~='selected'][data-headlessui-state~='focus'] {
      outline: 2px solid #3dadff;
      outline-offset: -2px;
    }

    /* Ensure icon is always visible */
    svg {
      flex-shrink: 0;
    }
  }
`
export const SecondaryInspectorTab = styled(BaseInspectorTab)`
  && {
    padding: ${(props) => props.theme.grid.unit * 4}px
      ${(props) => props.theme.grid.unit * 2}px
      ${(props) => props.theme.grid.unit * 2}px
      ${(props) => props.theme.grid.unit * 2}px;
    border-bottom: 1px solid transparent;

    &[aria-selected='true'] {
      border-color: ${(props) => props.theme.colors.brand.default};
      color: ${(props) => props.theme.colors.brand.default};
    }

    &[data-headlessui-state~='selected'][data-headlessui-state~='focus'] {
      outline: 2px solid #3dadff;
      outline-offset: -2px;
    }
  }
`

export const InspectorTabPanelHeading = styled.div`
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`

export const WarningBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #fe8f1f;
  color: white;
  border-radius: 50%;
  min-width: 14px;
  height: 14px;
  font-family: 'Lato', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 9px;
  font-weight: 400;
  line-height: 1;
  z-index: 10;
`
export const ErrorBadge = styled(WarningBadge)`
  background-color: #f35143;
`

export const IconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`
export const Spacer = styled.span`
  flex: 1 0 auto;
`
export const TabText = styled.span<{
  targetWidth: number
  skipTransition: boolean
}>`
  margin-left: 0.1em;
  overflow: hidden;
  display: block;
  opacity: ${(props) => (props.targetWidth > 0 ? '1' : '0')};
  max-width: ${(props) => props.targetWidth}px;
  transition:
    max-width ${(props) => (props.skipTransition ? '0s' : '0.25s')} ease,
    opacity ${(props) => (props.skipTransition ? '0s' : '0.5s')};
`
export const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fafafa;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
`
