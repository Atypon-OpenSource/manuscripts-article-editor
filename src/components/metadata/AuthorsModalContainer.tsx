/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Affiliation,
  Contributor,
  Manuscript,
  Project,
  ProjectInvitation,
} from '@manuscripts/manuscripts-json-schema'
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide'
import React from 'react'
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
  invitations: ProjectInvitation[]
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
      invitation => author.invitationID === invitation._id
    ) ? (
      <Invited>Invited</Invited>
    ) : null
  }
}

export default AuthorsModalContainer
