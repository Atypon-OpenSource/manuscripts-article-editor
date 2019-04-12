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

import { AuthorAffiliation } from '@manuscripts/style-guide'
import { Title, TitleField } from '@manuscripts/title-editor'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  AddAuthorsPage,
  AuthorDetailsPage,
} from '../src/components/collaboration/CollaboratorsPage'
import AddAuthorButton from '../src/components/metadata/AddAuthorButton'
import AddAuthorsSidebar from '../src/components/metadata/AddAuthorsSidebar'
import { AuthorFormContainer } from '../src/components/metadata/AuthorFormContainer'
import { AuthorsModal } from '../src/components/metadata/AuthorsModals'
import AuthorsSidebar from '../src/components/metadata/AuthorsSidebar'
import { Metadata } from '../src/components/metadata/Metadata'
import SearchAuthorsSidebar from '../src/components/metadata/SearchAuthorsSidebar'
import {
  buildAffiliationIDs,
  buildAuthorAffiliations,
} from '../src/lib/authors'
import { affiliations, authors, user } from './data/contributors'
import manuscripts from './data/manuscripts'
import { project } from './data/projects'

const affiliationIds = buildAffiliationIDs(authors)

const authorAffiliations = buildAuthorAffiliations(
  authors,
  affiliations,
  affiliationIds
)

const invitationValues = {
  name: '',
  email: '',
  role: '',
}

storiesOf('Metadata', module)
  .add('View/edit title', () => (
    <Metadata
      modelMap={new Map()}
      invitations={[]}
      numberOfAddedAuthors={0}
      authors={authors}
      nonAuthors={[]}
      addedAuthors={[]}
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      manuscript={manuscripts[0]}
      selectedAuthor={null}
      openAddAuthors={action('open adding')}
      editing={false}
      saveTitle={action('save title')}
      startEditing={action('start editing')}
      selectAuthor={action('select author')}
      removeAuthor={action('remove author')}
      createAuthor={action('create author')}
      addAuthorAffiliation={action(
        'add affiliation to select author (if string: create it)'
      )}
      removeAuthorAffiliation={action(
        'remove affiliation from selected author'
      )}
      updateAffiliation={action('upate the affiliation')}
      handleSaveAuthor={action('save author')}
      stopEditing={action('stop editing')}
      expanded={true}
      toggleExpanded={action('toggle expanded')}
      addingAuthors={false}
      user={user}
      project={project}
      handleAddingDoneCancel={action('stop adding')}
      isInvite={false}
      handleInvite={action('start invite')}
      handleInviteCancel={action('stop invite')}
      handleInvitationSubmit={action('invite author')}
      invitationValues={invitationValues}
      handleDrop={action('dropped the user')}
      handleTitleStateChange={action('title state change')}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
      invitationSent={false}
      permissions={{
        write: true,
      }}
    />
  ))
  .add('Edit authors', () => (
    <Metadata
      modelMap={new Map()}
      invitations={[]}
      authors={authors}
      nonAuthors={[]}
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      manuscript={manuscripts[0]}
      selectedAuthor={authors[0]}
      editing={true}
      saveTitle={action('save title')}
      startEditing={action('start editing')}
      selectAuthor={action('select author')}
      removeAuthor={action('remove author')}
      createAuthor={action('create author')}
      addAuthorAffiliation={action(
        'add affiliation to select author (if string: create it)'
      )}
      removeAuthorAffiliation={action(
        'remove affiliation from selected author'
      )}
      updateAffiliation={action('upate the affiliation')}
      handleSaveAuthor={action('save author')}
      stopEditing={action('stop editing')}
      expanded={true}
      toggleExpanded={action('toggle expanded')}
      addingAuthors={false}
      user={user}
      project={project}
      openAddAuthors={action('start adding')}
      numberOfAddedAuthors={0}
      addedAuthors={[]}
      handleAddingDoneCancel={action('stop adding')}
      isInvite={false}
      handleInvite={action('start invite')}
      handleInviteCancel={action('stop invite')}
      handleInvitationSubmit={action('invite author')}
      invitationValues={invitationValues}
      handleDrop={action('dropped the user')}
      handleTitleStateChange={action('title state change')}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
      invitationSent={false}
      permissions={{
        write: true,
      }}
    />
  ))
  .add('Collapsed', () => (
    <Metadata
      modelMap={new Map()}
      invitations={[]}
      authors={authors}
      nonAuthors={[]}
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      manuscript={manuscripts[0]}
      selectedAuthor={authors[0]}
      editing={false}
      saveTitle={action('save title')}
      startEditing={action('start editing')}
      selectAuthor={action('select author')}
      removeAuthor={action('remove author')}
      createAuthor={action('create author')}
      addAuthorAffiliation={action(
        'add affiliation to select author (if string: create it)'
      )}
      removeAuthorAffiliation={action(
        'remove affiliation from selected author'
      )}
      updateAffiliation={action('upate the affiliation')}
      handleSaveAuthor={action('save author')}
      stopEditing={action('stop editing')}
      expanded={false}
      toggleExpanded={action('toggle expanded')}
      addingAuthors={false}
      openAddAuthors={action('start adding')}
      numberOfAddedAuthors={0}
      user={user}
      project={project}
      addedAuthors={[]}
      handleAddingDoneCancel={action('stop adding')}
      isInvite={false}
      handleInvite={action('start invite')}
      handleInviteCancel={action('stop invite')}
      handleInvitationSubmit={action('invite author')}
      invitationValues={invitationValues}
      handleDrop={action('dropped the user')}
      handleTitleStateChange={action('title state change')}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
      invitationSent={false}
      permissions={{
        write: true,
      }}
    />
  ))
  .add('Title: read-only', () => (
    <Title
      value={
        'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change'
      }
    />
  ))
  .add('Title: write', () => (
    <TitleField
      value={
        'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change'
      }
    />
  ))
  .add('Authors Modal', () => (
    <AuthorsModal
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      handleSaveAuthor={action('save author')}
      addAuthorAffiliation={action(
        'add affiliation to select author (if string: create it)'
      )}
      removeAuthorAffiliation={action(
        'remove affiliation from selected author'
      )}
      updateAffiliation={action('upate the affiliation')}
      isRemoveAuthorOpen={false}
      removeAuthor={action('remove author')}
      handleRemoveAuthor={action(
        'handle open the remove author confirmation dialog'
      )}
      isRejected={action('check invitation existence')}
      project={project}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
      getAuthorName={action('get the author name')}
      authors={authors}
      selectAuthor={action('select author')}
      selectedAuthor={null}
      handleDrop={action('dropped the user')}
      openAddAuthors={action('start adding')}
    />
  ))
  .add('Authors Sidebar', () => (
    <AuthorsSidebar
      authors={authors}
      authorAffiliations={authorAffiliations}
      selectAuthor={action('select author')}
      selectedAuthor={null}
      openAddAuthors={action('start adding')}
      handleDrop={action('dropped the user')}
    />
  ))
  .add('Authors Sidebar with decorations', () => (
    <AuthorsSidebar
      authors={authors}
      authorAffiliations={authorAffiliations}
      selectAuthor={action('select author')}
      selectedAuthor={null}
      getSidebarItemDecorator={() => <span>Ain't Afraid</span>}
      openAddAuthors={action('start adding')}
      handleDrop={action('dropped the user')}
    />
  ))
  .add('Author Form', () => (
    <AuthorFormContainer
      author={authors[0]}
      affiliations={affiliations}
      authorAffiliations={
        authorAffiliations.get(authors[0]._id) as AuthorAffiliation[]
      }
      handleSave={action('save author')}
      addAuthorAffiliation={action(
        'add affiliation to select author (if string: create it)'
      )}
      removeAuthorAffiliation={action(
        'remove affiliation from selected author'
      )}
      updateAffiliation={action('upate the affiliation')}
      isRemoveAuthorOpen={false}
      removeAuthor={action('remove author')}
      handleRemoveAuthor={action(
        'handle open the remove author confirmation dialog'
      )}
      isRejected={action('check invitation existence')}
      project={project}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
      getAuthorName={action('get the author name')}
    />
  ))
  .add('Add Authors Sidebar', () => (
    <AddAuthorsSidebar
      nonAuthors={[]}
      numberOfAddedAuthors={0}
      isSearching={false}
      searchText={''}
      addedAuthors={[]}
      handleDoneCancel={action('stop adding')}
      createAuthor={action('create author')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      isCreateAuthorOpen={false}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))
  .add('Add Authors Sidebar with suggested users', () => (
    <AddAuthorsSidebar
      nonAuthors={[user]}
      numberOfAddedAuthors={0}
      isSearching={false}
      searchText={''}
      addedAuthors={[]}
      handleDoneCancel={action('stop adding')}
      createAuthor={action('create author')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      isCreateAuthorOpen={false}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))

  .add('Add Authors Sidebar - Searching', () => (
    <AddAuthorsSidebar
      nonAuthors={[]}
      numberOfAddedAuthors={1}
      isSearching={true}
      searchText={'notFound'}
      addedAuthors={[]}
      handleDoneCancel={action('stop adding')}
      createAuthor={action('create author')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      isCreateAuthorOpen={false}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))

  .add('Add Authors Sidebar - Create author', () => (
    <AddAuthorsSidebar
      nonAuthors={[]}
      numberOfAddedAuthors={1}
      isSearching={true}
      searchText={'notFound'}
      addedAuthors={[]}
      handleDoneCancel={action('stop adding')}
      createAuthor={action('create author')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      isCreateAuthorOpen={true}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))

  .add('Search Authors Sidebar', () => (
    <SearchAuthorsSidebar
      searchText={'notFound'}
      addedAuthors={[]}
      createAuthor={action('create author')}
      searchResults={[]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))
  .add('Search Authors Sidebar - search email', () => (
    <SearchAuthorsSidebar
      searchText={'notFound@atypon.com'}
      addedAuthors={[]}
      createAuthor={action('create author')}
      searchResults={[]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))
  .add('Search Authors Sidebar - Search with results', () => (
    <SearchAuthorsSidebar
      searchText={user.bibliographicName.given!}
      addedAuthors={[]}
      createAuthor={action('create author')}
      searchResults={[user]}
      handleInvite={action('start invite')}
      authors={authors}
      isAuthorExist={action('check author existence')}
      handleCreateAuthor={action(
        'handle open the create author confirmation dialog'
      )}
    />
  ))
  .add('Add Author Button', () => (
    <AddAuthorButton
      person={user}
      authors={authors}
      createAuthor={action('create author')}
    />
  ))

  .add('Add Authors Page', () => <AddAuthorsPage addedAuthorsCount={3} />)
  .add('Author Details Page ', () => <AuthorDetailsPage />)
