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
  ContainerInvitation,
  Contributor,
  UserProfile,
} from '@manuscripts/json-schema'
import {
  AuthorsContainer,
  CloseButton,
  IconButton,
  ModalContainer,
  ModalHeader,
  StyledModal,
} from '@manuscripts/style-guide'
import { TitleEditorView } from '@manuscripts/title-editor'
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { useStore } from '../../store'
import { AddAuthorsModalContainer } from './AddAuthorsModalContainer'
import { InvitationValues } from './AuthorInvitationForm'
import AuthorsModalContainer from './AuthorsModalContainer'
import { InviteAuthorsModal } from './AuthorsModals'

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

export const ExpanderButton = styled(IconButton).attrs(() => ({
  size: 20,
  defaultColor: true,
}))`
  border: none;
  border-radius: 50%;

  &:focus,
  &:hover {
    &:not([disabled]) {
      background: ${(props) => props.theme.colors.background.fifth};
    }
  }

  svg circle {
    stroke: ${(props) => props.theme.colors.border.secondary};
  }
`

const HeaderContainer = styled.header`
  padding: 0 64px;
`

const Header = styled.div`
  font-family: 'PT Sans';
  font-size: ${(props) => props.theme.font.size.medium};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.primary};

  ${ExpanderButton} {
    display: none;
  }

  &:hover ${ExpanderButton} {
    display: initial;
  }
`

interface Props {
  saveTitle: (title: string) => void
  invitations: ContainerInvitation[]
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
  selectedAuthor: string | null
  expanded: boolean
  toggleExpanded: () => void
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  addedAuthors: string[]
  isInvite: boolean
  invitationValues: InvitationValues
  invitationSent: boolean
  handleAddingDoneCancel: () => void
  handleInvite: (searchText: string) => void
  handleInviteCancel: () => void
  handleInvitationSubmit: (
    authors: Contributor[],
    values: InvitationValues
  ) => Promise<void>
  handleDrop: (
    authors: Contributor[],
    oldIndex: number,
    newIndex: number
  ) => void
  updateAuthor: (author: Contributor, email: string) => void
  handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void
  allowInvitingAuthors: boolean
  showAuthorEditButton: boolean
  disableEditButton?: boolean
}

const expanderStyle = (expanded: boolean) => ({
  transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
})

export const Metadata: React.FunctionComponent<Props> = (props) => {
  const [
    {
      manuscript,
      authorsAndAffiliations,
      contributorRoles,
      tokenActions,
      project,
      saveModel,
    },
  ] = useStore((store) => {
    return {
      manuscript: store.manuscript,
      authorsAndAffiliations: store.authorsAndAffiliations,
      contributorRoles: store.contributorRoles,
      saveModel: store.saveModel,
      project: store.project,
      tokenActions: store.tokenActions,
      doc: store.doc,
    }
  })

  const handleInvitationSubmit = useCallback(
    (values: InvitationValues) => {
      if (!authorsAndAffiliations) {
        return Promise.reject()
      }
      return props.handleInvitationSubmit(
        authorsAndAffiliations.authors,
        values
      )
    },
    [authorsAndAffiliations, props]
  )

  if (!authorsAndAffiliations || !contributorRoles) {
    return null
  }

  return (
    <HeaderContainer>
      <Header>
        <TitleContainer>
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
          <AuthorsContainer
            authorData={authorsAndAffiliations}
            startEditing={props.startEditing}
            showEditButton={props.showAuthorEditButton}
            disableEditButton={props.disableEditButton}
            selectAuthor={props.selectAuthor}
          />
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
            {props.isInvite ? (
              <InviteAuthorsModal
                {...props}
                handleInvitationSubmit={handleInvitationSubmit}
              />
            ) : props.addingAuthors ? (
              <AddAuthorsModalContainer
                {...props}
                authors={authorsAndAffiliations.authors}
              />
            ) : (
              <AuthorsModalContainer
                {...props}
                saveModel={saveModel}
                authors={authorsAndAffiliations.authors}
                authorAffiliations={authorsAndAffiliations.authorAffiliations}
                affiliations={authorsAndAffiliations.affiliations}
                project={project}
                manuscript={manuscript}
                tokenActions={tokenActions}
                contributorRoles={contributorRoles}
                allowInvitingAuthors={props.allowInvitingAuthors}
              />
            )}
          </ModalContainer>
        </StyledModal>
      </Header>
    </HeaderContainer>
  )
}
