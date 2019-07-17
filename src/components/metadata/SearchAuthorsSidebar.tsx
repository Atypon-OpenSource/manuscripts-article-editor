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
import { Avatar, Button, PrimaryButton, Tip } from '@manuscripts/style-guide'
import React from 'react'
import { buildAuthorPriority } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import { SidebarContent, SidebarPersonContainer } from '../Sidebar'
import AddAuthorButton from './AddAuthorButton'

const PersonInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${props => props.theme.colors.sidebar.text.primary};
  font-weight: 500;
`

const PeopleData = styled.div`
  padding-left: 10px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const SidebarText = styled.div`
  padding-left: 10px;
  font-size: 20px;
  margin-bottom: 30px;
  margin-top: 30px;
`

const Name = styled.span`
  font-weight: 600;
`

const SidebarFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  align-items: center;

  & button {
    margin: 4px 0;
    display: flex;
  }
`

const AddButton = styled(Button)`
  width: 260px;
`
const InviteButton = styled(PrimaryButton)`
  width: 260px;
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
                <AddButton
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
                </AddButton>
              </Tip>

              <Tip
                title={`Add ${searchText} to the author list, and send an invitation to grant access to the project.`}
                placement={'left'}
              >
                <InviteButton onClick={() => handleInvite(searchText)}>
                  Add + Invite as Collaborator
                </InviteButton>
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
                <InviteButton onClick={() => handleInvite(searchText)}>
                  Invite as Collaborator
                </InviteButton>
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
