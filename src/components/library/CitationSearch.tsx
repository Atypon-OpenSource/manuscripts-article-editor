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

import { crossref } from '@manuscripts/manuscript-editor'
import { Build, buildBibliographyItem } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import {
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  Tip,
} from '@manuscripts/style-guide'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import config from '../../config'
import { estimateID } from '../../lib/library'
import Search, { SearchWrapper } from '../Search'
import { BibliographyImportButton } from './BibliographyImportButton'
import { CitationSearchSection } from './CitationSearchSection'

const Results = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const Actions = styled(ButtonGroup)`
  align-items: center;
  box-shadow: 0 -2px 12px 0 rgba(216, 216, 216, 0.26);
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.grid.unit * 4}px;
`

const Container = styled.div`
  flex: 1;
  font-family: ${props => props.theme.font.family.sans};
`

interface Props {
  importItems: () => void
  importing: boolean
}

const ImportButton: React.FunctionComponent<Props> = ({
  importItems,
  importing,
}) => (
  <SecondaryButton onClick={importItems}>
    <Tip
      title={'Import bibliography data from a BibTeX or RIS file'}
      placement={'top'}
    >
      {importing ? 'Importing…' : 'Import from File'}
    </Tip>
  </SecondaryButton>
)

type SearchInterface = (
  query: string,
  params: { rows: number; sort?: string },
  mailto: string
) => Promise<{ items: Array<Build<BibliographyItem>>; total: number }>

interface Source {
  id: string
  title: string
  search: SearchInterface
}

export const CitationSearch: React.FC<{
  filterLibraryItems: (query: string | null) => Promise<BibliographyItem[]>
  handleCite: (
    items: Array<BibliographyItem | Build<BibliographyItem>>,
    query?: string
  ) => Promise<void>
  query: string
  handleCancel: () => void
  importItems: (
    items: Array<Build<BibliographyItem>>
  ) => Promise<BibliographyItem[]>
}> = ({
  filterLibraryItems,
  handleCite,
  importItems: _importItems,
  query: initialQuery,
  handleCancel,
}) => {
  const [error, setError] = useState<string>()
  const [selectedSource, setSelectedSource] = useState<string>()
  const [query, setQuery] = useState<string>(initialQuery)
  const [selected, setSelected] = useState(
    new Map<string, Build<BibliographyItem>>()
  )
  const [fetching, setFetching] = useState(new Set<string>())
  const [sources, setSources] = useState<Source[]>()
  const [updated, setUpdated] = useState(Date.now())

  const searchLibrary: SearchInterface = useCallback(
    (query: string, params: { rows: number; sort?: string }) => {
      return filterLibraryItems(query).then(items => ({
        items: items.slice(0, params.rows),
        total: items.length,
      }))
    },
    [filterLibraryItems]
  )

  useEffect(() => {
    const sources: Source[] = [
      {
        id: 'library',
        title: 'Library',
        search: searchLibrary,
      },
    ]

    if (query.trim().length > 2) {
      sources.push({
        id: 'crossref',
        title: 'External sources',
        search: (
          query: string,
          params: { rows: number; sort?: string },
          mailto: string
        ) => crossref.search(query, params.rows, mailto),
      })
    }

    setSources(sources)
  }, [query])

  const addToSelection = useCallback(
    (id: string, data: Partial<BibliographyItem>) => {
      if (selected.has(id)) {
        selected.delete(id) // remove item
        setSelected(
          new Map<string, Build<BibliographyItem>>([...selected])
        )
      } else if (data._id) {
        selected.set(id, data as Build<BibliographyItem>) // re-use existing data model
        setSelected(
          new Map<string, Build<BibliographyItem>>([...selected])
        )
      } else {
        setFetching(fetching => {
          fetching.add(id)
          return new Set<string>([...fetching])
        })

        // fetch Citeproc JSON
        crossref
          .fetch(data, config.support.email)
          .then(result => {
            // remove DOI URLs
            if (
              result.URL &&
              result.URL.match(/^https?:\/\/(dx\.)?doi\.org\//)
            ) {
              delete result.URL
            }

            setSelected(selected => {
              selected.set(id, buildBibliographyItem(result))
              return new Map<string, Build<BibliographyItem>>([...selected])
            })

            window.setTimeout(() => {
              setFetching(fetching => {
                fetching.delete(id)
                return new Set<string>([...fetching])
              })
            }, 100)
          })
          .catch(error => {
            setError(error.message)
          })
      }
    },
    [selected]
  )

  const handleCiteClick = useCallback(() => {
    const items = Array.from(selected.values())

    return handleCite(items)
  }, [handleCite, selected])

  const handleQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }, [])

  const importItems = useCallback(
    (items: Array<Build<BibliographyItem>>) => {
      return _importItems(items).then(newItems => {
        setSelected(selected => {
          // if there's a single new imported item, select it
          if (newItems.length === 1) {
            const [newItem] = newItems
            const estimatedID = estimateID(newItem)
            selected.set(estimatedID, newItem)
          }

          return new Map<string, Build<BibliographyItem>>([...selected])
        })

        // clear the query after importing items
        setQuery('')

        // ensure that the filters re-run
        setUpdated(Date.now())

        return newItems
      })
    },
    [_importItems]
  )

  if (!sources) {
    return null
  }

  return (
    <Container>
      <SearchWrapper>
        <Search
          autoComplete={'off'}
          handleSearchChange={handleQuery}
          placeholder={'Search'}
          type={'search'}
          value={query || ''}
        />
      </SearchWrapper>

      <Results>
        {error && <div>{error}</div>}

        {sources.map(source => (
          <CitationSearchSection
            key={`${source.id}-${updated}`}
            source={source}
            addToSelection={addToSelection}
            selectSource={() => setSelectedSource(source.id)}
            selected={selected}
            fetching={fetching}
            query={query}
            rows={selectedSource === source.id ? 25 : 3}
          />
        ))}
      </Results>
      <Actions>
        <ButtonGroup>
          <BibliographyImportButton
            importItems={importItems}
            setError={setError}
            component={ImportButton}
          />
        </ButtonGroup>

        <ButtonGroup>
          <SecondaryButton onClick={handleCancel}>Close</SecondaryButton>

          <PrimaryButton
            onClick={handleCiteClick}
            disabled={selected.size === 0}
          >
            Cite
          </PrimaryButton>
        </ButtonGroup>
      </Actions>
    </Container>
  )
}
