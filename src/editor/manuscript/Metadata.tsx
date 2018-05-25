import React from 'react'
import { Manage } from '../../components/Manage'
import { Affiliation, Contributor, Manuscript } from '../../types/components'
import { Affiliations } from './Affiliations'
import { AuthorAffiliation } from './Author'
import { AuthorForm, AuthorValues } from './AuthorForm'
import Authors from './Authors'
import AuthorsSidebar from './AuthorsSidebar'
import { Header } from './Header'
import { AffiliationMap } from './lib/authors'
import { StyledTitleField } from './TitleField'

interface Props {
  saveTitle: (title: string) => void
  manuscript: Manuscript
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  startEditing: () => void
  editing: boolean
  stopEditing: () => void
  createAuthor: (priority: number) => void
  removeAuthor: (data: Contributor) => void
  selectAuthor: (data: Contributor) => void
  selectedAuthor: Contributor | null
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
}

export const Metadata: React.SFC<Props> = ({
  saveTitle,
  manuscript,
  authors,
  authorAffiliations,
  affiliations,
  startEditing,
  editing,
  stopEditing,
  createAuthor,
  removeAuthor,
  selectAuthor,
  selectedAuthor,
  handleSaveAuthor,
  createAffiliation,
}) => (
  <Header>
    <StyledTitleField
      value={manuscript.title}
      autoFocus={!manuscript.title}
      handleChange={saveTitle}
    />

    <Authors
      authors={authors}
      authorAffiliations={authorAffiliations}
      startEditing={startEditing}
    />

    <Affiliations affiliations={affiliations} />

    <Manage
      heading={'Manage Authors'}
      isOpen={editing}
      handleDone={stopEditing}
      handleClose={stopEditing}
      sidebar={
        <AuthorsSidebar
          authors={authors}
          authorAffiliations={authorAffiliations}
          createAuthor={createAuthor}
          removeAuthor={removeAuthor}
          selectAuthor={selectAuthor}
        />
      }
      main={
        selectedAuthor && (
          <AuthorForm
            manuscript={manuscript.id}
            author={selectedAuthor}
            affiliations={affiliations}
            authorAffiliations={
              authorAffiliations.get(selectedAuthor.id) as AuthorAffiliation[]
            }
            handleSave={handleSaveAuthor}
            createAffiliation={createAffiliation}
          />
        )
      }
    />
  </Header>
)
