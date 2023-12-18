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

import { Contributor, UserProfile } from '@manuscripts/json-schema'
import { Avatar } from '@manuscripts/style-guide'
import { UserProfileWithAvatar } from '@manuscripts/transform'
import React from 'react'
import styled from 'styled-components'

import { SidebarContent, SidebarPersonContainer } from '../Sidebar'
import AddAuthorButton from './AddAuthorButton'

const PersonInitial = styled.span`
  margin-right: ${(props) => props.theme.grid.unit}px;
  font-weight: ${(props) => props.theme.font.weight.light};
`

const PersonName = styled.div`
  font-size: 120%;
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
`

const PeopleData = styled.div`
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`

const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

interface SearchSidebarProps {
  searchResults: UserProfile[]
  addedAuthors: string[]
  authors: Contributor[]
  createAuthor: (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => void
}

const SearchAuthorsSidebar: React.FunctionComponent<SearchSidebarProps> = ({
  createAuthor,
  searchResults,
  addedAuthors,
  authors,
}) => (
  <React.Fragment>
    <SidebarContent>
      {searchResults.map((person: UserProfileWithAvatar) => (
        <SidebarPersonContainer key={person._id}>
          <UserDataContainer>
            <Avatar src={person.avatar} size={45} />
            <PeopleData>
              <PersonName>
                <PersonInitial>{person.bibliographicName.given}</PersonInitial>
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
  </React.Fragment>
)

export default SearchAuthorsSidebar
