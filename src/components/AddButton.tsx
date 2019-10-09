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
import React from 'react'
import { styled } from '../theme/styled-components'
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from './projects/ProjectsListPlaceholder'

const Action = styled.button`
  display: flex;
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.medium};
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px ${props => props.theme.grid.unit * 2}px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.text.primary};
  white-space: nowrap;
  text-overflow: ellipsis;
`

const ActionTitle = styled.div`
  padding-left: ${props => props.theme.grid.unit * 3}px;
`
interface Props {
  action: () => void
  title: string
}

export const AddButton: React.FunctionComponent<Props> = ({
  action,
  title,
}) => (
  <Action onClick={action}>
    <AddIconContainer>
      <RegularAddIcon width={20} height={21} />
      <AddIconHover width={20} height={21} />
      <ActionTitle>{title}</ActionTitle>
    </AddIconContainer>
  </Action>
)
