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
import { Affiliations } from '../src/components/metadata/Affiliations'
import { AuthorAffiliation } from '../src/components/metadata/Author'
import { AuthorForm } from '../src/components/metadata/AuthorForm'
import Authors from '../src/components/metadata/Authors'
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
      createAffiliation={action('create affiliation')}
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
      invitationValues={{
        name: '',
        email: '',
        role: '',
      }}
      checkInvitations={action('check invitation existence')}
      handleDrop={action('dropped the user')}
      handleSectionChange={action('section change')}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
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
      createAffiliation={action('create affiliation')}
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
      invitationValues={{
        name: '',
        email: '',
        role: '',
      }}
      checkInvitations={action('check invitation existence')}
      handleDrop={action('dropped the user')}
      handleSectionChange={action('section change')}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
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
      createAffiliation={action('create affiliation')}
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
      invitationValues={{
        name: '',
        email: '',
        role: '',
      }}
      checkInvitations={action('check invitation existence')}
      handleDrop={action('dropped the user')}
      handleSectionChange={action('section change')}
      updateAuthor={action(
        'update author after inviting him to collaborate on project'
      )}
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
  .add('Authors with edit button', () => (
    <Authors
      authors={authors}
      authorAffiliations={authorAffiliations}
      startEditing={action('start editing')}
      showEditButton={true}
      selectAuthor={action('select author')}
    />
  ))
  .add('Authors with no edit button', () => (
    <Authors
      authors={authors}
      authorAffiliations={authorAffiliations}
      startEditing={action('start editing')}
      showEditButton={false}
      selectAuthor={action('select author')}
    />
  ))
  .add('Affiliations', () => <Affiliations affiliations={affiliations} />)
  .add('Authors Modal', () => (
    <AuthorsModal
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      handleSaveAuthor={action('save author')}
      createAffiliation={action('create affiliation')}
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
      checkInvitations={action('check invitation existence')}
      handleDrop={action('dropped the user')}
      isHovered={false}
      openAddAuthors={action('start adding')}
      handleHover={action('handle hover over add author button')}
    />
  ))
  .add('Authors Sidebar', () => (
    <AuthorsSidebar
      authors={authors}
      authorAffiliations={authorAffiliations}
      selectAuthor={action('select author')}
      selectedAuthor={null}
      openAddAuthors={action('start adding')}
      checkInvitations={action('check invitation existence')}
      handleDrop={action('dropped the user')}
      isHovered={false}
      handleHover={action('handle hover over add author button')}
    />
  ))
  .add('Author Form', () => (
    <AuthorForm
      author={authors[0]}
      affiliations={affiliations}
      authorAffiliations={
        authorAffiliations.get(authors[0]._id) as AuthorAffiliation[]
      }
      handleSave={action('save author')}
      createAffiliation={action('create affiliation')}
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

  .add('Search Authors Sidebar', () => (
    <SearchAuthorsSidebar
      searchText={''}
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

  .add('Add Author Button', () => (
    <AddAuthorButton
      person={user}
      authors={authors}
      createAuthor={action('create author')}
    />
  ))

  .add('Add Authors Page', () => <AddAuthorsPage addedAuthorsCount={3} />)
  .add('Author Details Page ', () => <AuthorDetailsPage />)
