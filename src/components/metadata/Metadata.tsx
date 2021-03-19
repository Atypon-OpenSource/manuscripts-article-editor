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
import { Build } from '@manuscripts/manuscript-transform'
import {
  ContainerInvitation,
  Contributor,
  Manuscript,
  Model,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { RxAttachment, RxAttachmentCreator } from '@manuscripts/rxdb'
import {
  AffiliationsList,
  AuthorsList,
  CloseButton,
  IconButton,
  ModalContainer,
  ModalHeader,
  StyledModal,
} from '@manuscripts/style-guide'
import { TitleEditorView } from '@manuscripts/title-editor'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { TokenActions } from '../../data/TokenData'
import { useAuthorsAndAffiliations } from '../../hooks/use-authors-and-affiliations'
import { useContributorRoles } from '../../hooks/use-contributor-roles'
import { isOwner } from '../../lib/roles'
import { Permissions } from '../../types/permissions'
import { InvitationValues } from '../collaboration/InvitationForm'
import { AddAuthorsModalContainer } from './AddAuthorsModalContainer'
import AuthorsModalContainer from './AuthorsModalContainer'
import { InviteAuthorsModal } from './AuthorsModals'
import { HeaderFigure } from './HeaderFigure'
import { TitleFieldContainer } from './TitleFieldContainer'

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const AuthorsContainer = styled.div`
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
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
  manuscript: Manuscript
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
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
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
  openAddAuthors: (authors: Contributor[]) => void
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
  permissions: Permissions
  tokenActions: TokenActions
  getAttachment: (id: string, attachmentID: string) => Promise<Blob | undefined>
  putAttachment: (
    id: string,
    attachment: RxAttachmentCreator
  ) => Promise<RxAttachment<Model>>
}

const expanderStyle = (expanded: boolean) => ({
  transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
})

export const Metadata: React.FunctionComponent<Props> = (props) => {
  const { data: authorsAndAffiliations } = useAuthorsAndAffiliations(
    props.manuscript.containerID,
    props.manuscript._id
  )

  const { data: contributorRoles } = useContributorRoles(
    props.manuscript.containerID,
    props.manuscript._id
  )

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

  const openAddAuthors = useCallback(() => {
    if (!authorsAndAffiliations) {
      return
    }
    props.openAddAuthors(authorsAndAffiliations.authors)
  }, [authorsAndAffiliations, props])

  const isThereJointContributor = useMemo(
    () =>
      authorsAndAffiliations?.authors.find(
        (contributor) => contributor.isJointContributor
      ),
    [authorsAndAffiliations]
  )

  if (!authorsAndAffiliations || !contributorRoles) {
    return null
  }

  return (
    <HeaderContainer>
      <Header>
        <HeaderFigure
          getAttachment={props.getAttachment}
          putAttachment={props.putAttachment}
          saveModel={props.saveModel}
          manuscript={props.manuscript}
        />

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
              authors={authorsAndAffiliations.authors.filter(
                (author) => author.role === 'author'
              )}
              authorAffiliations={authorsAndAffiliations.authorAffiliations}
              startEditing={props.startEditing}
              showEditButton={isOwner(props.project, props.user.userID)}
              selectAuthor={props.selectAuthor}
            />

            <AffiliationsList
              affiliations={authorsAndAffiliations.affiliations}
            />
            {isThereJointContributor && (
              <LegendWrapper>
                <Legend>†</Legend>
                These authors contributed equally to this work.
              </LegendWrapper>
            )}
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
                authors={authorsAndAffiliations.authors}
                authorAffiliations={authorsAndAffiliations.authorAffiliations}
                affiliations={authorsAndAffiliations.affiliations}
                openAddAuthors={openAddAuthors}
                contributorRoles={contributorRoles}
              />
            )}
          </ModalContainer>
        </StyledModal>
      </Header>
    </HeaderContainer>
  )
}

const LegendWrapper = styled.p`
  margin: ${(props) => props.theme.grid.unit * 4}px 0 0 0;
`

const Legend = styled.span`
  display: inline-block;
  font-size: 0.75em;
  line-height: 1;
  vertical-align: top;
`
