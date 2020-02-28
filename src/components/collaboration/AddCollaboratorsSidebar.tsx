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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import {
  ContainerInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Avatar } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'
import { TokenActions } from '../../data/TokenData'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarPersonContainer,
  SidebarSearch,
} from '../Sidebar'
import AddCollaboratorButton from './AddCollaboratorButton'
import SearchCollaboratorsSidebar from './SearchCollaboratorsSidebar'

const PersonInitial = styled.span`
  margin-right: ${props => props.theme.grid.unit}px;
  font-weight: ${props => props.theme.font.weight.xlight};
`

const PersonName = styled.div`
  font-size: ${props => props.theme.font.size.xlarge};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.font.weight.medium};
  white-space: nowrap;
  text-overflow: ellipsis;
`

const PersonData = styled.div`
  padding-left: 10px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 100px;
  overflow: hidden;
`

const Invited = styled.div`
  display: flex;
  font-size: ${props => props.theme.font.size.small};
  color: ${props => props.theme.colors.brand.default};
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${props => props.theme.grid.unit * 2}px;
`

const AddedIconContainer = styled.div`
  display: flex;
  padding-left: ${props => props.theme.grid.unit * 2}px;

  &:focus {
    outline: none;
  }
`

const SearchContainer = styled.div`
  margin-bottom: ${props => props.theme.grid.unit * 2}px;
`

interface Props {
  people: UserProfile[]
  invitations: ContainerInvitation[]
  numberOfAddedCollaborators: number
  addedUsers: string[]
  countAddedCollaborators: () => void
  handleDoneCancel: () => void
  handleInvite: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
  setSearchText: (searchText: string) => void
  tokenActions: TokenActions
}

interface State {
  searchText: string
  searchResults: UserProfile[]
}

class AddCollaboratorsSidebar extends React.Component<Props, State> {
  public state = {
    searchText: '',
    searchResults: [],
  }

  public render() {
    const {
      people,
      invitations,
      numberOfAddedCollaborators,
      countAddedCollaborators,
      addedUsers,
      handleDoneCancel,
      handleInvite,
      addCollaborator,
      tokenActions,
    } = this.props

    const { searchResults, searchText } = this.state

    return (
      <Sidebar data-cy={'sidebar'}>
        <SidebarHeader
          action={handleDoneCancel}
          isCancel={!numberOfAddedCollaborators}
          title={'Add Collaborators'}
        />

        <SearchContainer>
          <SidebarSearch
            autoFocus={true}
            handleSearchChange={this.handleSearchChange}
            maxLength={100}
            placeholder={'Search name/email'}
            value={searchText}
          />
        </SearchContainer>

        {searchText === '' ? (
          <SidebarContent>
            {invitations.map(invitation => (
              <SidebarPersonContainer key={invitation._id}>
                <UserDataContainer>
                  <Avatar size={45} color={'#6e6e6e'} />
                  <PersonData>
                    <PersonName>
                      {invitation.invitedUserName ||
                        invitation.invitedUserEmail}
                    </PersonName>
                  </PersonData>
                </UserDataContainer>
                <InvitedContainer>
                  <Invited>Invited</Invited>
                  <AddedIconContainer>
                    <AddedIcon />
                  </AddedIconContainer>
                </InvitedContainer>
              </SidebarPersonContainer>
            ))}
            {people.map((person: UserProfileWithAvatar) => (
              <SidebarPersonContainer key={person._id}>
                <UserDataContainer>
                  <Avatar size={45} src={person.avatar} color={'#6e6e6e'} />
                  <PersonData>
                    <PersonName>
                      <PersonInitial>
                        {person.bibliographicName.given}
                      </PersonInitial>
                      {person.bibliographicName.family}
                    </PersonName>
                  </PersonData>
                </UserDataContainer>
                <AddCollaboratorButton
                  collaborator={person}
                  isSelected={addedUsers.includes(person.userID)}
                  addCollaborator={addCollaborator}
                  countAddedCollaborators={countAddedCollaborators}
                  tokenActions={tokenActions}
                />
              </SidebarPersonContainer>
            ))}
          </SidebarContent>
        ) : (
          <SearchCollaboratorsSidebar
            handleInvite={handleInvite}
            searchText={searchText}
            countAddedCollaborators={countAddedCollaborators}
            addCollaborator={addCollaborator}
            searchResults={searchResults}
            tokenActions={tokenActions}
          />
        )}
      </Sidebar>
    )
  }

  private handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    const searchText = event.currentTarget.value
    this.setState({ searchText })

    this.props.setSearchText(searchText)

    this.search(event.currentTarget.value)
  }

  private search = (searchText: string) => {
    const { people, addedUsers } = this.props

    if (!people || !searchText) {
      return this.setState({
        searchResults: [],
      })
    }

    searchText = searchText.toLowerCase()

    const searchResults: UserProfile[] = people.filter(person => {
      if (addedUsers.includes(person.userID)) return false

      if (searchText.includes('@')) {
        return person.email && person.email.toLowerCase().includes(searchText)
      }

      const personName = [
        person.bibliographicName.given,
        person.bibliographicName.family,
      ]
        .filter(part => part)
        .join(' ')
        .toLowerCase()

      return personName && personName.includes(searchText)
    })

    this.setState({
      searchResults,
    })
  }
}

export default AddCollaboratorsSidebar
