import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { darkGrey } from '../../colors'
import { buildAuthorPriority } from '../../lib/authors'
import { styled, ThemedProps } from '../../theme'
import { Avatar } from '../Avatar'
import { GreyButton, PrimaryButton } from '../Button'
import { SidebarContent, SidebarPersonContainer } from '../Sidebar'
import AddAuthorButton from './AddAuthorButton'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const PersonInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${(props: ThemedDivProps) => props.theme.colors.sidebar.text.primary};
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
  padding-left: 10px;
`
const Action = styled.span`
  font-weight: 600;
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
            <SidebarText>
              No matches found.
              <br />
              Do you want to <Action>create</Action> a new author or
              <Action> invite</Action> a new Collaborator to be added to the
              author list?
            </SidebarText>

            <SidebarButtonContainer>
              <GreyButton
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
                Create
              </GreyButton>

              <Container>
                <PrimaryButton onClick={() => handleInvite(searchText)}>
                  Invite
                </PrimaryButton>
              </Container>
            </SidebarButtonContainer>
          </span>
        ) : (
          <span>
            <SidebarText>
              No matches found.
              <br />
              Do you want to <Action>invite</Action> a new Collaborator to be
              added to
              <br />
              the author list?
            </SidebarText>
            <SidebarButtonContainer>
              <Container>
                <PrimaryButton onClick={() => handleInvite(searchText)}>
                  Invite
                </PrimaryButton>
              </Container>
            </SidebarButtonContainer>
          </span>
        )}
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
