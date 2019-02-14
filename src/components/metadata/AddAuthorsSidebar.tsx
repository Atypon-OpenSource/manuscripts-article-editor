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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { GreyButton, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import SearchIcon from '../../icons/search'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import { Avatar } from '../Avatar'
import {
  Sidebar,
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
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${props => props.theme.colors.sidebar.text.primary};
  font-weight: 500;
`

const PersonData = styled.div`
  padding-left: 10px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const Container = styled.div`
  padding-top: 5px;
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
    <Sidebar>
      <SidebarHeader>
        <SidebarTitle>Add Author</SidebarTitle>

        {!numberOfAddedAuthors ? (
          <Container>
            <GreyButton onClick={handleDoneCancel}>Cancel</GreyButton>
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
            <SearchIcon color={theme.colors.authors.searchIcon} />
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
    </Sidebar>
  )
}

export default AddAuthorsSidebar
