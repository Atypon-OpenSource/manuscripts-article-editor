import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { Avatar } from '../Avatar'
import { PrimaryButton } from '../Button'
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
}

const SearchCollaboratorsSidebar: React.FunctionComponent<
  SearchSidebarProps
> = ({
  addCollaborator,
  countAddedCollaborators,
  handleInvite,
  searchText,
  searchResults,
}) => (
  <React.Fragment>
    {!searchResults.length ? (
      <SidebarContent>
        <SidebarText>
          No matches in the People list.
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
            />
          </SidebarPersonContainer>
        ))}
      </SidebarContent>
    )}
  </React.Fragment>
)

export default SearchCollaboratorsSidebar
