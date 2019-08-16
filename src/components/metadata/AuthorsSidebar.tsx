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

import { Contributor } from '@manuscripts/manuscripts-json-schema'
import { AuthorAffiliation, AuthorsDND } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  AddIconContainer,
  AddIconHover,
  RegularAddIcon,
} from '../projects/ProjectsListPlaceholder'

const AddAuthorIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px 0 18px;
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: ${props => props.theme.colors.sidebar.text.primary};
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: #000;
  }

  &:focus {
    outline: none;
  }

  &:hover use {
    fill: ${props => props.theme.colors.authors.add.hovered};
  }
`

const Sidebar = styled.div`
  background-color: ${props => props.theme.colors.sidebar.background.default};
  border-top-left-radius: ${props => props.theme.radius}px;
  border-bottom-left-radius: ${props => props.theme.radius}px;
  padding-bottom: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
`

const SidebarTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${props => props.theme.colors.sidebar.text.primary};
`

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
const AddCollaboratorText = styled.div`
  padding-left: 14px;
`

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  selectedAuthor: Contributor | null
  selectAuthor: (item: Contributor) => void
  openAddAuthors: () => void
  handleDrop: (oldIndex: number, newIndex: number) => void
  getSidebarItemDecorator?: (authorID: string) => JSX.Element | null
}

const AuthorsSidebar: React.FunctionComponent<Props> = ({
  authors,
  selectAuthor,
  selectedAuthor,
  openAddAuthors,
  handleDrop,
  getSidebarItemDecorator,
}) => (
  <Sidebar data-cy={'authors-sidebar'}>
    <SidebarHeader>
      <SidebarTitle>Authors</SidebarTitle>
    </SidebarHeader>

    <SidebarAction>
      <AddButton
        onClick={() => {
          openAddAuthors()
        }}
      >
        <AddAuthorIcon>
          <AddIconContainer>
            <RegularAddIcon width={32} height={34} />
            <AddIconHover width={32} height={34} />
            <AddCollaboratorText> New Author </AddCollaboratorText>
          </AddIconContainer>
        </AddAuthorIcon>
      </AddButton>
    </SidebarAction>

    <AuthorsDND
      authors={authors}
      selectAuthor={selectAuthor}
      selectedAuthor={selectedAuthor}
      handleDrop={handleDrop}
      getSidebarItemDecorator={getSidebarItemDecorator}
    />
  </Sidebar>
)

export default AuthorsSidebar
