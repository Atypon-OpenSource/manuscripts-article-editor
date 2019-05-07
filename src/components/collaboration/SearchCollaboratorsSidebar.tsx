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
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { Avatar, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { TokenActions } from '../../data/TokenData'
import { styled } from '../../theme/styled-components'
import { SidebarContent, SidebarPersonContainer } from '../Sidebar'
import AddCollaboratorButton from './AddCollaboratorButton'

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
  padding-left: 20px;
  font-size: 20px;
  margin-bottom: 30px;
  margin-top: 30px;
`

const SidebarButtonContainer = styled.div`
  padding-left: 20px;
`

interface SearchSidebarProps {
  searchText: string
  searchResults: UserProfile[]
  addCollaborator: (userID: string, role: string) => Promise<void>
  countAddedCollaborators: () => void
  handleInvite: (searchText: string) => void
  tokenActions: TokenActions
}

const SearchCollaboratorsSidebar: React.FunctionComponent<
  SearchSidebarProps
> = ({
  addCollaborator,
  countAddedCollaborators,
  handleInvite,
  searchText,
  searchResults,
  tokenActions,
}) => (
  <React.Fragment>
    {!searchResults.length ? (
      <SidebarContent>
        <SidebarText data-cy={'sidebar-text'}>
          No matches found.
          <br />
          Do you want to <b>invite</b> {searchText}?
        </SidebarText>
        <SidebarButtonContainer>
          <PrimaryButton onClick={() => handleInvite(searchText)}>
            Invite
          </PrimaryButton>
        </SidebarButtonContainer>
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
            <AddCollaboratorButton
              collaborator={person}
              addCollaborator={addCollaborator}
              countAddedCollaborators={countAddedCollaborators}
              tokenActions={tokenActions}
            />
          </SidebarPersonContainer>
        ))}
      </SidebarContent>
    )}
  </React.Fragment>
)

export default SearchCollaboratorsSidebar
