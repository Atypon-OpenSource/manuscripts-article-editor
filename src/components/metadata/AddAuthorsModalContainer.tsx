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
  Contributor,
  Model,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { buildSortedAuthors } from '../../lib/authors'
import { AddAuthorsModal } from './AuthorsModals'

interface State {
  isCreateAuthorOpen: boolean
  searchingAuthors: boolean
  searchText: string
  searchResults: UserProfile[]
}

interface Props {
  nonAuthors: UserProfile[]
  authors: Contributor[]
  addedAuthors: string[]
  modelMap: Map<string, Model>
  numberOfAddedAuthors: number
  handleAddingDoneCancel: () => void
  handleInvite: (searchText: string) => void
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
    searchingAuthors: false,
    searchText: '',
    searchResults: [],
  }

  public render() {
    const {
      isCreateAuthorOpen,
      searchResults,
      searchText,
      searchingAuthors,
    } = this.state

    const {
      numberOfAddedAuthors,
      createAuthor,
      addedAuthors,
      authors,
      handleAddingDoneCancel,
      nonAuthors,
      handleInvite,
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
        searchingAuthors={searchingAuthors}
        createAuthor={createAuthor}
        isAuthorExist={this.isAuthorExist}
        handleAddingDoneCancel={handleAddingDoneCancel}
        handleInvite={handleInvite}
        handleSearchFocus={this.handleSearchFocus}
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

  private handleSearchFocus = () =>
    this.setState({
      searchingAuthors: !this.state.searchingAuthors,
    })

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

    const searchResults: UserProfile[] = nonAuthors.filter(person => {
      if (searchText.includes('@')) {
        return person.email && person.email.toLowerCase().includes(searchText)
      }

      const personName = [
        person.bibliographicName.given,
        person.bibliographicName.family,
      ]
        .filter(part => part)
        .join(' ')
        .toLowerCase()

      return personName && personName.includes(searchText)
    })

    this.setState({ searchResults })
  }

  private isAuthorExist = () => {
    const name = this.state.searchText
    const [given, ...family] = name.split(' ')
    const authors = buildSortedAuthors(this.props.modelMap)
    for (const author of authors) {
      if (
        author.bibliographicName.given!.toLowerCase() === given.toLowerCase() &&
        author.bibliographicName.family!.toLowerCase() ===
          family.join(' ').toLowerCase()
      ) {
        return true
      }
    }

    return false
  }
}
