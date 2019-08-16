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
  ContainerInvitation,
  Contributor,
  Manuscript,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide'
import React from 'react'
import { TokenActions } from '../../data/TokenData'
import { AffiliationMap } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import { AuthorsModal } from './AuthorsModals'

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: ${props => props.theme.colors.sidebar.label};
`

interface State {
  isRemoveAuthorOpen: boolean
}

interface Props {
  project: Project
  manuscript: Manuscript
  authors: Contributor[]
  invitations: ContainerInvitation[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  selectedAuthor: Contributor | null
  removeAuthor: (data: Contributor) => Promise<void>
  selectAuthor: (data: Contributor) => void
  updateAuthor: (author: Contributor, email: string) => void
  openAddAuthors: () => void
  addAuthorAffiliation: (affiliation: Affiliation | string) => void
  removeAuthorAffiliation: (affiliation: Affiliation) => void
  updateAffiliation: (affiliation: Affiliation) => void
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  handleDrop: (oldIndex: number, newIndex: number) => void
  tokenActions: TokenActions
}

class AuthorsModalContainer extends React.Component<Props, State> {
  public state = {
    isRemoveAuthorOpen: false,
  }

  public render() {
    const { isRemoveAuthorOpen } = this.state
    const {
      authors,
      authorAffiliations,
      affiliations,
      selectAuthor,
      selectedAuthor,
      project,
      updateAuthor,
      addAuthorAffiliation,
      removeAuthorAffiliation,
      updateAffiliation,
      handleDrop,
      handleSaveAuthor,
      openAddAuthors,
      tokenActions,
    } = this.props

    return (
      <AuthorsModal
        project={project}
        authors={authors}
        authorAffiliations={authorAffiliations}
        affiliations={affiliations}
        selectedAuthor={selectedAuthor}
        isRemoveAuthorOpen={isRemoveAuthorOpen}
        updateAuthor={updateAuthor}
        addAuthorAffiliation={addAuthorAffiliation}
        removeAuthorAffiliation={removeAuthorAffiliation}
        updateAffiliation={updateAffiliation}
        getSidebarItemDecorator={this.getSidebarItemDecorator}
        handleDrop={handleDrop}
        handleSaveAuthor={handleSaveAuthor}
        openAddAuthors={openAddAuthors}
        selectAuthor={selectAuthor}
        isRejected={this.isRejected}
        removeAuthor={this.removeAuthor}
        getAuthorName={this.getAuthorName}
        handleRemoveAuthor={this.handleRemoveAuthor}
        tokenActions={tokenActions}
      />
    )
  }

  private handleRemoveAuthor = () =>
    this.setState({ isRemoveAuthorOpen: !this.state.isRemoveAuthorOpen })

  private removeAuthor = async (author: Contributor) => {
    await this.props.removeAuthor(author)

    this.handleRemoveAuthor()
  }

  private getAuthorName = (author: Contributor) => {
    const name = !author.bibliographicName.given
      ? 'Author '
      : author.bibliographicName.given + ' ' + author.bibliographicName.family
    return name
  }

  private isRejected = (invitationID: string) => {
    for (const invitation of this.props.invitations) {
      if (invitation._id === invitationID) {
        return false
      }
    }

    return true
  }

  private getSidebarItemDecorator = (authorID: string) => {
    const { invitations } = this.props
    if (!invitations) return null

    const author = this.props.authors.find(author => author._id === authorID)
    if (!author) return null

    return invitations.find(
      invitation =>
        author.invitationID === invitation._id && !invitation.acceptedAt
    ) ? (
      <Invited>Invited</Invited>
    ) : null
  }
}

export default AuthorsModalContainer
