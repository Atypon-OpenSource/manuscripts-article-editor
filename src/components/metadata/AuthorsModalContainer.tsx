import {
  Affiliation,
  Contributor,
  Manuscript,
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { AffiliationMap } from '../../lib/authors'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { AuthorAffiliation } from './Author'
import { AuthorValues } from './AuthorForm'
import { AuthorsModal } from './AuthorsModals'

interface State {
  isRemoveAuthorOpen: boolean
}

interface Props {
  project: Project
  manuscript: Manuscript
  authors: Contributor[]
  invitations: ProjectInvitation[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  selectedAuthor: Contributor | null
  removeAuthor: (data: Contributor) => Promise<void>
  selectAuthor: (data: Contributor) => void
  updateAuthor: (author: Contributor, email: string) => void
  openAddAuthors: () => void
  createAffiliation: (name: string) => Promise<Affiliation>
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
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
      createAffiliation,
      handleDrop,
      handleSaveAuthor,
      openAddAuthors,
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
        checkInvitations={this.checkInvitations}
        createAffiliation={createAffiliation}
        handleDrop={handleDrop}
        handleSaveAuthor={handleSaveAuthor}
        openAddAuthors={openAddAuthors}
        selectAuthor={selectAuthor}
        isRejected={this.isRejected}
        removeAuthor={this.removeAuthor}
        getAuthorName={this.getAuthorName}
        handleRemoveAuthor={this.handleRemoveAuthor}
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

  private checkInvitations = (author: Contributor) => {
    for (const invitation of this.props.invitations) {
      if (invitation._id === author.invitationID) {
        return !invitation.acceptedAt
      }
    }
    return false
  }
}

export default AuthorsModalContainer
