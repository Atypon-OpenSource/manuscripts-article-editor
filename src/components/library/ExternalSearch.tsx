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

import { estimateID } from '@manuscripts/library'
import { Build, buildBibliographyItem } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import config from '../../config'
import { LibrarySource, sources } from '../../lib/sources'
import { Collection } from '../../sync/Collection'
import { Main } from '../Page'
import Search, { SearchWrapper } from '../Search'
import { SearchResults } from './SearchResults'

export const ExternalSearch: React.FC<
  RouteComponentProps<{
    projectID: string
    sourceID?: string
  }> & {
    projectLibrary: Map<string, BibliographyItem>
    projectLibraryCollection: Collection<BibliographyItem>
    debouncedQuery?: string
    query?: string
    setQuery: (query: string) => void
  }
> = React.memo(
  ({
    debouncedQuery,
    match: {
      params: { projectID, sourceID },
    },
    projectLibrary,
    projectLibraryCollection,
    query,
    setQuery,
  }) => {
    const [error, setError] = useState<string>()
    const [searching, setSearching] = useState(false)
    const [fetching, setFetching] = useState(new Set<string>())
    const [selected, setSelected] = useState<Map<string, BibliographyItem>>()
    const [results, setResults] = useState<{
      items: Array<Build<BibliographyItem>>
      total: number
    }>()
    const [source, setSource] = useState<LibrarySource>()

    useEffect(() => {
      const source = sources.find((item) => item.id === sourceID)
      setSource(source)
    }, [sourceID])

    useEffect(() => {
      const selected = new Map<string, BibliographyItem>()

      for (const item of projectLibrary.values()) {
        selected.set(estimateID(item), item)
      }

      setSelected(selected)
    }, [projectLibrary])

    useEffect(() => {
      setError(undefined)
      setResults(undefined)
      setSearching(Boolean(query))
    }, [query, sourceID])

    useEffect(() => {
      if (source && debouncedQuery) {
        source
          .search(debouncedQuery, 20, config.support.email)
          .then((result) => {
            setResults(result)
          })
          .catch((error) => {
            console.error(error)
            setError('There was an error running this search')
          })
          .finally(() => {
            setSearching(false)
          })
          .catch((error) => {
            console.error(error)
            setError('There was an error running this search')
          })
      }
    }, [debouncedQuery, source])

    const handleAdd = useCallback(
      (item: Build<BibliographyItem>) =>
        projectLibraryCollection.create(item, {
          containerID: projectID,
        }),
      [projectID, projectLibraryCollection]
    )

    const handleSelect = useCallback(
      (id: string, item: Build<BibliographyItem>) => {
        if (!source) {
          throw new Error('No source defined')
        }

        if (!selected) {
          throw new Error('Selected map not built')
        }

        const estimatedID = estimateID(item as Partial<BibliographyItem>)

        if (selected.has(estimatedID)) {
          return // already added
        }

        setFetching((fetching) => {
          fetching.add(estimatedID)
          return new Set<string>([...fetching])
        })

        source
          .fetch(item as Partial<BibliographyItem>, config.support.email)
          .then((data) => {
            const item = buildBibliographyItem(data)

            return handleAdd(item)
          })
          .then(() => {
            window.setTimeout(() => {
              setFetching((fetching) => {
                fetching.delete(estimatedID)
                return new Set<string>([...fetching])
              })
            }, 100)
          })
          .catch((error: Error) => {
            console.error('failed to add', error)
            setError('There was an error saving this item to the library')
          })
      },
      [handleAdd, selected, source]
    )

    const handleQueryChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
      },
      [setQuery]
    )

    if (!source) {
      return null
    }

    if (!selected) {
      return null
    }

    return (
      <Main>
        <Container>
          <SearchWrapper>
            <Search
              autoComplete={'off'}
              autoFocus={true}
              handleSearchChange={handleQueryChange}
              placeholder={`Search ${source.name}`}
              type={'search'}
              value={query || ''}
            />
          </SearchWrapper>

          <SearchResults
            error={error}
            fetching={fetching}
            handleSelect={handleSelect}
            results={results}
            searching={searching}
            selected={selected}
          />
        </Container>
      </Main>
    )
  }
)

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`
