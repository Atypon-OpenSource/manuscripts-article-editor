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
import { Avatar } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { buildAuthorPriority } from '../../lib/authors'
import {
  SidebarContent,
  SidebarEmptyResult,
  SidebarPersonContainer,
} from '../Sidebar'
import AddAuthorButton from './AddAuthorButton'

const PersonInitial = styled.span`
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.light};
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
`

const PeopleData = styled.div`
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const TextContainer = styled.div`
  word-break: break-word;
`
interface SearchSidebarProps {
  searchText: string
  searchResults: UserProfile[]
  addedAuthors: string[]
  authors: Contributor[]
  handleInvite: (searchText: string) => void
  createAuthor: (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => void
  isAuthorExist: () => boolean
  handleCreateAuthor: () => void
}

const SearchAuthorsSidebar: React.FunctionComponent<SearchSidebarProps> = ({
  createAuthor,
  handleInvite,
  searchText,
  searchResults,
  addedAuthors,
  authors,
  isAuthorExist,
  handleCreateAuthor,
}) => (
  <React.Fragment>
    {!searchResults.length ? (
      <SidebarContent>
        {!searchText.includes('@') ? (
          <SidebarEmptyResult
            primaryButton={{
              action: () => handleInvite(searchText),
              text: 'Add + Invite as Collaborator',
              tip: {
                text: `Add ${searchText} to the author list, and send an invitation to grant access to the project`,
                placement: 'left',
              },
            }}
            secondaryButton={{
              action: () =>
                !isAuthorExist()
                  ? createAuthor(buildAuthorPriority(authors), null, searchText)
                  : handleCreateAuthor(),
              text: 'Add to Author List',
              tip: {
                text: `Add ${searchText} to the author list.`,
                placement: 'left',
              },
            }}
            text={
              <TextContainer>
                Do you want to invite <strong>{searchText}</strong> as a
                collaborator?
              </TextContainer>
            }
          />
        ) : (
          <SidebarEmptyResult
            primaryButton={{
              action: () => handleInvite(searchText),
              text: 'Invite as Collaborator',
              tip: {
                text: `Send an invitation to ${searchText} to grant access to the project.`,
                placement: 'left',
              },
            }}
            text="Do you want to invite a new collaborator?"
          />
        )}
      </SidebarContent>
    ) : (
      <SidebarContent>
        {searchResults.map((person: UserProfileWithAvatar) => (
          <SidebarPersonContainer key={person._id}>
            <UserDataContainer>
              <Avatar src={person.avatar} size={45} />
              <PeopleData>
                <PersonName>
                  <PersonInitial>
                    {person.bibliographicName.given}
                  </PersonInitial>
                  {person.bibliographicName.family}
                </PersonName>
              </PeopleData>
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
    )}
  </React.Fragment>
)

export default SearchAuthorsSidebar
