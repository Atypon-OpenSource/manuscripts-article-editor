/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import styled from 'styled-components'

export const OptionWrapper = styled.div<{ focused?: boolean }>`
  padding-left: ${(props) => props.theme.grid.unit * 4}px;
  padding-top: ${(props) => props.theme.grid.unit * 2}px;
  padding-bottom: ${(props) => props.theme.grid.unit * 2}px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${(props) =>
    props.focused ? props.theme.colors.background.fifth : 'transparent'};

  &:hover {
    background-color: ${(props) => props.theme.colors.background.fifth};
    g {
      fill: ${(props) => props.theme.colors.text.secondary};
    }
  }
`
export const OuterContainer = styled.div`
  width: 100%;
`

export const Container = styled.div`
  position: relative;
`
const PopperContent = styled.div`
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  padding: ${(props) => props.theme.grid.unit * 2}px;

  .chrome-picker {
    box-shadow: none !important;
    width: unset !important;
  }
`
export const EditingPopper = styled(PopperContent)`
  width: fit-content;
  max-width: 200px;
  min-width: 140px;
  height: fit-content;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`
