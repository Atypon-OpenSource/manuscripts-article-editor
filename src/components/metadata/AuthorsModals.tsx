import {
  Affiliation,
  Contributor,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { AffiliationMap } from '../../lib/authors'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { styled, ThemedProps } from '../../theme'
import {
  AddAuthorsPage,
  AuthorDetailsPage,
  InviteCollaboratorsModal,
} from '../collaboration/CollaboratorsPage'
import { InvitationValues } from '../collaboration/InvitationForm'
import InviteCollaboratorsSidebar from '../collaboration/InviteCollaboratorsSidebar'
import AddAuthorsSidebar from './AddAuthorsSidebar'
import { AuthorAffiliation } from './Author'
import { AuthorForm, AuthorValues } from './AuthorForm'
import AuthorsSidebar from './AuthorsSidebar'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 #d8d8d8;
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
  isHovered: boolean
  project: Project
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  updateAuthor: (author: Contributor, email: string) => void
  openAddAuthors: () => void
  createAffiliation: (name: string) => Promise<Affiliation>
  checkInvitations: (author: Contributor) => boolean
  isRejected: (invitationID: string) => boolean
  getAuthorName: (author: Contributor) => string
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  handleHover: () => void
  handleRemoveAuthor: () => void
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
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
  checkInvitations,
  isRemoveAuthorOpen,
  handleRemoveAuthor,
  isRejected,
  handleHover,
  isHovered,
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
        checkInvitations={checkInvitations}
        handleHover={handleHover}
        isHovered={isHovered}
      />
    </ModalSidebar>
    <ModalMain>
      {selectedAuthor ? (
        <AuthorForm
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
}

export const InviteAuthorsModal: React.FunctionComponent<
  InviteAuthorsProps
> = ({
  project,
  invitationValues,
  handleInviteCancel,
  handleInvitationSubmit,
}) => (
  <ModalBody>
    <ModalSidebar>
      <InviteCollaboratorsSidebar
        invitationValues={invitationValues}
        handleCancel={handleInviteCancel}
        handleSubmit={handleInvitationSubmit}
      />
    </ModalSidebar>
    <ModalMain>
      <InviteCollaboratorsModal project={project} />
    </ModalMain>
  </ModalBody>
)
