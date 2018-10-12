import React from 'react'
import { darkGrey } from '../../colors'
import SearchIcon from '../../icons/search'
import { styled } from '../../theme'
import { Contributor, UserProfile } from '../../types/components'
import { Avatar } from '../Avatar'
import { ManuscriptBlueButton, TransparentGreyButton } from '../Button'
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
import AddAuthorButton from './AddAuthorButton'
import SearchAuthorsSidebar from './SearchAuthorsSidebar'

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

interface Props {
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  isSearching: boolean
  searchText: string
  searchResults: UserProfile[]
  addedAuthors: string[]
  authors: Contributor[]
  handleDoneCancel: () => void
  handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleSearchFocus: () => void
  handleInvite: () => void
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
}

const AddAuthorsSidebar: React.SFC<Props> = ({
  nonAuthors,
  numberOfAddedAuthors,
  isSearching,
  searchText,
  addedAuthors,
  handleDoneCancel,
  createAuthor,
  handleSearchChange,
  handleSearchFocus,
  searchResults,
  handleInvite,
  authors,
}) => {
  return (
    <Panel
      name={'authors-sidebar'}
      direction={'row'}
      side={'end'}
      minSize={250}
    >
      <PeopleSidebar>
        <SidebarHeader>
          <SidebarTitle>Add Author</SidebarTitle>

          {!numberOfAddedAuthors ? (
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
            {nonAuthors.map(person => (
              <SidebarPersonContainer key={person.id}>
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
                <AddAuthorButton
                  person={person}
                  isSelected={addedAuthors.includes(person.userID)}
                  createAuthor={createAuthor}
                  authors={authors}
                />
              </SidebarPersonContainer>
            ))}
          </SidebarContent>
        ) : (
          <SearchAuthorsSidebar
            handleInvite={handleInvite}
            searchText={searchText}
            addedAuthors={addedAuthors}
            createAuthor={createAuthor}
            searchResults={searchResults}
            authors={authors}
          />
        )}
      </PeopleSidebar>
    </Panel>
  )
}

export default AddAuthorsSidebar
