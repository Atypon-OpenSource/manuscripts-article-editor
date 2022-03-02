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

import {
  Affiliation,
  Contributor,
  ContributorRole,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { TokenActions } from '../../data/TokenData'
import { AffiliationMap } from '../../lib/authors'
import { useStore } from '../../store'
import {
  AddAuthorsPage,
  AuthorDetailsPage,
  InviteCollaboratorsModal,
} from '../collaboration/CollaboratorsPage'
import { InvitationValues } from '../collaboration/InvitationForm'
import InviteCollaboratorsSidebar from '../collaboration/InviteCollaboratorsSidebar'
import { ModalBody, StyledModalMain } from '../Sidebar'
import AddAuthorsSidebar from './AddAuthorsSidebar'
import { AuthorFormContainer } from './AuthorFormContainer'
import AuthorsSidebar from './AuthorsSidebar'

const ScrollableModalMain = styled(StyledModalMain)`
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
  addAuthorAffiliation: (affiliation: Affiliation | string) => void
  removeAuthorAffiliation: (affiliation: Affiliation) => void
  updateAffiliation: (affiliation: Affiliation) => void
  isRejected: (invitationID: string) => boolean
  getAuthorName: (author: Contributor) => string
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  handleRemoveAuthor: () => void
  handleDrop: (oldIndex: number, newIndex: number) => void
  getSidebarItemDecorator?: (authorID: string) => JSX.Element | null
  tokenActions: TokenActions
  invitationSent: boolean
  handleDismiss: () => void
  contributorRoles: ContributorRole[]
  createContributorRole: (name: string) => Promise<ContributorRole>
  allowInvitingAuthors: boolean
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
  addAuthorAffiliation,
  removeAuthorAffiliation,
  updateAffiliation,
  handleDrop,
  getSidebarItemDecorator,
  isRemoveAuthorOpen,
  handleRemoveAuthor,
  isRejected,
  project,
  updateAuthor,
  getAuthorName,
  tokenActions,
  invitationSent,
  handleDismiss,
  contributorRoles,
  createContributorRole,
  allowInvitingAuthors,
}) => (
  <ModalBody>
    <AuthorsSidebar
      authors={authors}
      authorAffiliations={authorAffiliations}
      selectAuthor={selectAuthor}
      selectedAuthor={selectedAuthor}
      openAddAuthors={openAddAuthors}
      handleDrop={handleDrop}
      getSidebarItemDecorator={getSidebarItemDecorator}
      invitationSent={invitationSent}
      handleDismiss={handleDismiss}
    />
    <ScrollableModalMain>
      {selectedAuthor ? (
        <AuthorFormContainer
          author={selectedAuthor}
          affiliations={affiliations}
          authorAffiliations={
            authorAffiliations.get(selectedAuthor._id) as AuthorAffiliation[]
          }
          handleSave={handleSaveAuthor}
          addAuthorAffiliation={addAuthorAffiliation}
          removeAuthorAffiliation={removeAuthorAffiliation}
          updateAffiliation={updateAffiliation}
          isRemoveAuthorOpen={isRemoveAuthorOpen}
          handleRemoveAuthor={handleRemoveAuthor}
          removeAuthor={removeAuthor}
          isRejected={isRejected}
          project={project}
          updateAuthor={updateAuthor}
          getAuthorName={getAuthorName}
          tokenActions={tokenActions}
          contributorRoles={contributorRoles}
          createContributorRole={createContributorRole}
          allowInvitingAuthors={allowInvitingAuthors}
        />
      ) : (
        <AuthorDetailsPage />
      )}
    </ScrollableModalMain>
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
    <StyledModalMain>
      <AddAuthorsPage addedAuthorsCount={numberOfAddedAuthors} />
    </StyledModalMain>
  </ModalBody>
)

interface InviteAuthorsProps {
  project: Project
  invitationValues: InvitationValues
  handleInviteCancel: () => void
  handleInvitationSubmit: (values: InvitationValues) => Promise<void>
  invitationSent: boolean
  tokenActions: TokenActions
}

export const InviteAuthorsModal: React.FunctionComponent<InviteAuthorsProps> = ({
  invitationValues,
  handleInviteCancel,
  handleInvitationSubmit,
  invitationSent,
}) => {
  const [tokenActions] = useStore((store) => store.tokenActions)
  return (
    <ModalBody>
      <InviteCollaboratorsSidebar
        invitationValues={invitationValues}
        handleCancel={handleInviteCancel}
        handleSubmit={handleInvitationSubmit}
        invitationSent={invitationSent}
        isModal={true}
        tokenActions={tokenActions}
      />
      <StyledModalMain>
        <InviteCollaboratorsModal />
      </StyledModalMain>
    </ModalBody>
  )
}
