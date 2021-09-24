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
  Build,
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
  buildContributorRole,
} from '@manuscripts/manuscript-transform'
import {
  Affiliation,
  ContainerInvitation,
  Contributor,
  ContributorRole,
  Manuscript,
  Model,
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import config from '../../config'
import { TokenActions } from '../../data/TokenData'
import { AffiliationMap } from '../../lib/authors'
import { AuthorsModal } from './AuthorsModals'

const Invited = styled.div`
  display: flex;
  font-size: ${(props) => props.theme.font.size.small};
  color: ${(props) => props.theme.colors.brand.default};
`

interface State {
  isRemoveAuthorOpen: boolean
  invitationSent: boolean
}

interface Props {
  project: Project
  manuscript: Manuscript
  authors: Contributor[]
  invitations: ContainerInvitation[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  selectedAuthor: string | null
  removeAuthor: (data: Contributor) => Promise<void>
  updateAuthor: (author: Contributor, email: string) => void
  selectAuthor: (data: Contributor) => void
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  openAddAuthors: () => void
  handleDrop: (
    authors: Contributor[],
    oldIndex: number,
    newIndex: number
  ) => void
  tokenActions: TokenActions
  invitationSent: boolean
  createAuthor: (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => void
  contributorRoles: ContributorRole[]
  allowInvitingAuthors?: boolean
}

class AuthorsModalContainer extends React.Component<Props, State> {
  public state = {
    isRemoveAuthorOpen: false,
    invitationSent: false,
  }

  public componentDidMount() {
    this.setState({
      invitationSent: this.props.invitationSent,
    })
  }
  public render() {
    const { isRemoveAuthorOpen } = this.state
    const {
      authors,
      authorAffiliations,
      affiliations,
      selectAuthor,
      project,
      openAddAuthors,
      tokenActions,
      updateAuthor,
      contributorRoles,
      allowInvitingAuthors,
    } = this.props

    return (
      <AuthorsModal
        project={project}
        authors={authors}
        authorAffiliations={authorAffiliations}
        affiliations={affiliations}
        selectedAuthor={this.getSelectedAuthor()}
        isRemoveAuthorOpen={isRemoveAuthorOpen}
        updateAuthor={updateAuthor}
        addAuthorAffiliation={this.addAuthorAffiliation}
        removeAuthorAffiliation={this.removeAuthorAffiliation}
        updateAffiliation={this.updateAffiliation}
        getSidebarItemDecorator={this.getSidebarItemDecorator}
        handleDrop={this.handleDrop}
        handleSaveAuthor={this.handleSaveAuthor}
        openAddAuthors={config.local ? this.createEmptyAuthor : openAddAuthors}
        selectAuthor={selectAuthor}
        isRejected={this.isRejected}
        removeAuthor={this.removeAuthor}
        getAuthorName={this.getAuthorName}
        handleRemoveAuthor={this.handleRemoveAuthor}
        tokenActions={tokenActions}
        invitationSent={this.state.invitationSent}
        handleDismiss={this.handleDismiss}
        contributorRoles={contributorRoles}
        createContributorRole={this.createContributorRole}
        allowInvitingAuthors={!!allowInvitingAuthors}
      />
    )
  }

  private createContributorRole = async (
    name: string
  ): Promise<ContributorRole> => {
    const contributorRole = buildContributorRole(name)

    return this.props.saveModel(contributorRole)
  }

  private handleRemoveAuthor = () =>
    this.setState({ isRemoveAuthorOpen: !this.state.isRemoveAuthorOpen })

  private handleDismiss = () => this.setState({ invitationSent: false })

  private removeAuthor = async (author: Contributor) => {
    await this.props.removeAuthor(author)

    this.handleRemoveAuthor()
  }

  private getAuthorName = (author: Contributor) => {
    return !author.bibliographicName.given
      ? 'Author '
      : author.bibliographicName.given + ' ' + author.bibliographicName.family
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
    if (!invitations) {
      return null
    }

    const author = this.props.authors.find((author) => author._id === authorID)
    if (!author) {
      return null
    }

    return invitations.find(
      (invitation) =>
        author.invitationID === invitation._id && !invitation.acceptedAt
    ) ? (
      <Invited>Invited</Invited>
    ) : null
  }

  private handleSaveAuthor = async (values: AuthorValues) => {
    await this.props.saveModel<Contributor>({
      objectType: ObjectTypes.Contributor,
      ...values,
    })
  }

  private addAuthorAffiliation = async (affiliation: Affiliation | string) => {
    const selectedAuthor = this.getSelectedAuthor()
    if (!selectedAuthor) {
      return
    }

    let affiliationObj
    if (typeof affiliation === 'string') {
      affiliationObj = await this.props.saveModel<Affiliation>(
        buildAffiliation(affiliation)
      )
    } else {
      affiliationObj = affiliation
    }

    const author = {
      ...selectedAuthor,
      affiliations: (selectedAuthor.affiliations || []).concat(
        affiliationObj._id
      ),
    }

    await this.props.saveModel<Contributor>(author)
  }

  private removeAuthorAffiliation = async (affiliation: Affiliation) => {
    const selectedAuthor = this.getSelectedAuthor()
    if (!selectedAuthor) {
      return
    }

    const nextAuthor = {
      ...selectedAuthor,
      affiliations: (selectedAuthor.affiliations || []).filter(
        (aff) => aff !== affiliation._id
      ),
    }

    await this.props.saveModel<Contributor>(nextAuthor)
  }

  private updateAffiliation = async (affiliation: Affiliation) => {
    await this.props.saveModel<Affiliation>(affiliation)
  }

  private getSelectedAuthor = () => {
    return (
      this.props.authors.find(
        (author) => author._id === this.props.selectedAuthor
      ) || null
    )
  }

  private handleDrop = (oldIndex: number, newIndex: number) => {
    this.props.handleDrop(this.props.authors, oldIndex, newIndex)
  }

  private createEmptyAuthor = async () => {
    const authorInfo = buildContributor(
      buildBibliographicName({ given: '', family: '' }),
      'author',
      this.props.authors.length + 1
    )

    const author: Contributor = await this.props.saveModel<Contributor>(
      authorInfo
    )

    this.props.selectAuthor(author)
  }
}

export default AuthorsModalContainer
