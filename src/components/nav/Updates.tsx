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

import styled from 'styled-components'

export const Popup = styled.div`
  background: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: 10pt;
  font-weight: ${(props) => props.theme.font.weight.normal};
  color: ${(props) => props.theme.colors.text.primary};
  max-width: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: normal;

  & p {
    margin: 0;
  }

  & img {
    box-sizing: border-box;
    padding: 10pt;
    height: auto;
  }
`
