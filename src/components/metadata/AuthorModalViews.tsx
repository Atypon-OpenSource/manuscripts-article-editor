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

import { Contributor, UserProfile } from '@manuscripts/json-schema'
import {
  CloseButton,
  ModalContainer,
  ModalHeader,
  StyledModal,
} from '@manuscripts/style-guide'
import {
  buildBibliographicName,
  buildContributor,
} from '@manuscripts/transform'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { getMetaData, reorderAuthors } from '../../lib/authors'
import { useStore } from '../../store'
import { AddAuthorsModalContainer } from './AddAuthorsModalContainer'
import AuthorsModalContainer from './AuthorsModalContainer'

interface State {
  expanded: boolean
  selectedAuthor: string | null // _id of the selectedAuthor
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  addedAuthors: string[]
  authorListError?: string
}

const AuthorModalViews: React.FC = () => {
  const [store, dispatch] = useStore((store) => store)

  const [state, setState] = useState<State>({
    expanded: true,
    selectedAuthor: null,
    addingAuthors: false,
    nonAuthors: [],
    numberOfAddedAuthors: 0,
    addedAuthors: [],
  })

  const {
    saveTrackModel,
    collaboratorsProfiles,
    user,
    deleteTrackModel,
    trackModelMap,
    authorsPopupOn,
  } = store

  const stopEditing = () => {
    setState((state) => ({
      ...state,

      selectedAuthor: null,
      addingAuthors: false,
      isInvite: false,
    }))

    dispatch({ authorsPopupOn: false })
  }

  const createAuthor = async (
    priority: number,
    person?: UserProfile | null,
    name?: string
  ) => {
    if (name) {
      const [given, ...family] = name.split(' ')

      const bibName = buildBibliographicName({
        given,
        family: family.join(' '),
      })

      const author = buildContributor(bibName, 'author', priority)

      await saveTrackModel(author)

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

      const createdAuthor: Contributor = await saveTrackModel(author)

      setState((state) => ({
        ...state,
        addedAuthors: state.addedAuthors.concat(author.userID as string),
        numberOfAddedAuthors: state.numberOfAddedAuthors + 1,
      }))

      selectAuthor(createdAuthor)
    }
  }

  const startEditing = useCallback(() => {
    dispatch({ authorsPopupOn: true })
  }, [dispatch])

  const selectAuthor = useCallback((author: Contributor | string) => {
    // TODO: make this switch without deselecting
    setState((state) => ({
      ...state,
      selectedAuthor: typeof author === 'string' ? author : author._id,
    }))
  }, [])

  useEffect(() => {
    dispatch({ startEditing, selectAuthor })
  }, [dispatch, startEditing, selectAuthor])

  const deselectAuthor = () => {
    setState((state) => ({ ...state, selectedAuthor: null }))
  }

  const removeAuthor = async (author: Contributor) => {
    await deleteTrackModel(author._id)
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

  const handleDrop = (
    authors: Contributor[],
    oldIndex: number,
    newIndex: number
  ) => {
    const reorderedAuthors = reorderAuthors(authors, oldIndex, newIndex)
    Promise.all(
      reorderedAuthors.map((author, i) => {
        author.priority = i
        return saveTrackModel<Contributor>(author)
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

  const metaData = useMemo(() => {
    const data = getMetaData(trackModelMap)
    // data?.authorsAndAffiliations.authors.filter((author) => {})
    console.log(data)
    return data
  }, [trackModelMap])

  useEffect(() => {
    dispatch({
      trackedAuthorsAndAffiliations: metaData?.authorsAndAffiliations,
    })
  }, [metaData, dispatch])

  const authorsAndAffiliations = metaData?.authorsAndAffiliations
  const contributorRoles = metaData?.contributorRoles || []

  if (
    !collaboratorsProfiles ||
    !user ||
    !authorsAndAffiliations ||
    !contributorRoles
  ) {
    return null
  }

  return (
    <StyledModal
      isOpen={!!authorsPopupOn}
      onRequestClose={stopEditing}
      shouldCloseOnOverlayClick={true}
    >
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={stopEditing} data-cy={'modal-close-button'} />
        </ModalHeader>
        {state.addingAuthors ? (
          <AddAuthorsModalContainer
            {...state}
            handleAddingDoneCancel={handleAddingDoneCancel}
            createAuthor={createAuthor}
            authors={authorsAndAffiliations.authors}
          />
        ) : (
          <AuthorsModalContainer
            {...state}
            createAuthor={createAuthor}
            selectAuthor={selectAuthor}
            removeAuthor={removeAuthor}
            saveTrackModel={saveTrackModel}
            handleDrop={handleDrop}
            authors={authorsAndAffiliations.authors}
            authorAffiliations={authorsAndAffiliations.authorAffiliations}
            affiliations={authorsAndAffiliations.affiliations}
            contributorRoles={contributorRoles}
          />
        )}
      </ModalContainer>
    </StyledModal>
  )
}

export default AuthorModalViews
