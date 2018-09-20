import React from 'react'
import { buildAuthorPriority } from '../editor/manuscript/lib/authors'
import { styled } from '../theme'
import { Contributor, UserProfile } from '../types/components'
import AddAuthorButton from './AddAuthorButton'
import { Avatar } from './Avatar'
import { ManuscriptBlueButton } from './Button'
import { SidebarContent, SidebarPersonContainer } from './Sidebar'

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
  display: flex;
  padding-left: 5px;
`

const Container = styled.div`
  padding-left: 5px;
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
}

const SearchAuthorsSidebar: React.SFC<SearchSidebarProps> = ({
  createAuthor,
  handleInvite,
  searchText,
  searchResults,
  addedAuthors,
  authors,
}) => (
  <React.Fragment>
    {!searchResults.length ? (
      <SidebarContent>
        <SidebarText>
          No matches found.
          <br />
          Do you want to <b>create</b> a new author or
          <br />
          <b>invite</b> a new Collaborator to be added to
          <br />
          the author list?
        </SidebarText>
        <SidebarButtonContainer>
          <ManuscriptBlueButton onClick={() => handleInvite(searchText)}>
            Invite
          </ManuscriptBlueButton>

          <Container>
            <ManuscriptBlueButton
              onClick={() =>
                createAuthor(buildAuthorPriority(authors), null, searchText)
              }
            >
              Create
            </ManuscriptBlueButton>
          </Container>
        </SidebarButtonContainer>
      </SidebarContent>
    ) : (
      <SidebarContent>
        {searchResults.map(person => (
          <SidebarPersonContainer key={person.id}>
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
