import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Affiliations } from '../src/components/metadata/Affiliations'
import { AuthorAffiliation } from '../src/components/metadata/Author'
import { AuthorForm } from '../src/components/metadata/AuthorForm'
import Authors from '../src/components/metadata/Authors'
import AuthorsSidebar from '../src/components/metadata/AuthorsSidebar'
import { Metadata } from '../src/components/metadata/Metadata'
import Title from '../src/editor/title/Title'
import { TitleField } from '../src/editor/title/TitleField'
import {
  buildAffiliationIDs,
  buildAuthorAffiliations,
} from '../src/lib/authors'
import { Project, UserProfile } from '../src/types/models'
import { affiliations, authors } from './data/contributors'
import manuscripts from './data/manuscripts'

const affiliationIds = buildAffiliationIDs(authors)

const authorAffiliations = buildAuthorAffiliations(
  authors,
  affiliations,
  affiliationIds
)

storiesOf('Metadata', module)
  .add('View/edit title', () => (
    <Metadata
      authors={authors}
      nonAuthors={[]}
      affiliations={affiliations}
      authorAffiliations={authorAffiliations}
      manuscript={manuscripts[0]}
      selectedAuthor={null}
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
      startAddingAuthors={action('start adding')}
      addedAuthorsCount={0}
      searchingAuthors={false}
      searchText={''}
      // tslint:disable-next-line:no-object-literal-type-assertion
      project={{} as Project}
      // tslint:disable-next-line:no-object-literal-type-assertion
      user={{} as UserProfile}
      addedAuthors={[]}
      handleAddingDoneCancel={action('stop adding')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
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
      isRemovePopperOpen={false}
      handleRemovePopperOpen={action('handle open the remove author popper')}
      handleSectionChange={action('section change')}
    />
  ))
  .add('Edit authors', () => (
    <Metadata
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
      // tslint:disable-next-line:no-object-literal-type-assertion
      user={{} as UserProfile}
      // tslint:disable-next-line:no-object-literal-type-assertion
      project={{} as Project}
      startAddingAuthors={action('start adding')}
      addedAuthorsCount={0}
      searchingAuthors={false}
      searchText={''}
      addedAuthors={[]}
      handleAddingDoneCancel={action('stop adding')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
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
      isRemovePopperOpen={false}
      handleRemovePopperOpen={action('handle open the remove author popper')}
      handleSectionChange={action('section change')}
    />
  ))
  .add('Collapsed', () => (
    <Metadata
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
      startAddingAuthors={action('start adding')}
      addedAuthorsCount={0}
      searchingAuthors={false}
      // tslint:disable-next-line:no-object-literal-type-assertion
      user={{} as UserProfile}
      // tslint:disable-next-line:no-object-literal-type-assertion
      project={{} as Project}
      searchText={''}
      addedAuthors={[]}
      handleAddingDoneCancel={action('stop adding')}
      handleSearchChange={action('update search text')}
      handleSearchFocus={action('start searching')}
      searchResults={[]}
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
      isRemovePopperOpen={false}
      handleRemovePopperOpen={action('handle open the remove author popper')}
      handleSectionChange={action('section change')}
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
  .add('Authors Sidebar', () => (
    <AuthorsSidebar
      authors={authors}
      authorAffiliations={authorAffiliations}
      removeAuthor={action('remove author')}
      selectAuthor={action('select author')}
      selectedAuthor={null}
      startAdding={action('start adding')}
      checkInvitations={action('check invitation existence')}
      handleDrop={action('dropped the user')}
      isRemovePopperOpen={false}
      handleRemovePopperOpen={action('handle open the remove author popper')}
    />
  ))
  .add('Author Form', () => (
    <AuthorForm
      manuscript={manuscripts[0]._id}
      author={authors[0]}
      affiliations={affiliations}
      authorAffiliations={
        authorAffiliations.get(authors[0]._id) as AuthorAffiliation[]
      }
      handleSave={action('save author')}
      createAffiliation={action('create affiliation')}
    />
  ))
