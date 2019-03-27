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

import ProjectPlaceholder from '@manuscripts/assets/react/ProjectPlaceholder'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { styled } from '../../theme/styled-components'
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

const ProjectTitle = styled(Title)`
  font-size: 18px;
  font-weight: 300;
  padding: 15px 0;
  color: ${props => props.theme.colors.global.text.secondary};
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
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
  padding: 15px 0;
  font-weight: 300;
  color: ${props => props.theme.colors.global.text.secondary};
  max-width: 600px;

  @media (max-width: 850px) {
    margin-right: 20px;
    margin-left: 20px;
    max-width: 350px;
  }
`
const TextContainer = styled.div`
  padding-left: 10px;
`
interface Props {
  project: Project
  openTemplateSelector: () => void
}

export const EmptyProjectPage: React.FunctionComponent<Props> = ({
  project,
  openTemplateSelector,
}) => (
  <OuterContainer>
    <Placeholder>
      <ProjectPlaceholder />
    </Placeholder>

    <ProjectTitle value={project.title || 'Untitled Project'} />

    <Message>
      This project is empty. Create a manuscript to get started.
    </Message>
    <Action>
      <AddManuscriptButton onClick={openTemplateSelector}>
        <AddIconContainer>
          <RegularAddIcon />
          <AddIconHover />
          <TextContainer>New Manuscript</TextContainer>
        </AddIconContainer>
      </AddManuscriptButton>
    </Action>
  </OuterContainer>
)
