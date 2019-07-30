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

import { Project } from '@manuscripts/manuscripts-json-schema'
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
  font-size: 20px;
  line-height: 28px;
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
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.global.text.primary};
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Message = styled.div`
  font-size: 21px;
  margin-top: 25px;
  font-weight: 300px;
  color: ${props => props.theme.colors.textField.placeholder.default};
  max-width: 600px;

  @media (max-width: 850px) {
    margin-right: 20px;
    margin-left: 20px;
    max-width: 350px;
  }
`

const ActionTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
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
  project: Project
}

export const EmptyProjectPage: React.FunctionComponent<Props> = ({
  openTemplateSelector,
  message,
  project,
}) => (
  <OuterContainer>
    {message && <Notification message={message} id={project._id} />}
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
