import {
  Affiliation,
  Contributor,
  Manuscript,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { FormikActions } from 'formik'
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
  manuscript: Manuscript
  affiliations: AffiliationMap
  selectedAuthor: Contributor | null
  removeAuthorIsOpen: boolean
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  startAddingAuthors: () => void
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
  checkInvitations: (author: Contributor) => boolean
  handleRemoveAuthor: () => void
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
  isRejected: (invitationID: string) => boolean
  handleHover: () => void
  hovered: boolean
  project: Project
  updateAuthor: (author: Contributor, email: string) => void
  getAuthorName: (author: Contributor) => string
}

export const AuthorsModal: React.FunctionComponent<AuthorsProps> = ({
  authors,
  authorAffiliations,
  manuscript,
  affiliations,
  removeAuthor,
  selectAuthor,
  selectedAuthor,
  startAddingAuthors,
  handleSaveAuthor,
  createAffiliation,
  handleDrop,
  checkInvitations,
  removeAuthorIsOpen,
  handleRemoveAuthor,
  isRejected,
  handleHover,
  hovered,
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
        startAdding={startAddingAuthors}
        handleDrop={handleDrop}
        checkInvitations={checkInvitations}
        handleHover={handleHover}
        hovered={hovered}
      />
    </ModalSidebar>
    <ModalMain>
      {selectedAuthor ? (
        <AuthorForm
          manuscript={manuscript._id}
          author={selectedAuthor}
          affiliations={affiliations}
          authorAffiliations={
            authorAffiliations.get(selectedAuthor._id) as AuthorAffiliation[]
          }
          handleSave={handleSaveAuthor}
          createAffiliation={createAffiliation}
          removeAuthorIsOpen={removeAuthorIsOpen}
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
  addedAuthorsCount: number
  searchingAuthors: boolean
  searchText: string
  addedAuthors: string[]
  searchResults: UserProfile[]
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
  handleAddingDoneCancel: () => void
  handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleSearchFocus: () => void
  handleInvite: () => void
  authorExist: () => boolean
  handleCreateAuthor: () => void
  createAuthorIsOpen: boolean
}

export const AddAuthorsModal: React.FunctionComponent<AddAuthorsProps> = ({
  nonAuthors,
  authors,
  addedAuthors,
  addedAuthorsCount,
  searchingAuthors,
  searchResults,
  searchText,
  createAuthor,
  handleAddingDoneCancel,
  handleSearchChange,
  handleSearchFocus,
  handleInvite,
  authorExist,
  createAuthorIsOpen,
  handleCreateAuthor,
}) => (
  <ModalBody>
    <ModalSidebar>
      <AddAuthorsSidebar
        nonAuthors={nonAuthors}
        authors={authors}
        numberOfAddedAuthors={addedAuthorsCount}
        isSearching={searchingAuthors}
        searchText={searchText}
        addedAuthors={addedAuthors}
        handleDoneCancel={handleAddingDoneCancel}
        createAuthor={createAuthor}
        handleSearchChange={handleSearchChange}
        handleSearchFocus={handleSearchFocus}
        searchResults={searchResults}
        handleInvite={handleInvite}
        authorExist={authorExist}
        createAuthorIsOpen={createAuthorIsOpen}
        handleCreateAuthor={handleCreateAuthor}
      />
    </ModalSidebar>
    <ModalMain>
      <AddAuthorsPage addedAuthorsCount={addedAuthorsCount} />
    </ModalMain>
  </ModalBody>
)

interface InviteAuthorsProps {
  project: Project
  invitationValues: InvitationValues
  invitationSent: boolean
  handleInviteCancel: () => void
  handleInvitationSubmit: (
    values: InvitationValues,
    formikActions: FormikActions<InvitationValues>
  ) => void
}

export const InviteAuthorsModal: React.FunctionComponent<
  InviteAuthorsProps
> = ({
  project,
  invitationValues,
  invitationSent,
  handleInviteCancel,
  handleInvitationSubmit,
}) => (
  <ModalBody>
    <ModalSidebar>
      <InviteCollaboratorsSidebar
        invitationSent={invitationSent}
        initialValues={invitationValues}
        handleCancel={handleInviteCancel}
        onSubmit={handleInvitationSubmit}
      />
    </ModalSidebar>
    <ModalMain>
      <InviteCollaboratorsModal project={project} />
    </ModalMain>
  </ModalBody>
)
