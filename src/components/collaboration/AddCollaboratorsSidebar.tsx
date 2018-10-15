import React from 'react'
import { darkGrey } from '../../colors'
import AddedIcon from '../../icons/added-icon'
import SearchIcon from '../../icons/search'
import { styled } from '../../theme'
import { ProjectInvitation, UserProfile } from '../../types/components'
import { Avatar } from '../Avatar'
import {
  IconButton,
  ManuscriptBlueButton,
  TransparentGreyButton,
} from '../Button'
import Panel from '../Panel'
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

const PersonInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: #353535;
  font-weight: 500;
`

const PeopleSidebar = styled(Sidebar)`
  background-color: #f8fbfe;
`

const PersonData = styled.div`
  padding-left: 10px;
`

const UserDataContainer = styled.div`
  display: flex;
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
    <PeopleSidebar>
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

      <SidebarSearchField
        onFocus={handleSearchFocus}
        onBlur={handleSearchFocus}
      >
        <SidebarSearchIconContainer>
          {isSearching ? <SearchIcon color={'#e0eef9'} /> : <SearchIcon />}
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
          {invitations.map(invitation => (
            <SidebarPersonContainer key={invitation._id}>
              <UserDataContainer>
                <Avatar size={45} color={'#585858'} />
                <PersonData>
                  <PersonName>{invitation.invitedUserName}</PersonName>
                </PersonData>
              </UserDataContainer>
              <InvitedContainer>
                <Invited>Invited</Invited>
                <AddIconButton>
                  <AddedIcon />
                </AddIconButton>
              </InvitedContainer>
            </SidebarPersonContainer>
          ))}
          {people.map(person => (
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
    </PeopleSidebar>
  </Panel>
)

export default AddCollaboratorsSidebar
