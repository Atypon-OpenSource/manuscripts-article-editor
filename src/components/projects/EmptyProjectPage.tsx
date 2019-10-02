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
import { styled } from '../../theme/styled-components'
import { Notification } from '../NotificationMessage'
import { ProjectPlaceholder } from '../Placeholders'
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from './ProjectsListPlaceholder'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow-y: auto;
  width: 100%;
  text-align: center;
  font-size: ${props => props.theme.font.size.xlarge};
  line-height: ${props => props.theme.font.lineHeight.large};
`

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AddManuscriptButton = styled.button`
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

const Message = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  margin-top: 25px;
  font-weight: ${props => props.theme.font.weight.xlight};
  color: ${props => props.theme.colors.text.muted};
  max-width: 600px;

  @media (max-width: 850px) {
    margin-right: 20px;
    margin-left: 20px;
    max-width: 350px;
  }
`

const ActionTitle = styled.div`
  font-size: ${props => props.theme.font.lineHeight.large};
  font-weight: ${props => props.theme.font.weight.medium};
  padding-bottom: 2px;
  letter-spacing: -0.5px;
  padding-left: 11px;
`

const TextContainer = styled.div`
  letter-spacing: -0.8px;
  padding-top: 6px;
`
interface Props {
  openTemplateSelector: () => void
  message?: string
}

export const EmptyProjectPage: React.FunctionComponent<Props> = ({
  openTemplateSelector,
  message,
}) => {
  return (
    <OuterContainer>
      {message && <Notification message={message} id={'empty-project'} />}

      <Placeholder>
        <ProjectPlaceholder />
      </Placeholder>

      <Action>
        <AddManuscriptButton onClick={openTemplateSelector}>
          <AddIconContainer>
            <RegularAddIcon width={40} height={40} />
            <AddIconHover width={40} height={40} />
            <ActionTitle>New Manuscript</ActionTitle>
          </AddIconContainer>
        </AddManuscriptButton>
      </Action>

      <Message>
        <TextContainer>This project is empty.</TextContainer>
        <TextContainer>Create a manuscript to get started.</TextContainer>
      </Message>
    </OuterContainer>
  )
}
