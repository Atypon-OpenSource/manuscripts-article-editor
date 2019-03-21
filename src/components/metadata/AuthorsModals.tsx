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

import {
  Affiliation,
  Contributor,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide'
import React from 'react'
import { AffiliationMap } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import {
  AddAuthorsPage,
  AuthorDetailsPage,
  InviteCollaboratorsModal,
} from '../collaboration/CollaboratorsPage'
import { InvitationValues } from '../collaboration/InvitationForm'
import InviteCollaboratorsSidebar from '../collaboration/InviteCollaboratorsSidebar'
import AddAuthorsSidebar from './AddAuthorsSidebar'
import { AuthorFormContainer } from './AuthorFormContainer'
import AuthorsSidebar from './AuthorsSidebar'

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 ${props => props.theme.colors.modal.shadow};
  background: #fff;
`

const ModalSidebar = styled.div`
  width: 300px;
  height: 70vh;
  overflow: hidden;
`

const ModalMain = styled.div`
  flex: 1;
  height: 70vh;
  overflow-y: auto;
`

interface AuthorsProps {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  selectedAuthor: Contributor | null
  isRemoveAuthorOpen: boolean
  project: Project
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  updateAuthor: (author: Contributor, email: string) => void
  openAddAuthors: () => void
  createAffiliation: (name: string) => Promise<Affiliation>
  isRejected: (invitationID: string) => boolean
  getAuthorName: (author: Contributor) => string
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  handleRemoveAuthor: () => void
  handleDrop: (oldIndex: number, newIndex: number) => void
  getSidebarItemDecorator?: (authorID: string) => JSX.Element | null
}

export const AuthorsModal: React.FunctionComponent<AuthorsProps> = ({
  authors,
  authorAffiliations,
  affiliations,
  removeAuthor,
  selectAuthor,
  selectedAuthor,
  openAddAuthors,
  handleSaveAuthor,
  createAffiliation,
  handleDrop,
  getSidebarItemDecorator,
  isRemoveAuthorOpen,
  handleRemoveAuthor,
  isRejected,
  project,
  updateAuthor,
  getAuthorName,
}) => (
  <ModalBody>
    <ModalSidebar>
      <AuthorsSidebar
        authors={authors}
        authorAffiliations={authorAffiliations}
        selectAuthor={selectAuthor}
        selectedAuthor={selectedAuthor}
        openAddAuthors={openAddAuthors}
        handleDrop={handleDrop}
        getSidebarItemDecorator={getSidebarItemDecorator}
      />
    </ModalSidebar>
    <ModalMain>
      {selectedAuthor ? (
        <AuthorFormContainer
          author={selectedAuthor}
          affiliations={affiliations}
          authorAffiliations={
            authorAffiliations.get(selectedAuthor._id) as AuthorAffiliation[]
          }
          handleSave={handleSaveAuthor}
          createAffiliation={createAffiliation}
          isRemoveAuthorOpen={isRemoveAuthorOpen}
          handleRemoveAuthor={handleRemoveAuthor}
          removeAuthor={removeAuthor}
          isRejected={isRejected}
          project={project}
          updateAuthor={updateAuthor}
          getAuthorName={getAuthorName}
        />
      ) : (
        <AuthorDetailsPage />
      )}
    </ModalMain>
  </ModalBody>
)

interface AddAuthorsProps {
  nonAuthors: UserProfile[]
  authors: Contributor[]
  numberOfAddedAuthors: number
  searchingAuthors: boolean
  searchText: string
  addedAuthors: string[]
  searchResults: UserProfile[]
  isCreateAuthorOpen: boolean
  isAuthorExist: () => boolean
  handleAddingDoneCancel: () => void
  handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleSearchFocus: () => void
  handleInvite: (searchText: string) => void
  handleCreateAuthor: () => void
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
}

export const AddAuthorsModal: React.FunctionComponent<AddAuthorsProps> = ({
  nonAuthors,
  authors,
  addedAuthors,
  numberOfAddedAuthors,
  searchingAuthors,
  searchResults,
  searchText,
  createAuthor,
  handleAddingDoneCancel,
  handleSearchChange,
  handleSearchFocus,
  handleInvite,
  isAuthorExist,
  isCreateAuthorOpen,
  handleCreateAuthor,
}) => (
  <ModalBody>
    <ModalSidebar>
      <AddAuthorsSidebar
        authors={authors}
        nonAuthors={nonAuthors}
        numberOfAddedAuthors={numberOfAddedAuthors}
        isSearching={searchingAuthors}
        searchText={searchText}
        addedAuthors={addedAuthors}
        handleDoneCancel={handleAddingDoneCancel}
        createAuthor={createAuthor}
        handleSearchChange={handleSearchChange}
        handleSearchFocus={handleSearchFocus}
        searchResults={searchResults}
        handleInvite={handleInvite}
        isAuthorExist={isAuthorExist}
        isCreateAuthorOpen={isCreateAuthorOpen}
        handleCreateAuthor={handleCreateAuthor}
      />
    </ModalSidebar>
    <ModalMain>
      <AddAuthorsPage addedAuthorsCount={numberOfAddedAuthors} />
    </ModalMain>
  </ModalBody>
)

interface InviteAuthorsProps {
  project: Project
  invitationValues: InvitationValues
  handleInviteCancel: () => void
  handleInvitationSubmit: (values: InvitationValues) => Promise<void>
  invitationSent: boolean
}

export const InviteAuthorsModal: React.FunctionComponent<
  InviteAuthorsProps
> = ({
  project,
  invitationValues,
  handleInviteCancel,
  handleInvitationSubmit,
  invitationSent,
}) => (
  <ModalBody>
    <ModalSidebar>
      <InviteCollaboratorsSidebar
        invitationValues={invitationValues}
        handleCancel={handleInviteCancel}
        handleSubmit={handleInvitationSubmit}
        invitationSent={invitationSent}
        isModal={true}
      />
    </ModalSidebar>
    <ModalMain>
      <InviteCollaboratorsModal project={project} />
    </ModalMain>
  </ModalBody>
)
