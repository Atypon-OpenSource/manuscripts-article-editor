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
  SecondaryButton,
  Tip,
} from '@manuscripts/style-guide'
import React from 'react'
import { buildAuthorPriority } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import { SidebarContent, SidebarPersonContainer } from '../Sidebar'
import AddAuthorButton from './AddAuthorButton'

const PersonInitial = styled.span`
  margin-right: ${props => props.theme.grid.unit}px;
  font-weight: ${props => props.theme.font.weight.light};
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.font.weight.medium};
`

const PeopleData = styled.div`
  padding-left: ${props => props.theme.grid.unit * 2}px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const SidebarText = styled.div`
  padding-left: ${props => props.theme.grid.unit * 2}px;
  font-size: ${props => props.theme.font.size.large};
  margin-bottom: ${props => props.theme.grid.unit * 7}px;
  margin-top: ${props => props.theme.grid.unit * 7}px;
`

const Name = styled.span`
  font-weight: ${props => props.theme.font.weight.semibold};
`

const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.grid.unit}px;
  align-items: center;

  & button {
    margin: ${props => props.theme.grid.unit}px 0;
    display: flex;
  }
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
          <span>
            <SidebarText data-cy={'sidebar-text'}>
              No matches found.
              <br />
              <br />
              Do you want to invite <Name>{searchText}</Name> as a collaborator?
              <br />
            </SidebarText>

            <SidebarFooter>
              <Tip
                title={`Add ${searchText} to the author list.`}
                placement={'left'}
              >
                <SecondaryButton
                  onClick={() =>
                    !isAuthorExist()
                      ? createAuthor(
                          buildAuthorPriority(authors),
                          null,
                          searchText
                        )
                      : handleCreateAuthor()
                  }
                >
                  Add to Author List
                </SecondaryButton>
              </Tip>

              <Tip
                title={`Add ${searchText} to the author list, and send an invitation to grant access to the project.`}
                placement={'left'}
              >
                <PrimaryButton onClick={() => handleInvite(searchText)}>
                  Add + Invite as Collaborator
                </PrimaryButton>
              </Tip>
            </SidebarFooter>
          </span>
        ) : (
          <span>
            <SidebarText>
              No matches found.
              <br />
              <br />
              Do you want to invite a new collaborator?
            </SidebarText>
            <SidebarFooter>
              <Tip
                title={`Send an invitation to ${searchText} to grant access to the project.`}
                placement={'left'}
              >
                <PrimaryButton onClick={() => handleInvite(searchText)}>
                  Invite as Collaborator
                </PrimaryButton>
              </Tip>
            </SidebarFooter>
          </span>
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
