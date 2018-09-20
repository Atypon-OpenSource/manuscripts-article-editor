import { FormikActions } from 'formik'
import React from 'react'
import AddAuthorsSidebar from '../../components/AddAuthorsSidebar'
import {
  AddAuthorsPage,
  InviteCollaboratorsModal,
} from '../../components/CollaboratorsPage'
import { InvitationValues } from '../../components/InvitationForm'
import InviteCollaboratorsSidebar from '../../components/InviteCollaboratorsSidebar'
import {} from '../../components/SimpleModal'
import { styled, ThemedProps } from '../../theme'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Project,
  UserProfile,
} from '../../types/components'
import { AuthorAffiliation } from './Author'
import { AuthorForm, AuthorValues } from './AuthorForm'
import AuthorsSidebar from './AuthorsSidebar'
import { AffiliationMap } from './lib/authors'
import { AuthorItem, DropSide } from './lib/drag-drop'

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
  isRemovePopperOpen: boolean
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  startAddingAuthors: () => void
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
  checkInvitations: (author: Contributor) => boolean
  handleRemovePopperOpen: () => void
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
}

export const AuthorsModal: React.SFC<AuthorsProps> = ({
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
  isRemovePopperOpen,
  handleRemovePopperOpen,
}) => (
  <ModalBody>
    <ModalSidebar>
      <AuthorsSidebar
        authors={authors}
        authorAffiliations={authorAffiliations}
        removeAuthor={removeAuthor}
        selectAuthor={selectAuthor}
        selectedAuthor={selectedAuthor}
        startAdding={startAddingAuthors}
        handleDrop={handleDrop}
        checkInvitations={checkInvitations}
        isRemovePopperOpen={isRemovePopperOpen}
        handleRemovePopperOpen={handleRemovePopperOpen}
      />
    </ModalSidebar>
    <ModalMain>
      {selectedAuthor && (
        <AuthorForm
          manuscript={manuscript.id}
          author={selectedAuthor}
          affiliations={affiliations}
          authorAffiliations={
            authorAffiliations.get(selectedAuthor.id) as AuthorAffiliation[]
          }
          handleSave={handleSaveAuthor}
          createAffiliation={createAffiliation}
        />
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
}

export const AddAuthorsModal: React.SFC<AddAuthorsProps> = ({
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
  handleInviteCancel: () => void
  handleInvitationSubmit: (
    values: InvitationValues,
    formikActions: FormikActions<InvitationValues>
  ) => void
}

export const InviteAuthorsModal: React.SFC<InviteAuthorsProps> = ({
  project,
  invitationValues,
  handleInviteCancel,
  handleInvitationSubmit,
}) => (
  <ModalBody>
    <ModalSidebar>
      <InviteCollaboratorsSidebar
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
