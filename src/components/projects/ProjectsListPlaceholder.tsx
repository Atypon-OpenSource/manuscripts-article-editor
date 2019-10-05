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
import { IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { ProjectPlaceholder } from '../Placeholders'

const OuterContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: ${props => props.theme.font.size.xlarge};
  justify-content: center;
  line-height: ${props => props.theme.font.lineHeight.large};
  text-align: center;
`

const Placeholder = styled.div``

const Title = styled.div`
  font-size: 24px;
  padding-left: ${props => props.theme.grid.unit * 3}px;
`

const AddButton = styled(IconButton)`
  margin-top: ${props => props.theme.grid.unit * 10}px;
  width: auto;
`

const FontStyle = styled.div`
  font-size: ${props => props.theme.font.size.large};
  font-weight: ${props => props.theme.font.weight.light};
`
const Text = styled(FontStyle)`
  padding-top: ${props => props.theme.grid.unit * 5}px;
  color: ${props => props.theme.colors.text.secondary};
`

const InnerText = styled(FontStyle)`
  max-width: 620px;
  margin: auto;
`
const OuterText = styled(FontStyle)``

const UploadFileType = styled.span`
  display: inline-block;
  margin: 0 10px;
`

const UploadFileTypes = styled.div`
  margin-top: ${props => props.theme.grid.unit * 11}px;
  display: flex;
  justify-content: center;
`

const BrowseLink = styled.span`
  color: ${props => props.theme.colors.text.tertiary};
  cursor: pointer;
  margin: 0 2px;
  text-decoration: underline;
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
      <AddButton
        onClick={openTemplateSelector}
        id={'create-project'}
        defaultColor={true}
      >
        <AddIconContainer>
          <RegularAddIcon width={40} height={40} />
          <AddIconHover width={40} height={40} />
          <Title>Create Your First Project</Title>
        </AddIconContainer>
      </AddButton>
    ) : (
      <Title>Drop File to Import</Title>
    )}
    {!isDragAccept ? (
      <Text>
        <OuterText>
          You can opt for a blank project or choose one of the many templates
          available.
        </OuterText>
        <InnerText>
          You can also import a project by dragging a file to this window or
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
