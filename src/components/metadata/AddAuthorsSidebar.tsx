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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import {
  Avatar,
  PrimaryButton,
  SearchIcon,
  TertiaryButton,
} from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import {
  ModalSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarPersonContainer,
  SidebarSearchField,
  SidebarSearchIconContainer,
  SidebarSearchText,
  SidebarTitle,
} from '../Sidebar'
import AddAuthorButton from './AddAuthorButton'
import CreateAuthorPageContainer from './CreateAuthorPageContainer'
import SearchAuthorsSidebar from './SearchAuthorsSidebar'

const PersonInitial = styled.span`
  margin-right: ${props => props.theme.grid.unit}px;
  font-weight: ${props => props.theme.font.weight.light};
`

const PersonName = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.font.weight.medium};
`

const PersonData = styled.div`
  padding-left: ${props => props.theme.grid.unit * 2}px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const Container = styled.div`
  padding-top: ${props => props.theme.grid.unit}px;
`

interface Props {
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  isSearching: boolean
  isCreateAuthorOpen: boolean
  searchText: string
  searchResults: UserProfile[]
  addedAuthors: string[]
  authors: Contributor[]
  handleDoneCancel: () => void
  handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleSearchFocus: () => void
  handleInvite: (searchText: string) => void
  isAuthorExist: () => boolean
  handleCreateAuthor: () => void
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
}

const AddAuthorsSidebar: React.FunctionComponent<Props> = ({
  nonAuthors,
  numberOfAddedAuthors,
  isSearching,
  searchText,
  addedAuthors,
  handleDoneCancel,
  createAuthor,
  handleSearchChange,
  handleSearchFocus,
  searchResults,
  handleInvite,
  authors,
  isAuthorExist,
  isCreateAuthorOpen,
  handleCreateAuthor,
}) => {
  return (
    <ModalSidebar data-cy={'add-author-sidebar'}>
      <SidebarHeader>
        <SidebarTitle>Add Author</SidebarTitle>

        {!numberOfAddedAuthors ? (
          <Container>
            <TertiaryButton onClick={handleDoneCancel}>Cancel</TertiaryButton>
          </Container>
        ) : (
          <PrimaryButton onClick={handleDoneCancel}>Done</PrimaryButton>
        )}
      </SidebarHeader>

      <SidebarSearchField
        onFocus={handleSearchFocus}
        onBlur={handleSearchFocus}
      >
        <SidebarSearchIconContainer>
          {isSearching ? (
            <SearchIcon color={theme.colors.brand.default} />
          ) : (
            <SearchIcon />
          )}
        </SidebarSearchIconContainer>

        <SidebarSearchText
          value={searchText}
          placeholder={'Search name/email'}
          onChange={handleSearchChange}
          maxLength={100}
        />
      </SidebarSearchField>
      {searchText === '' ? (
        <SidebarContent>
          {nonAuthors.map((person: UserProfileWithAvatar) => (
            <SidebarPersonContainer key={person._id}>
              <UserDataContainer>
                <Avatar src={person.avatar} size={45} />
                <PersonData>
                  <PersonName>
                    <PersonInitial>
                      {person.bibliographicName.given}
                    </PersonInitial>
                    {person.bibliographicName.family}
                  </PersonName>
                </PersonData>
              </UserDataContainer>
              <AddAuthorButton
                person={person}
                isSelected={addedAuthors.includes(person.userID)}
                createAuthor={createAuthor}
                authors={authors}
              />
            </SidebarPersonContainer>
          ))}
        </SidebarContent>
      ) : isCreateAuthorOpen ? (
        <CreateAuthorPageContainer
          authors={authors}
          createAuthor={createAuthor}
          isOpen={isCreateAuthorOpen}
          handleCancel={handleCreateAuthor}
          searchText={searchText}
        />
      ) : (
        <SearchAuthorsSidebar
          handleInvite={handleInvite}
          searchText={searchText}
          addedAuthors={addedAuthors}
          createAuthor={createAuthor}
          searchResults={searchResults}
          authors={authors}
          isAuthorExist={isAuthorExist}
          handleCreateAuthor={handleCreateAuthor}
        />
      )}
    </ModalSidebar>
  )
}

export default AddAuthorsSidebar
