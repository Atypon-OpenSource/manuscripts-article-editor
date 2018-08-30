import React from 'react'
import AddedIcon from '../icons/added-icon'
import SearchIcon from '../icons/search'
import { styled } from '../theme'
import { ProjectInvitation, UserProfile } from '../types/components'
import AddCollaboratorButton from './AddCollaboratorButton'
import { Avatar } from './Avatar'
import {
  IconButton,
  ManuscriptBlueButton,
  TransparentGreyButton,
} from './Button'
import Panel from './Panel'
import SearchCollaboratorsSidebar from './SearchCollaboratorsSidebar'
import { Sidebar, SidebarContent, SidebarHeader, SidebarTitle } from './Sidebar'

const PeopleContainer = styled.div`
  display: flex;
  margin: 0 -22px;
  padding: 10px 20px;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;

  & :hover {
    background-color: #e0eef9;
  }
`

const PersonInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: #353535;
  font-weight: 500;
`

const PeopleSideBar = styled(Sidebar)`
  background-color: #f8fbfe;
`

const SearchField = styled.div`
  display: flex;
  margin: 10px;
  align-items: center;
  cursor: pointer;
`

const SearchText = styled.input`
  display: flex;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background-color: transparent;
  height: 30px;
  position: relative;
  left: -16px;
  right: -16px;
  padding-left: 24px;

  &:hover,
  &:focus {
    background-color: #e0eef9;
    outline: none;
  }

  &::placeholder {
    color: #000;
  }

  &:focus::placeholder {
    color: transparent;
  }
`

const PeopleData = styled.div`
  padding-left: 10px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const SearchIconContainer = styled.span`
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: #7fb5d5;
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
`

const AddIconButton = styled(IconButton)`
  display: flex;
  width: unset;
  height: unset;

  &:focus {
    outline: none;
  }
`

interface Props {
  people: UserProfile[]
  invitations: ProjectInvitation[]
  numberOfAddedCollaborators: number
  isSearching: boolean
  searchText: string
  searchResults: UserProfile[]
  addedUsers: string[]
  countAddedCollaborators: () => void
  handleDoneCancel: () => void
  addCollaborator: (userID: string, role: string) => Promise<void>
  handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleInvite: (searchText: string) => void
  handleSearchFocus: () => void
}

const AddCollaboratorsSidebar: React.SFC<Props> = ({
  people,
  invitations,
  numberOfAddedCollaborators,
  isSearching,
  searchText,
  countAddedCollaborators,
  addedUsers,
  handleDoneCancel,
  addCollaborator,
  handleSearchChange,
  handleInvite,
  handleSearchFocus,
  searchResults,
}) => (
  <Panel
    name={'collaborators-sidebar'}
    direction={'row'}
    side={'end'}
    minSize={250}
  >
    <PeopleSideBar>
      <SidebarHeader>
        <SidebarTitle>Add Collaborators</SidebarTitle>

        {!numberOfAddedCollaborators ? (
          <TransparentGreyButton onClick={handleDoneCancel}>
            Cancel
          </TransparentGreyButton>
        ) : (
          <ManuscriptBlueButton onClick={handleDoneCancel}>
            Done
          </ManuscriptBlueButton>
        )}
      </SidebarHeader>

      <SearchField onFocus={handleSearchFocus} onBlur={handleSearchFocus}>
        <SearchIconContainer>
          {isSearching ? <SearchIcon color={'#e0eef9'} /> : <SearchIcon />}
        </SearchIconContainer>

        <SearchText
          value={searchText}
          placeholder={'Search name/email'}
          onChange={handleSearchChange}
          maxLength={100}
        />
      </SearchField>
      {searchText === '' ? (
        <SidebarContent>
          {invitations.map(invitation => (
            <PeopleContainer key={invitation.id}>
              <UserDataContainer>
                <Avatar size={45} color={'#585858'} />
                <PeopleData>
                  <PersonName>{invitation.invitedUserName}</PersonName>
                </PeopleData>
              </UserDataContainer>
              <InvitedContainer>
                <Invited>Invited</Invited>
                <AddIconButton>
                  <AddedIcon />
                </AddIconButton>
              </InvitedContainer>
            </PeopleContainer>
          ))}
          {people.map(person => (
            <PeopleContainer key={person.id}>
              <UserDataContainer>
                <Avatar src={person.avatar} size={45} color={'#585858'} />
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
                isSelected={addedUsers.includes(person.userID)}
                addCollaborator={addCollaborator}
                countAddedCollaborators={countAddedCollaborators}
              />
            </PeopleContainer>
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
    </PeopleSideBar>
  </Panel>
)

export default AddCollaboratorsSidebar
