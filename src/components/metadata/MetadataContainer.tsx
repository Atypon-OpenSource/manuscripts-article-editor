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
  buildBibliographicName,
  buildContributor,
} from '@manuscripts/manuscript-transform'
import {
  ContainerInvitation,
  Contributor,
  Manuscript,
  Model,
  ObjectTypes,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { RxCollection } from '@manuscripts/rxdb'
import { TitleEditorView } from '@manuscripts/title-editor'
import React from 'react'
import CollaboratorsData from '../../data/CollaboratorsData'
import ContainerInvitationsData from '../../data/ContainerInvitationsData'
import ProjectData from '../../data/ProjectData'
import ProjectInvitationsData from '../../data/ProjectInvitationsData'
import { TokenActions } from '../../data/TokenData'
import UserData from '../../data/UserData'
import { projectInvite } from '../../lib/api'
import { buildAuthorPriority, reorderAuthors } from '../../lib/authors'
import {
  buildCollaboratorProfiles,
  buildCollaborators,
} from '../../lib/collaborators'
import { buildContainerInvitations } from '../../lib/invitation'
import { EventCategory, trackEvent } from '../../lib/tracking'
import { getCurrentUserId } from '../../lib/user'
import CollectionManager from '../../sync/CollectionManager'
import { Permissions } from '../../types/permissions'
import { InvitationValues } from '../collaboration/InvitationForm'
import { Metadata } from './Metadata'

interface Props {
  collection: RxCollection<Model>
  manuscript: Manuscript
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
  selectedAuthor: string | null // _id of the selectedAuthor
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
      handleTitleStateChange,
      permissions,
      tokenActions,
      saveModel,
    } = this.props

    // TODO: editable prop

    return (
      <CollaboratorsData>
        {collaborators => (
          <UserData userID={getCurrentUserId()!}>
            {user => (
              <ProjectData projectID={manuscript.containerID}>
                {project => (
                  <ProjectInvitationsData projectID={manuscript.containerID}>
                    {invitations => (
                      <ContainerInvitationsData
                        containerID={manuscript.containerID}
                      >
                        {containerInvitations => {
                          const allInvitations = [
                            ...buildContainerInvitations(invitations),
                            ...containerInvitations,
                          ].filter(invitation =>
                            invitation.containerID.startsWith('MPProject')
                          )
                          return (
                            <Metadata
                              saveTitle={this.saveTitle}
                              invitations={allInvitations}
                              editing={editing}
                              startEditing={this.startEditing}
                              selectAuthor={this.selectAuthor}
                              removeAuthor={this.removeAuthor}
                              createAuthor={this.createAuthor}
                              saveModel={saveModel}
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
                                allInvitations
                              )}
                              numberOfAddedAuthors={numberOfAddedAuthors}
                              nonAuthors={nonAuthors}
                              addedAuthors={addedAuthors}
                              isInvite={isInvite}
                              invitationValues={invitationValues}
                              handleAddingDoneCancel={
                                this.handleAddingDoneCancel
                              }
                              handleInvite={this.handleInvite}
                              handleInviteCancel={this.handleInviteCancel}
                              handleInvitationSubmit={this.handleInvitationSubmit(
                                user,
                                allInvitations
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
                      </ContainerInvitationsData>
                    )}
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
    const invitation = await this.getInvitation(
      invitingUser.userID,
      invitedEmail
    )

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
      invitationSent: false,
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

  private selectAuthor = (author: Contributor) => {
    // TODO: make this switch without deselecting
    this.setState({ selectedAuthor: null }, () => {
      this.setState({ selectedAuthor: author._id })
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
    invitations: ContainerInvitation[]
  ) => (authors: Contributor[]) => {
    this.setState({ addingAuthors: true, invitationSent: false })

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
    invitations: ContainerInvitation[]
  ) => async (
    authors: Contributor[],
    values: InvitationValues
  ): Promise<void> => {
    const { email, name, role } = values

    const projectID = this.props.manuscript.containerID
    const invitingID = invitingUser.userID

    const alreadyInvited = invitations.some(
      invitation =>
        invitation.containerID === projectID &&
        invitation.invitedUserEmail === email
    )

    await projectInvite(projectID, [{ email, name }], role)

    if (!alreadyInvited) {
      await this.createInvitedAuthor(authors, email, invitingID, name)
    }

    this.setState({
      isInvite: false,
      invitationSent: true,
      addingAuthors: false,
      numberOfAddedAuthors: 0,
    })

    trackEvent(
      EventCategory.Invitations,
      'Send invitation',
      `projectID=${projectID}`
    )
  }

  private createInvitedAuthor = async (
    authors: Contributor[],
    invitedEmail: string,
    invitingID: string,
    name: string
  ) => {
    const invitation = await this.getInvitation(invitingID, invitedEmail)

    await this.createAuthor(
      buildAuthorPriority(authors),
      null,
      name,
      invitation._id
    )
  }

  private buildInvitedAuthorsEmail = (
    authorInvitationIDs: string[],
    invitations: ContainerInvitation[]
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
    invitations: ContainerInvitation[]
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

  private handleDrop = (
    authors: Contributor[],
    oldIndex: number,
    newIndex: number
  ) => {
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
    invitingUserID: string,
    invitedEmail: string
  ): Promise<ContainerInvitation> => {
    return new Promise(resolve => {
      const collection = CollectionManager.getCollection<ContainerInvitation>(
        'user'
      )

      const sub = collection
        .findOne({
          objectType: ObjectTypes.ContainerInvitation,
          containerID: this.props.manuscript.containerID,
          invitedUserEmail: invitedEmail,
          invitingUserID,
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
