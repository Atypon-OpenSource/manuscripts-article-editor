import {
  Affiliation,
  Contributor,
  Manuscript,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { TitleField } from '@manuscripts/title-editor'
import { FormikActions } from 'formik'
import React from 'react'
import Close from '../../icons/close'
import Expander from '../../icons/expander'
import { AffiliationMap } from '../../lib/authors'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { isOwner } from '../../lib/roles'
import { styled, ThemedProps } from '../../theme'
import { InvitationValues } from '../collaboration/InvitationForm'
import { CloseButton } from '../SimpleModal'
import { StyledModal, totalTransitionTime } from '../StyledModal'
import { Affiliations } from './Affiliations'
import { AuthorAffiliation } from './Author'
import { AuthorValues } from './AuthorForm'
import Authors from './Authors'
import {
  AddAuthorsModal,
  AuthorsModal,
  InviteAuthorsModal,
} from './AuthorsModals'
import { Header, HeaderContainer } from './Header'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  width: 800px;
  max-width: 100%;
  margin: auto;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 8px;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const AuthorsContainer = styled.div`
  margin-top: 16px;
`

const ExpanderButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const StyledTitleField = styled(TitleField)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.3;

    &:focus {
      outline: none;
    }

    &.empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Manuscript';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: #999;
    }
  }
`

interface Props {
  saveTitle: (title: string) => void
  manuscript: Manuscript
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  startEditing: () => void
  editing: boolean
  stopEditing: () => void
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  selectedAuthor: Contributor | null
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
  expanded: boolean
  toggleExpanded: () => void
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  addedAuthorsCount: number
  searchingAuthors: boolean
  searchText: string
  addedAuthors: string[]
  searchResults: UserProfile[]
  project: Project
  user: UserProfile
  isInvite: boolean
  invitationValues: InvitationValues
  invitationSent: boolean
  startAddingAuthors: () => void
  checkInvitations: (author: Contributor) => boolean
  handleAddingDoneCancel: () => void
  handleSearchChange: (event: React.FormEvent<HTMLInputElement>) => void
  handleSearchFocus: () => void
  handleInvite: () => void
  handleInviteCancel: () => void
  handleInvitationSubmit: (
    values: InvitationValues,
    formikActions: FormikActions<InvitationValues>
  ) => void
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
  handleSectionChange: (section: string) => void
  removeAuthorIsOpen: boolean
  handleRemoveAuthor: () => void
  authorExist: () => boolean
  handleCreateAuthor: () => void
  createAuthorIsOpen: boolean
  isRejected: (invitationID: string) => boolean
  handleHover: () => void
  hovered: boolean
  updateAuthor: (author: Contributor, email: string) => void
  getAuthorName: (author: Contributor) => string
}

export const Metadata: React.SFC<Props> = props => (
  <HeaderContainer>
    <Header>
      <TitleContainer>
        <StyledTitleField
          id={'manuscript-title-field'}
          value={props.manuscript.title}
          autoFocus={!props.manuscript.title}
          handleChange={props.saveTitle}
          handleFocus={() => {
            props.handleSectionChange('title')
            return false
          }}
          tabIndex={1}
        />
        <ExpanderButton
          onClick={props.toggleExpanded}
          style={{
            transform: props.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <Expander />
        </ExpanderButton>
      </TitleContainer>

      {props.expanded && (
        <AuthorsContainer>
          <Authors
            authors={props.authors}
            authorAffiliations={props.authorAffiliations}
            startEditing={props.startEditing}
            showEditButton={isOwner(props.project, props.user.userID)}
            selectAuthor={props.selectAuthor}
          />

          <Affiliations affiliations={props.affiliations} />
        </AuthorsContainer>
      )}

      <StyledModal
        isOpen={props.editing}
        onRequestClose={props.stopEditing}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={totalTransitionTime}
      >
        <ModalContainer>
          <ModalHeader>
            <CloseButton onClick={props.stopEditing}>
              <Close size={24} />
            </CloseButton>
          </ModalHeader>

          {!props.isInvite &&
            !props.addingAuthors && <AuthorsModal {...props} />}

          {!props.isInvite &&
            props.addingAuthors && <AddAuthorsModal {...props} />}

          {props.isInvite && <InviteAuthorsModal {...props} />}
        </ModalContainer>
      </StyledModal>
    </Header>
  </HeaderContainer>
)
