import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { darkGrey, powderBlue } from '../../colors'
import SearchIcon from '../../icons/search'
import { styled, ThemedProps } from '../../theme'
import { Avatar } from '../Avatar'
import { GreyButton, PrimaryButton } from '../Button'
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
import AddCollaboratorButton from './AddCollaboratorButton'
import SearchCollaboratorsSidebar from './SearchCollaboratorsSidebar'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const PersonInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.text.primary};
  font-weight: 500;
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
  font-size: 12px;
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.label};
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
`

const AddedIconContainer = styled.div`
  display: flex;
  padding: 0 10px;

  &:focus {
    outline: none;
  }
`

interface Props {
  people: UserProfile[]
  invitations: ProjectInvitation[]
  numberOfAddedCollaborators: number
  addedUsers: string[]
  countAddedCollaborators: () => void
  handleDoneCancel: () => void
  handleInvite: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
  setSearchText: (searchText: string) => void
}

interface State {
  isSearching: boolean
  searchText: string
  searchResults: UserProfile[]
}

class AddCollaboratorsSidebar extends React.Component<Props, State> {
  public state = {
    isSearching: false,
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
    } = this.props

    const { searchResults, searchText, isSearching } = this.state

    return (
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Add Collaborators</SidebarTitle>

          {!numberOfAddedCollaborators ? (
            <GreyButton onClick={handleDoneCancel}>Cancel</GreyButton>
          ) : (
            <PrimaryButton onClick={handleDoneCancel}>Done</PrimaryButton>
          )}
        </SidebarHeader>

        <SidebarSearchField
          onFocus={this.handleSearchFocus}
          onBlur={this.handleSearchFocus}
        >
          <SidebarSearchIconContainer>
            {isSearching ? <SearchIcon color={powderBlue} /> : <SearchIcon />}
          </SidebarSearchIconContainer>

          <SidebarSearchText
            value={searchText}
            placeholder={'Search name/email'}
            onChange={this.handleSearchChange}
            maxLength={100}
          />
        </SidebarSearchField>
        {searchText === '' ? (
          <SidebarContent>
            {invitations.map(invitation => (
              <SidebarPersonContainer key={invitation._id}>
                <UserDataContainer>
                  <Avatar size={45} color={darkGrey} />
                  <PersonData>
                    <PersonName>{invitation.invitedUserName}</PersonName>
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
                  <Avatar src={person.avatar} size={45} color={darkGrey} />
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
          />
        )}
      </Sidebar>
    )
  }

  private handleSearchFocus = () => {
    this.setState({
      isSearching: !this.state.isSearching,
    })
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
