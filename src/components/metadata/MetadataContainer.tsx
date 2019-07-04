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
  Build,
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
} from '@manuscripts/manuscript-transform'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
  ObjectTypes,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { AuthorValues } from '@manuscripts/style-guide'
import { TitleEditorView } from '@manuscripts/title-editor'
import React from 'react'
import { RxCollection } from 'rxdb'
import CollaboratorsData from '../../data/CollaboratorsData'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import { projectInvite } from '../../lib/api'
import {
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
  reorderAuthors,
} from '../../lib/authors'
import {
  buildCollaboratorProfiles,
  buildCollaborators,
} from '../../lib/collaborators'
import { getCurrentUserId } from '../../lib/user'
import { Permissions } from '../../types/permissions'
import { InvitationValues } from '../collaboration/InvitationForm'
import { Metadata } from './Metadata'

interface Props {
  collection: RxCollection<Model>
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveManuscript?: (manuscript: Partial<Manuscript>) => Promise<void>
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void
  permissions: Permissions
  tokenActions: TokenActions
}

interface State {
  editing: boolean
  expanded: boolean
  selectedAuthor: Contributor | null
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  addedAuthors: string[]
  isInvite: boolean
  invitationValues: InvitationValues
  invitationSent: boolean
  authorListError?: string
}

class MetadataContainer extends React.PureComponent<Props, State> {
  public state: Readonly<State> = {
    editing: false,
    expanded: true,
    selectedAuthor: null,
    addingAuthors: false,
    nonAuthors: [],
    numberOfAddedAuthors: 0,
    addedAuthors: [],
    isInvite: false,
    invitationSent: false,
    invitationValues: {
      name: '',
      email: '',
      role: '',
    },
  }

  public render() {
    const {
      editing,
      selectedAuthor,
      addingAuthors,
      nonAuthors,
      expanded,
      numberOfAddedAuthors,
      addedAuthors,
      isInvite,
      invitationValues,
      invitationSent,
    } = this.state
    const {
      manuscript,
      modelMap,
      handleTitleStateChange,
      permissions,
      tokenActions,
    } = this.props

    const {
      affiliations,
      authors,
      authorAffiliations,
    } = buildAuthorsAndAffiliations(this.props.modelMap)

    // TODO: editable prop

    return (
      <CollaboratorsData>
        {collaborators => (
          <UserData userID={getCurrentUserId()!}>
            {user => (
              <ProjectData projectID={manuscript.containerID}>
                {project => (
                  <ProjectInvitationsData projectID={manuscript.containerID}>
                    {invitations => {
                      return (
                        <Metadata
                          modelMap={modelMap}
                          saveTitle={this.saveTitle}
                          authors={authors}
                          invitations={invitations}
                          editing={editing}
                          affiliations={affiliations}
                          startEditing={this.startEditing}
                          authorAffiliations={authorAffiliations}
                          selectAuthor={this.selectAuthor}
                          removeAuthor={this.removeAuthor}
                          createAuthor={this.createAuthor}
                          addAuthorAffiliation={this.addAuthorAffiliation}
                          removeAuthorAffiliation={this.removeAuthorAffiliation}
                          updateAffiliation={this.updateAffiliation}
                          handleSaveAuthor={this.handleSaveAuthor}
                          manuscript={manuscript}
                          selectedAuthor={selectedAuthor}
                          stopEditing={this.stopEditing}
                          toggleExpanded={this.toggleExpanded}
                          expanded={expanded}
                          project={project}
                          user={user}
                          addingAuthors={addingAuthors}
                          openAddAuthors={this.startAddingAuthors(
                            buildCollaborators(
                              project,
                              buildCollaboratorProfiles(collaborators, user)
                            ),
                            invitations
                          )}
                          numberOfAddedAuthors={numberOfAddedAuthors}
                          nonAuthors={nonAuthors}
                          addedAuthors={addedAuthors}
                          isInvite={isInvite}
                          invitationValues={invitationValues}
                          handleAddingDoneCancel={this.handleAddingDoneCancel}
                          handleInvite={this.handleInvite}
                          handleInviteCancel={this.handleInviteCancel}
                          handleInvitationSubmit={this.handleInvitationSubmit(
                            user,
                            invitations
                          )}
                          handleDrop={this.handleDrop}
                          updateAuthor={this.updateAuthor(user)}
                          invitationSent={invitationSent}
                          handleTitleStateChange={handleTitleStateChange}
                          permissions={permissions}
                          tokenActions={tokenActions}
                        />
                      )
                    }}
                  </ProjectInvitationsData>
                )}
              </ProjectData>
            )}
          </UserData>
        )}
      </CollaboratorsData>
    )
  }

  private updateAuthor = (invitingUser: UserProfile) => async (
    author: Contributor,
    invitedEmail: string
  ) => {
    const invitation = await this.getInvitation(invitingUser, invitedEmail)

    const updatedAuthor: Contributor = await this.props.saveModel({
      ...author,
      invitationID: invitation._id,
    })

    this.selectAuthor(updatedAuthor)
  }

  private toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  private startEditing = () => {
    this.setState({ editing: true })
  }

  private stopEditing = () => {
    this.setState({
      editing: false,
      selectedAuthor: null,
      addingAuthors: false,
      isInvite: false,
    })
  }

  private saveTitle = async (title: string) => {
    await this.props.saveManuscript!({
      _id: this.props.manuscript._id,
      title,
    })
  }

  private createAuthor = async (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => {
    if (name) {
      const [given, ...family] = name.split(' ')

      const bibName = buildBibliographicName({
        given,
        family: family.join(' '),
      })

      const author = invitationID
        ? buildContributor(bibName, 'author', priority, undefined, invitationID)
        : buildContributor(bibName, 'author', priority)

      await this.props.saveModel(author)

      this.setState({
        numberOfAddedAuthors: this.state.numberOfAddedAuthors + 1,
      })
    }

    if (person) {
      const author = buildContributor(
        person.bibliographicName,
        'author',
        priority,
        person.userID
      )

      const createdAuthor: Contributor = await this.props.saveModel(author)

      this.setState({
        addedAuthors: this.state.addedAuthors.concat(author.userID as string),
        numberOfAddedAuthors: this.state.numberOfAddedAuthors + 1,
      })

      this.selectAuthor(createdAuthor)
    }
  }

  private selectAuthor = (selectedAuthor: Contributor) => {
    // TODO: make this switch without deselecting
    this.setState({ selectedAuthor: null }, () => {
      this.setState({ selectedAuthor })
    })
  }

  private deselectAuthor = () => {
    this.setState({ selectedAuthor: null })
  }

  private removeAuthor = async (author: Contributor) => {
    await this.props.deleteModel(author._id)
    this.deselectAuthor()
    if (this.state.addedAuthors.includes(author.userID as string)) {
      const index = this.state.addedAuthors.indexOf(author.userID as string)
      this.state.addedAuthors.splice(index, 1)
    }
  }

  private startAddingAuthors = (
    collaborators: UserProfile[],
    invitations: ProjectInvitation[]
  ) => () => {
    this.setState({ addingAuthors: true })

    const authors = buildSortedAuthors(this.props.modelMap)
    this.buildNonAuthors(authors, collaborators, invitations)
  }

  private handleAddingDoneCancel = () =>
    this.setState({ numberOfAddedAuthors: 0, addingAuthors: false })

  private handleInvite = (searchText: string) => {
    const invitationValues = {
      name: '',
      email: '',
      role: 'Writer',
    }

    if (searchText.includes('@')) {
      invitationValues.email = searchText
    } else {
      invitationValues.name = searchText
    }

    this.setState({ invitationValues, isInvite: true })
  }

  private handleInviteCancel = () =>
    this.setState({ isInvite: false, invitationSent: false })

  private handleInvitationSubmit = (
    invitingUser: UserProfile,
    invitations: ProjectInvitation[]
  ) => async (values: InvitationValues): Promise<void> => {
    const { email, name, role } = values

    const projectID = this.props.manuscript.containerID
    const invitingID = invitingUser.userID

    const alreadyInvited = invitations.some(
      invitation =>
        invitation.projectID === projectID &&
        invitation.invitedUserEmail === email
    )

    await projectInvite(projectID, [{ email, name }], role)
    this.setState({ invitationSent: true })

    if (!alreadyInvited) {
      this.createInvitedAuthor(email, invitingID, name)
    }
  }

  private createInvitedAuthor = (
    invitedEmail: string,
    invitingID: string,
    name: string
  ) => {
    const collection = this.props.collection as RxCollection<ProjectInvitation>

    const sub = collection
      .findOne({
        objectType: ObjectTypes.ProjectInvitation,
        projectID: this.props.manuscript.containerID,
        invitedUserEmail: invitedEmail,
        invitingUserID: invitingID,
      })
      .$.subscribe(async doc => {
        if (doc) {
          sub.unsubscribe()

          const invitation = doc.toJSON()
          const authors = buildSortedAuthors(this.props.modelMap)

          await this.createAuthor(
            buildAuthorPriority(authors),
            null,
            name,
            invitation._id
          )
        }
      })
  }

  private buildInvitedAuthorsEmail = (
    authorInvitationIDs: string[],
    invitations: ProjectInvitation[]
  ) => {
    const invitedAuthorsEmail: string[] = []
    for (const invitation of invitations) {
      if (authorInvitationIDs.includes(invitation._id)) {
        invitedAuthorsEmail.push(invitation.invitedUserEmail)
      }
    }
    return invitedAuthorsEmail
  }

  private buildNonAuthors = (
    authors: Contributor[],
    collaborators: UserProfile[],
    invitations: ProjectInvitation[]
  ) => {
    const userIDs: string[] = authors.map(author => author.userID as string)
    const invitationsID: string[] = authors.map(author => author.invitationID!)

    const invitedAuthorsEmail: string[] = this.buildInvitedAuthorsEmail(
      invitationsID,
      invitations
    )

    const nonAuthors: UserProfile[] = collaborators.filter(
      person =>
        !userIDs.includes(person.userID) &&
        !invitedAuthorsEmail.includes(person.email as string)
    )

    this.setState({ nonAuthors })
  }

  private handleSaveAuthor = async (values: AuthorValues) => {
    const { selectedAuthor } = this.state

    if (!selectedAuthor) return

    const author = {
      ...selectedAuthor,
      ...values,
      affiliations: selectedAuthor.affiliations,
    }

    delete author.containerID

    await this.props.saveModel<Contributor>(author)
  }

  private addAuthorAffiliation = async (affiliation: Affiliation | string) => {
    const { selectedAuthor } = this.state

    if (!selectedAuthor) return

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

    this.setState({
      selectedAuthor: author,
    })
    await this.props.saveModel<Contributor>(author)
  }

  private removeAuthorAffiliation = async (affiliation: Affiliation) => {
    const { selectedAuthor } = this.state

    if (!selectedAuthor) return

    const nextAuthor = {
      ...selectedAuthor,
      affiliations: (selectedAuthor.affiliations || []).filter(
        aff => aff !== affiliation._id
      ),
    }

    this.setState({
      selectedAuthor: nextAuthor,
    })
    await this.props.saveModel<Contributor>(nextAuthor)
  }

  private updateAffiliation = async (affiliation: Affiliation) => {
    await this.props.saveModel<Affiliation>(affiliation)
  }

  private handleDrop = (oldIndex: number, newIndex: number) => {
    const { authors } = buildAuthorsAndAffiliations(this.props.modelMap)
    const reorderedAuthors = reorderAuthors(authors, oldIndex, newIndex)
    Promise.all(
      reorderedAuthors.map((author, i) => {
        author.priority = i
        return this.props.saveModel<Contributor>(author)
      })
    )
      .then(() => {
        this.setState({ authorListError: '' })
      })
      .catch(() => {
        this.setState({ authorListError: 'There was an error saving authors' })
      })
  }

  private getInvitation = (
    invitingUser: UserProfile,
    invitedEmail: string
  ): Promise<ProjectInvitation> => {
    return new Promise(resolve => {
      const collection = this.props.collection as RxCollection<
        ProjectInvitation
      >

      const sub = collection
        .findOne({
          objectType: ObjectTypes.ProjectInvitation,
          projectID: this.props.manuscript.containerID,
          invitedUserEmail: invitedEmail,
          invitingUserID: invitingUser.userID,
        })
        .$.subscribe(doc => {
          if (doc) {
            sub.unsubscribe()
            resolve(doc.toJSON())
          }
        })
    })
  }
}

export default MetadataContainer
