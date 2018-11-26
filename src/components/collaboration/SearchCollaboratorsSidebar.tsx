import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { darkGrey } from '../../colors'
import { styled } from '../../theme'
import { Avatar } from '../Avatar'
import { ManuscriptBlueButton } from '../Button'
import { SidebarContent, SidebarPersonContainer } from '../Sidebar'
import AddCollaboratorButton from './AddCollaboratorButton'

const PersonInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: #353535;
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
          <ManuscriptBlueButton onClick={() => handleInvite(searchText)}>
            Invite
          </ManuscriptBlueButton>
        </SidebarButtonContainer>
      </SidebarContent>
    ) : (
      <SidebarContent>
        {searchResults.map((person: UserProfileWithAvatar) => (
          <SidebarPersonContainer key={person._id}>
            <UserDataContainer>
              <Avatar src={person.avatar} size={45} color={darkGrey} />
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
