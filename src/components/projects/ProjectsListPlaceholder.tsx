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

import AddIcon from '@manuscripts/assets/react/AddIcon'
import AddIconHighlight from '@manuscripts/assets/react/AddIconHighlight'
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
  padding-bottom: 2px;
  letter-spacing: -0.5px;
  padding-left: 11px;
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
  color: ${props => props.theme.colors.textField.placeholder.default};
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

  &:hover {
    text-decoration: underline;
  }
`

export const RegularAddIcon = styled(AddIcon)`
  display: block;
`

export const AddIconHover = styled(AddIconHighlight)`
  display: none;
`

export const AddIconContainer = styled.div`
  display: flex;
  align-items: center;
  &:hover ${RegularAddIcon} {
    display: none;
  }

  &:hover ${AddIconHover} {
    display: block;
  }

  &:hover {
    text-decoration: underline;
  }
`

export interface Props {
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>
  isDragAccept: boolean
  openTemplateSelector: () => void
}

export const ProjectsListPlaceholder: React.FunctionComponent<Props> = ({
  handleClick,
  openTemplateSelector,
  isDragAccept,
}) => (
  <OuterContainer>
    <Placeholder>
      <ProjectPlaceholder />
    </Placeholder>
    {!isDragAccept ? (
      <AddButton onClick={openTemplateSelector} id={'create-project'}>
        <AddIconContainer>
          <RegularAddIcon width={40} height={40} />
          <AddIconHover width={40} height={40} />
          <Title>Create Project</Title>
        </AddIconContainer>
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
