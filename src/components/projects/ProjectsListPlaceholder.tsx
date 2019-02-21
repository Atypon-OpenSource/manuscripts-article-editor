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
  font-size: 21px;
  font-weight: 300px;
`
const Text = styled(FontStyle)`
  padding-top: 25px;
  color: #aaa;
  max-width: 400px;
`

const InnerText = styled(FontStyle)`
  letter-spacing: -0.8px;
  max-width: 400px;
`
const OuterText = styled(FontStyle)`
  padding-bottom: 6px;
`

const UploadFileType = styled.span`
  display: inline-block;
  margin: 0 10px;
`

const UploadFileTypes = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`

const BrowseLink = styled.span`
  margin: 0 2px;
  font-size: 20px;
  color: ${props => props.theme.colors.global.text.link};

  cursor: pointer;
  font-weight: 500;
`

export interface Props {
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>
  isDragActive: boolean
  isDragAccept: boolean
  openTemplateSelector: () => void
}

export const ProjectsListPlaceholder: React.FunctionComponent<Props> = ({
  handleClick,
  isDragActive,
  openTemplateSelector,
  isDragAccept,
}) => (
  <OuterContainer>
    <Placeholder>
      <ProjectPlaceholder />
    </Placeholder>
    {!isDragAccept ? (
      <AddButton onClick={openTemplateSelector} id={'create-project'}>
        <AddIcon width={40} height={40} />
        <Title>Create Project</Title>
      </AddButton>
    ) : (
      <Title>Drop File to Import</Title>
    )}
    {!isDragAccept ? (
      <Text>
        <OuterText>Click above to create your first project.</OuterText>
        <InnerText>
          You can also import a project by dragging a file to this window or by
          <BrowseLink onClick={handleClick}> browsing</BrowseLink> for it.
        </InnerText>
      </Text>
    ) : (
      <Text>Create a new project from the file by dropping it here.</Text>
    )}
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
