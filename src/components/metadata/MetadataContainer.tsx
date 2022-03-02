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
import { RxAttachment, RxAttachmentCreator } from '@manuscripts/rxdb'
import { TitleEditorView } from '@manuscripts/title-editor'
import React, { useState } from 'react'

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
import { trackEvent } from '../../lib/tracking'
import { getCurrentUserId } from '../../lib/user'
import { useStore } from '../../store'
import CollectionManager from '../../sync/CollectionManager'
import { Permissions } from '../../types/permissions'
import { InvitationValues } from '../collaboration/InvitationForm'
import { Metadata } from './Metadata'

interface Props {
  handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void
  permissions: Permissions
  allowInvitingAuthors: boolean
  showAuthorEditButton: boolean
  disableEditButton?: boolean
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

const MetadataContainer: React.FC<Props> = ({
  permissions,
  allowInvitingAuthors,
  showAuthorEditButton,
  disableEditButton,
  handleTitleStateChange,
}) => {
  const [state, setState] = useState({
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
  })

  const [data] = useStore()

  const {
    saveModel,

    collaborators,
    user,
    project,
    manuscript,
    saveManuscript,
    deleteModel,
    containerInvitations,
    invitations,
  } = data

  const allInvitations = [
    ...buildContainerInvitations(invitations),
    ...containerInvitations,
  ].filter((invitation) => invitation.containerID.startsWith('MPProject'))

  const updateAuthor = (invitingUser: UserProfile) => async (
    author: Contributor,
    invitedEmail: string
  ) => {
    const invitation = await getInvitation(invitingUser.userID, invitedEmail)

    const updatedAuthor: Contributor = await saveModel({
      ...author,
      invitationID: invitation._id,
    })

    selectAuthor(updatedAuthor)
  }

  const toggleExpanded = () => {
    setState({
      expanded: !state.expanded,
    })
  }

  const startEditing = () => {
    setState({ editing: true })
  }

  const stopEditing = () => {
    setState({
      editing: false,
      selectedAuthor: null,
      addingAuthors: false,
      isInvite: false,
      invitationSent: false,
    })
  }

  const saveTitle = async (title: string) => {
    await saveManuscript!({
      _id: manuscript._id,
      title,
    })
  }

  const createAuthor = async (
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

      await saveModel(author)

      setState({
        numberOfAddedAuthors: state.numberOfAddedAuthors + 1,
      })
    }

    if (person) {
      const author = buildContributor(
        person.bibliographicName,
        'author',
        priority,
        person.userID
      )

      const createdAuthor: Contributor = await saveModel(author)

      setState({
        addedAuthors: state.addedAuthors.concat(author.userID as string),
        numberOfAddedAuthors: state.numberOfAddedAuthors + 1,
      })

      selectAuthor(createdAuthor)
    }
  }

  const selectAuthor = (author: Contributor) => {
    // TODO: make this switch without deselecting
    setState({ selectedAuthor: null }, () => {
      setState({ selectedAuthor: author._id })
    })
  }

  const deselectAuthor = () => {
    setState({ selectedAuthor: null })
  }

  const removeAuthor = async (author: Contributor) => {
    await deleteModel(author._id)
    deselectAuthor()
    if (state.addedAuthors.includes(author.userID as string)) {
      const index = state.addedAuthors.indexOf(author.userID as string)
      state.addedAuthors.splice(index, 1)
    }
  }

  const startAddingAuthors = (
    collaborators: UserProfile[],
    invitations: ContainerInvitation[]
  ) => (authors: Contributor[]) => {
    setState({ addingAuthors: true, invitationSent: false })

    buildNonAuthors(authors, collaborators, invitations)
  }

  const handleAddingDoneCancel = () =>
    setState({ numberOfAddedAuthors: 0, addingAuthors: false })

  const handleInvite = (searchText: string) => {
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

    setState({ invitationValues, isInvite: true })
  }

  const handleInviteCancel = () =>
    setState({ isInvite: false, invitationSent: false })

  const handleInvitationSubmit = (
    invitingUser: UserProfile,
    invitations: ContainerInvitation[]
  ) => async (
    authors: Contributor[],
    values: InvitationValues
  ): Promise<void> => {
    const { email, name, role } = values

    const projectID = manuscript.containerID
    const invitingID = invitingUser.userID

    const alreadyInvited = invitations.some(
      (invitation) =>
        invitation.containerID === projectID &&
        invitation.invitedUserEmail === email
    )

    await projectInvite(projectID, [{ email, name }], role)

    if (!alreadyInvited) {
      await createInvitedAuthor(authors, email, invitingID, name)
    }

    setState({
      isInvite: false,
      invitationSent: true,
      addingAuthors: false,
      numberOfAddedAuthors: 0,
    })

    trackEvent({
      category: 'Invitations',
      action: 'Send',
      label: `projectID=${projectID}`,
    })
  }

  const createInvitedAuthor = async (
    authors: Contributor[],
    invitedEmail: string,
    invitingID: string,
    name: string
  ) => {
    const invitation = await getInvitation(invitingID, invitedEmail)

    await createAuthor(buildAuthorPriority(authors), null, name, invitation._id)
  }

  const buildInvitedAuthorsEmail = (
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

  const buildNonAuthors = (
    authors: Contributor[],
    collaborators: UserProfile[],
    invitations: ContainerInvitation[]
  ) => {
    const userIDs: string[] = authors.map((author) => author.userID as string)
    const invitationsID: string[] = authors.map(
      (author) => author.invitationID!
    )

    const invitedAuthorsEmail: string[] = buildInvitedAuthorsEmail(
      invitationsID,
      invitations
    )

    const nonAuthors: UserProfile[] = collaborators.filter(
      (person) =>
        !userIDs.includes(person.userID) &&
        !invitedAuthorsEmail.includes(person.email as string)
    )

    setState({ nonAuthors })
  }

  const handleDrop = (
    authors: Contributor[],
    oldIndex: number,
    newIndex: number
  ) => {
    const reorderedAuthors = reorderAuthors(authors, oldIndex, newIndex)
    Promise.all(
      reorderedAuthors.map((author, i) => {
        author.priority = i
        return saveModel<Contributor>(author)
      })
    )
      .then(() => {
        setState({ authorListError: '' })
      })
      .catch(() => {
        setState({ authorListError: 'There was an error saving authors' })
      })
  }

  const getInvitation = (
    invitingUserID: string,
    invitedEmail: string
  ): Promise<ContainerInvitation> => {
    return new Promise((resolve) => {
      const collection = CollectionManager.getCollection<ContainerInvitation>(
        'user'
      )

      const sub = collection
        .findOne({
          objectType: ObjectTypes.ContainerInvitation,
          containerID: manuscript.containerID,
          invitedUserEmail: invitedEmail,
          invitingUserID,
        })
        .$.subscribe((doc) => {
          if (doc) {
            sub.unsubscribe()
            resolve(doc.toJSON())
          }
        })
    })
  }

  return (
    <Metadata
      saveTitle={saveTitle}
      invitations={allInvitations}
      editing={state.editing}
      startEditing={startEditing}
      selectAuthor={selectAuthor}
      removeAuthor={removeAuthor}
      createAuthor={createAuthor}
      selectedAuthor={state.selectedAuthor}
      stopEditing={stopEditing}
      toggleExpanded={toggleExpanded}
      expanded={state.expanded}
      addingAuthors={state.addingAuthors}
      openAddAuthors={startAddingAuthors(
        buildCollaborators(
          project,
          buildCollaboratorProfiles(collaborators, user)
        ),
        allInvitations
      )}
      numberOfAddedAuthors={state.numberOfAddedAuthors}
      nonAuthors={state.nonAuthors}
      addedAuthors={state.addedAuthors}
      isInvite={state.isInvite}
      invitationValues={state.invitationValues}
      handleAddingDoneCancel={handleAddingDoneCancel}
      handleInvite={handleInvite}
      handleInviteCancel={handleInviteCancel}
      handleInvitationSubmit={handleInvitationSubmit(user, allInvitations)}
      handleDrop={handleDrop}
      updateAuthor={updateAuthor(user)}
      invitationSent={state.invitationSent}
      handleTitleStateChange={handleTitleStateChange}
      permissions={permissions}
      allowInvitingAuthors={allowInvitingAuthors}
      showAuthorEditButton={showAuthorEditButton}
      disableEditButton={disableEditButton}
    />
  )
}

export default MetadataContainer
