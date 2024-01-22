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
import React from 'react'

import { AddAuthorsModal } from './AuthorsModals'

interface State {
  isCreateAuthorOpen: boolean
  searchText: string
  searchResults: UserProfile[]
}

interface Props {
  nonAuthors: UserProfile[]
  authors: Contributor[]
  addedAuthors: string[]
  numberOfAddedAuthors: number
  handleAddingDoneCancel: () => void
  createAuthor: (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => void
}

export class AddAuthorsModalContainer extends React.Component<Props, State> {
  public state = {
    isCreateAuthorOpen: false,
    searchText: '',
    searchResults: [],
  }

  public render() {
    const { isCreateAuthorOpen, searchResults, searchText } = this.state

    const {
      numberOfAddedAuthors,
      createAuthor,
      addedAuthors,
      authors,
      handleAddingDoneCancel,
      nonAuthors,
    } = this.props

    return (
      <AddAuthorsModal
        authors={authors}
        nonAuthors={nonAuthors}
        addedAuthors={addedAuthors}
        numberOfAddedAuthors={numberOfAddedAuthors}
        isCreateAuthorOpen={isCreateAuthorOpen}
        searchResults={searchResults}
        searchText={searchText}
        createAuthor={createAuthor}
        handleAddingDoneCancel={handleAddingDoneCancel}
        handleSearchChange={this.handleSearchChange}
        handleCreateAuthor={this.handleCreateAuthor}
      />
    )
  }

  private handleCreateAuthor = () => {
    if (this.state.isCreateAuthorOpen) {
      this.setState({
        searchText: '',
      })
    }
    this.setState({
      isCreateAuthorOpen: !this.state.isCreateAuthorOpen,
    })
  }

  private handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ searchText: event.currentTarget.value })

    this.search(event.currentTarget.value)
  }

  private search = (searchText: string) => {
    const { nonAuthors } = this.props

    if (!nonAuthors || !searchText) {
      return this.setState({ searchResults: [] })
    }

    searchText = searchText.toLowerCase()

    const searchResults: UserProfile[] = nonAuthors.filter((person) => {
      if (searchText.includes('@')) {
        return person.email && person.email.toLowerCase().includes(searchText)
      }

      const personName = [
        person.bibliographicName.given,
        person.bibliographicName.family,
      ]
        .filter((part) => part)
        .join(' ')
        .toLowerCase()

      return personName && personName.includes(searchText)
    })

    this.setState({ searchResults })
  }
}
