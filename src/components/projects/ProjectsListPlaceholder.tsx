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

import AddIcon from '@manuscripts/assets/react/AddIcon'
import DocIcon from '@manuscripts/assets/react/DocIcon'
import MarkdownIcon from '@manuscripts/assets/react/MarkdownIcon'
import TeXIcon from '@manuscripts/assets/react/TeXIcon'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ProjectPlaceholder } from '../Placeholders'

const SidebarActionTitle = styled.span`
  display: flex;
  align-items: center;
  padding-left: 11px;
  padding-bottom: 2px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.2px;
  color: ${props => props.theme.colors.sidebar.text.primary};
`
const Title = styled.div`
  font-size: 24px;
  font-weight: 500;
  padding-left: 11px;
  padding-bottom: 2px;
  letter-spacing: -0.5px;
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover ${SidebarActionTitle} {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`

const Placeholder = styled.div``

const OuterContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 20px;
  line-height: 28px;
`

const FontStyle = styled.div`
  font-family: Barlow;
  font-size: 17px;
  font-weight: normal;
`
const Text = styled(FontStyle)`
  padding-top: 25px;
  width: 600px;
  height: 61px;
  color: #aaa;
`

const InnerText = styled(FontStyle)`
  width: 552px;
  height: 35px;
  padding-left: 20px;
  letter-spacing: -0.4px;
`

const UploadFileType = styled.span`
  display: inline-block;
  margin: 0 10px;
`

const UploadFileTypes = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
`

const BrowseLink = styled.span`
  margin: 0 2px;
  font-size: 16px;
  color: ${props => props.theme.colors.global.text.link};

  cursor: pointer;
  font-weight: 500;
`

export interface Props {
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>
  isDragActive: boolean
  openTemplateSelector: () => void
}

export const ProjectsListPlaceholder: React.FunctionComponent<Props> = ({
  handleClick,
  isDragActive,
  openTemplateSelector,
}) => (
  <OuterContainer
    style={{ background: isDragActive ? '#edf2f5' : 'transparent' }}
  >
    <Placeholder>
      <ProjectPlaceholder />
    </Placeholder>
    <AddButton onClick={openTemplateSelector} id={'create-project'}>
      <AddIcon width={40} height={40} />
      <Title>Create Project</Title>
    </AddButton>
    <Text>
      You can opt for a blank project or choose one of the many templates
      available.
      <InnerText>
        You can also import a project by dragging a file to this window or
        <BrowseLink onClick={handleClick}>browsing</BrowseLink> for it.
      </InnerText>
    </Text>
    <UploadFileTypes>
      <UploadFileType>
        <TeXIcon />
      </UploadFileType>
      <UploadFileType>
        <DocIcon />
      </UploadFileType>
      <UploadFileType>
        <MarkdownIcon />
      </UploadFileType>
    </UploadFileTypes>
  </OuterContainer>
)
