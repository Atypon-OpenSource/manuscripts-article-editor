/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AddAuthor from '@manuscripts/assets/react/AddAuthor'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { styled } from '../../theme/styled-components'
import { AuthorAffiliation } from './Author'
import DraggableAuthorItem from './DraggableAuthorItem'

const AddIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px 0 20px;
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: ${props => props.theme.colors.sidebar.text.primary};
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: #000;
  }

  &:focus {
    outline: none;
  }

  &:hover use {
    fill: ${props => props.theme.colors.authors.add.hovered};
  }
`

const Sidebar = styled.div`
  background-color: ${props => props.theme.colors.sidebar.background.default};
  border-top-left-radius: ${props => props.theme.radius}px;
  border-bottom-left-radius: ${props => props.theme.radius}px;
  padding-bottom: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
`

const SidebarTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${props => props.theme.colors.sidebar.text.primary};
`

const SidebarAction = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`

const SidebarList = styled.div`
  flex: 1;
  overflow-y: auto;
`

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  selectedAuthor: Contributor | null
  checkInvitations: (author: Contributor) => boolean
  selectAuthor: (item: Contributor) => void
  openAddAuthors: () => void
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
}

const AuthorsSidebar: React.FunctionComponent<Props> = ({
  authors,
  selectAuthor,
  selectedAuthor,
  openAddAuthors,
  handleDrop,
  checkInvitations,
}) => (
  <Sidebar>
    <SidebarHeader>
      <SidebarTitle>Authors</SidebarTitle>
    </SidebarHeader>

    <SidebarAction>
      <AddButton
        onClick={() => {
          openAddAuthors()
        }}
      >
        <AddIcon>
          <AddAuthor />
        </AddIcon>
        New Author
      </AddButton>
    </SidebarAction>

    <SidebarList>
      {authors.map((author, index) => {
        // const affiliations = authorAffiliations.get(author._id)
        // const user = users.findOne(author.userID) // TODO

        const user: Partial<UserProfile> = {
          _id: author.userID,
        }

        const authorItem = {
          _id: author._id,
          priority: author.priority || null,
          index,
        }

        return (
          <DraggableAuthorItem
            key={author._id}
            authorItem={authorItem}
            onDrop={handleDrop}
            author={author}
            authors={authors}
            user={user}
            selectedAuthor={selectedAuthor}
            selectAuthor={selectAuthor}
            checkInvitations={checkInvitations}
          />
        )
      })}
    </SidebarList>
  </Sidebar>
)

export default AuthorsSidebar
