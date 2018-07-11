import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { Affiliations } from '../src/editor/manuscript/Affiliations'
import { AuthorAffiliation } from '../src/editor/manuscript/Author'
import { AuthorForm } from '../src/editor/manuscript/AuthorForm'
import Authors from '../src/editor/manuscript/Authors'
import AuthorsSidebar from '../src/editor/manuscript/AuthorsSidebar'
import {
  buildAffiliationIDs,
  buildAuthorAffiliations,
} from '../src/editor/manuscript/lib/authors'
import { Metadata } from '../src/editor/manuscript/Metadata'
import Title from '../src/editor/manuscript/Title'
import {
  StyledTitleField,
  TitleField,
} from '../src/editor/manuscript/TitleField'
import { affiliations, authors } from './data/contributors'
import manuscripts from './data/manuscripts'

const affiliationIds = buildAffiliationIDs(authors)

const authorAffiliations = buildAuthorAffiliations(
  authors,
  affiliations,
  affiliationIds
)

storiesOf('Manuscript', module)
  .add('View/edit title', () => (
    <Metadata
      authors={authors}
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
    />
  ))
  .add('Edit authors', () => (
    <Metadata
      authors={authors}
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
    />
  ))
  .add('Collapsed', () => (
    <Metadata
      authors={authors}
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
      expanded={false}
      toggleExpanded={action('toggle expanded')}
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
  .add('Titles: write, styled', () => (
    <div>
      {manuscripts.map((manuscript, index) => (
        <StyledTitleField
          value={manuscript.title}
          autoFocus={index === 0}
          handleChange={action('save title')}
        />
      ))}
    </div>
  ))
  .add('Authors', () => (
    <Authors
      authors={authors}
      authorAffiliations={authorAffiliations}
      startEditing={action('start editing')}
    />
  ))
  .add('Affiliations', () => <Affiliations affiliations={affiliations} />)
  .add('Authors Sidebar', () => (
    <AuthorsSidebar
      authors={authors}
      authorAffiliations={authorAffiliations}
      createAuthor={action('create author')}
      removeAuthor={action('remove author')}
      selectAuthor={action('select author')}
      selectedAuthor={null}
    />
  ))
  .add('Author Form', () => (
    <AuthorForm
      manuscript={manuscripts[0].id}
      author={authors[0]}
      affiliations={affiliations}
      authorAffiliations={
        authorAffiliations.get(authors[0].id) as AuthorAffiliation[]
      }
      handleSave={action('save author')}
      createAffiliation={action('create affiliation')}
    />
  ))
