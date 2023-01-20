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
  ContainerInvitation,
  Contributor,
  UserProfile,
} from '@manuscripts/json-schema'
import { TitleEditorView } from '@manuscripts/title-editor'
import {
  buildBibliographicName,
  buildContributor,
} from '@manuscripts/transform'
import React, { useState } from 'react'

import { projectInvite } from '../../lib/api'
import { buildAuthorPriority, reorderAuthors } from '../../lib/authors'
import { buildContainerInvitations } from '../../lib/invitation'
import { trackEvent } from '../../lib/tracking'
import { useStore } from '../../store'
import { InvitationValues } from './AuthorInvitationForm'
import { Metadata } from './Metadata'

interface Props {
  handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void
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
  allowInvitingAuthors,
  showAuthorEditButton,
  disableEditButton,
  handleTitleStateChange,
}) => {
  const [state, setState] = useState<State>({
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

  const [
    {
      saveModel,
      collaboratorsProfiles,
      user,
      manuscript,
      saveManuscript,
      deleteModel,
      containerInvitations,
      invitations,
      getInvitation,
    },
  ] = useStore((store) => ({
    saveModel: store.saveModel,
    collaboratorsProfiles: store.collaboratorsProfiles,
    user: store.user,
    project: store.project,
    manuscript: store.manuscript,
    saveManuscript: store.saveManuscript,
    deleteModel: store.deleteModel,
    containerInvitations: store.containerInvitations || [],
    invitations: store.projectInvitations || [],
    getInvitation: store.getInvitation || (() => null),
  }))

  const allInvitations = [
    ...buildContainerInvitations(invitations),
    ...containerInvitations,
  ].filter((invitation) => invitation.containerID.startsWith('MPProject'))

  const updateAuthor =
    (invitingUser: UserProfile) =>
    async (author: Contributor, invitedEmail: string) => {
      const invitation = await getInvitation(invitingUser.userID, invitedEmail)

      const updatedAuthor: Contributor = await saveModel({
        ...author,
        invitationID: invitation?._id || '',
      })

      selectAuthor(updatedAuthor)
    }

  const toggleExpanded = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }))
  }

  const startEditing = () => {
    setState((state) => ({ ...state, editing: true }))
  }

  const stopEditing = () => {
    setState((state) => ({
      ...state,
      editing: false,
      selectedAuthor: null,
      addingAuthors: false,
      isInvite: false,
      invitationSent: false,
    }))
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

      setState((state) => ({
        ...state,
        numberOfAddedAuthors: state.numberOfAddedAuthors + 1,
      }))
    }

    if (person) {
      const author = buildContributor(
        person.bibliographicName,
        'author',
        priority,
        person.userID
      )

      const createdAuthor: Contributor = await saveModel(author)

      setState((state) => ({
        ...state,
        addedAuthors: state.addedAuthors.concat(author.userID as string),
        numberOfAddedAuthors: state.numberOfAddedAuthors + 1,
      }))

      selectAuthor(createdAuthor)
    }
  }

  const selectAuthor = (author: Contributor) => {
    // TODO: make this switch without deselecting
    setState((state) => ({ ...state, selectedAuthor: author._id }))
  }

  const deselectAuthor = () => {
    setState((state) => ({ ...state, selectedAuthor: null }))
  }

  const removeAuthor = async (author: Contributor) => {
    await deleteModel(author._id)
    deselectAuthor()
    if (state.addedAuthors.includes(author.userID as string)) {
      const index = state.addedAuthors.indexOf(author.userID as string)
      state.addedAuthors.splice(index, 1)
    }
  }

  const handleAddingDoneCancel = () =>
    setState((state) => ({
      ...state,
      numberOfAddedAuthors: 0,
      addingAuthors: false,
    }))

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

    setState((state) => ({ ...state, invitationValues, isInvite: true }))
  }

  const handleInviteCancel = () =>
    setState((state) => ({ ...state, isInvite: false, invitationSent: false }))

  const handleInvitationSubmit =
    (invitingUser: UserProfile, invitations: ContainerInvitation[]) =>
    async (authors: Contributor[], values: InvitationValues): Promise<void> => {
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

      setState((state) => ({
        ...state,
        isInvite: false,
        invitationSent: true,
        addingAuthors: false,
        numberOfAddedAuthors: 0,
      }))

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
    await createAuthor(
      buildAuthorPriority(authors),
      null,
      name,
      invitation?._id
    )
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
        setState((state) => ({ ...state, authorListError: '' }))
      })
      .catch(() => {
        setState((state) => ({
          ...state,
          authorListError: 'There was an error saving authors',
        }))
      })
  }

  if (!collaboratorsProfiles || !user) {
    return null
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
      allowInvitingAuthors={allowInvitingAuthors}
      showAuthorEditButton={showAuthorEditButton}
      disableEditButton={disableEditButton}
    />
  )
}

export default MetadataContainer
