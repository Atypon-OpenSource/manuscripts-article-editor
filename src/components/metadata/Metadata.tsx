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

import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import {
  Affiliation,
  ContainerInvitation,
  Contributor,
  Manuscript,
  Model,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  AffiliationsList,
  AuthorAffiliation,
  AuthorsList,
  AuthorValues,
  CloseButton,
  IconButton,
  ModalContainer,
  ModalHeader,
  StyledModal,
} from '@manuscripts/style-guide'
import { TitleEditorView } from '@manuscripts/title-editor'
import React from 'react'
import { TokenActions } from '../../data/TokenData'
import { AffiliationMap } from '../../lib/authors'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import { Permissions } from '../../types/permissions'
import { InvitationValues } from '../collaboration/InvitationForm'
import { AddAuthorsModalContainer } from './AddAuthorsModalContainer'
import AuthorsModalContainer from './AuthorsModalContainer'
import { InviteAuthorsModal } from './AuthorsModals'
import { Header, HeaderContainer } from './Header'
import { TitleFieldContainer } from './TitleFieldContainer'

const StyledHeader = styled(Header)`
  font-family: 'PT Sans';
  font-size: ${props => props.theme.font.size.medium};
  line-height: ${props => props.theme.font.lineHeight.large};
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const AuthorsContainer = styled.div`
  margin-top: ${props => props.theme.grid.unit * 4}px;
`

export const ExpanderButton = styled(IconButton).attrs(props => ({
  size: 20,
}))`
  border: none;
  border-radius: 50%;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${props => props.theme.colors.background.fifth};
    }
  }

  svg circle {
    stroke: ${props => props.theme.colors.border.secondary};
  }
`

interface Props {
  modelMap: Map<string, Model>
  saveTitle: (title: string) => void
  manuscript: Manuscript
  authors: Contributor[]
  invitations: ContainerInvitation[]
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
  removeAuthor: (data: Contributor) => Promise<void>
  selectAuthor: (data: Contributor) => void
  selectedAuthor: Contributor | null
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  addAuthorAffiliation: (affiliation: Affiliation | string) => void
  removeAuthorAffiliation: (affiliation: Affiliation) => void
  updateAffiliation: (affiliation: Affiliation) => void
  expanded: boolean
  toggleExpanded: () => void
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  addedAuthors: string[]
  project: Project
  user: UserProfile
  isInvite: boolean
  invitationValues: InvitationValues
  invitationSent: boolean
  openAddAuthors: () => void
  handleAddingDoneCancel: () => void
  handleInvite: (searchText: string) => void
  handleInviteCancel: () => void
  handleInvitationSubmit: (values: InvitationValues) => Promise<void>
  handleDrop: (oldIndex: number, newIndex: number) => void
  updateAuthor: (author: Contributor, email: string) => void
  handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void
  permissions: Permissions
  tokenActions: TokenActions
}

const expanderStyle = (expanded: boolean) => ({
  transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
})

const authorsModal = (props: Props) => {
  if (props.isInvite) {
    return <InviteAuthorsModal {...props} />
  }

  return props.addingAuthors ? (
    <AddAuthorsModalContainer {...props} />
  ) : (
    <AuthorsModalContainer {...props} />
  )
}

export const Metadata: React.FunctionComponent<Props> = props => (
  <HeaderContainer>
    <StyledHeader>
      <TitleContainer>
        <TitleFieldContainer
          title={props.manuscript.title || ''}
          handleChange={props.saveTitle}
          handleStateChange={props.handleTitleStateChange}
          editable={props.permissions.write}
        />
        <ExpanderButton
          aria-label={'Toggle expand authors'}
          onClick={props.toggleExpanded}
          style={expanderStyle(props.expanded)}
          data-cy={'expander-button'}
        >
          <ArrowDownBlue />
        </ExpanderButton>
      </TitleContainer>

      {props.expanded && (
        <AuthorsContainer data-cy={'author-container'}>
          <AuthorsList
            authors={props.authors}
            authorAffiliations={props.authorAffiliations}
            startEditing={props.startEditing}
            showEditButton={isOwner(props.project, props.user.userID)}
            selectAuthor={props.selectAuthor}
          />

          <AffiliationsList affiliations={props.affiliations} />
        </AuthorsContainer>
      )}

      <StyledModal
        isOpen={props.editing}
        onRequestClose={props.stopEditing}
        shouldCloseOnOverlayClick={true}
      >
        <ModalContainer>
          <ModalHeader>
            <CloseButton
              onClick={props.stopEditing}
              data-cy={'modal-close-button'}
            />
          </ModalHeader>
          {authorsModal(props)}
        </ModalContainer>
      </StyledModal>
    </StyledHeader>
  </HeaderContainer>
)
