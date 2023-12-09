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
  Contributor,
  ContributorRole,
  Model,
  ObjectTypes,
  UserProfile,
} from '@manuscripts/json-schema'
import { AuthorAffiliation, AuthorValues } from '@manuscripts/style-guide'
import {
  Build,
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
  buildContributorRole,
} from '@manuscripts/transform'
import React from 'react'

import { AffiliationMap } from '../../lib/authors'
import { stripTracked } from '../track-changes/utils'
import { AuthorsModal } from './AuthorsModals'

interface State {
  isRemoveAuthorOpen: boolean
}

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  selectedAuthor: string | null
  removeAuthor: (data: Contributor) => Promise<void>
  selectAuthor: (data: Contributor) => void
  saveTrackModel: <T extends Model>(
    model: T | Build<T> | Partial<T>
  ) => Promise<T>
  handleDrop: (
    authors: Contributor[],
    oldIndex: number,
    newIndex: number
  ) => void
  createAuthor: (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => void
  contributorRoles: ContributorRole[]
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
      contributorRoles,
    } = this.props

    if (!this.getSelectedAuthor()) {
      console.log('No selected author')
    }

    return (
      <AuthorsModal
        authors={authors}
        authorAffiliations={authorAffiliations}
        affiliations={affiliations}
        selectedAuthor={this.getSelectedAuthor()}
        isRemoveAuthorOpen={isRemoveAuthorOpen}
        addAuthorAffiliation={this.addAuthorAffiliation}
        removeAuthorAffiliation={this.removeAuthorAffiliation}
        updateAffiliation={this.updateAffiliation}
        handleDrop={this.handleDrop}
        handleSaveAuthor={this.handleSaveAuthor}
        openAddAuthors={this.createEmptyAuthor}
        selectAuthor={selectAuthor}
        removeAuthor={this.removeAuthor}
        handleRemoveAuthor={this.handleRemoveAuthor}
        contributorRoles={contributorRoles}
        createContributorRole={this.createContributorRole}
      />
    )
  }

  private createContributorRole = async (
    name: string
  ): Promise<ContributorRole> => {
    const contributorRole = buildContributorRole(name)

    return this.props.saveTrackModel(contributorRole)
  }

  private handleRemoveAuthor = () =>
    this.setState({ isRemoveAuthorOpen: !this.state.isRemoveAuthorOpen })

  private removeAuthor = async (author: Contributor) => {
    await this.props.removeAuthor(author)

    this.handleRemoveAuthor()
  }

  private handleSaveAuthor = async (values: AuthorValues) => {
    await this.props.saveTrackModel<Contributor>({
      objectType: ObjectTypes.Contributor,
      ...values,
    })
  }

  private addAuthorAffiliation = async (affiliation: string) => {
    const selectedAuthor = this.getSelectedAuthor()
    if (!selectedAuthor) {
      return
    }

    let affiliationObj

    this.props.affiliations.forEach((aff) => {
      if (affiliation.startsWith(aff._id)) {
        affiliationObj = aff
      }
    })

    if (!affiliationObj) {
      affiliationObj = await this.props.saveTrackModel<Affiliation>(
        buildAffiliation(affiliation)
      )
    }

    const author = {
      ...selectedAuthor,
      affiliations: (selectedAuthor.affiliations || []).concat(
        affiliationObj._id
      ),
    }

    await this.props.saveTrackModel<Contributor>(author)
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

    await this.props.saveTrackModel<Contributor>(nextAuthor)
  }

  private updateAffiliation = async (affiliation: Affiliation) => {
    await this.props.saveTrackModel<Affiliation>(affiliation)
  }

  private getSelectedAuthor = () => {
    const sel =
      this.props.authors.find(
        (author) =>
          stripTracked(author._id) ===
          stripTracked(this.props.selectedAuthor || '')
      ) || null

    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx')
    // console.log(this.props.selectedAuthor)
    // console.log(this.props.authors)
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx')

    return sel
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

    const author: Contributor = await this.props.saveTrackModel<Contributor>(
      authorInfo
    )

    this.props.selectAuthor(author)
  }
}

export default AuthorsModalContainer
