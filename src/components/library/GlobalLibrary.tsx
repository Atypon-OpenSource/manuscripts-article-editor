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
import { crossref } from '@manuscripts/manuscript-editor'
import { Build, buildBibliographyItem } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { filterLibrary } from '../../lib/search-library'
import { useStore } from '../../store'
import { Main } from '../Page'
import Search, { SearchWrapper } from '../Search'
import { SearchResults } from './SearchResults'

const Container = styled.div`
  flex: 1;
`

export const GlobalLibrary: React.FC<{
  debouncedQuery?: string
  globalLibraryItems: Map<string, BibliographyItem>
  projectLibrary: Map<string, BibliographyItem>
  query?: string
  setQuery: (query: string) => void
}> = React.memo(
  ({ debouncedQuery, globalLibraryItems, projectLibrary, query, setQuery }) => {
    const [error, setError] = useState<string>()
    const [fetching, setFetching] = useState<Set<string>>(new Set())
    const [selected, setSelected] = useState<Map<string, BibliographyItem>>()
    const [results, setResults] = useState<{
      items: BibliographyItem[]
      total: number
    }>()

    const [filterID] = useStore<string>((store) => store.filterID || '')
    const [sourceID] = useStore<string>((store) => store.sourceID || '')

    const [{ projectID, saveBiblioItem }] = useStore((store) => ({
      projectID: store.projectID,
      saveBiblioItem: store.saveBiblioItem,
    }))

    useEffect(() => {
      filterLibrary(
        globalLibraryItems,
        debouncedQuery,
        new Set([filterID || sourceID])
      )
        .then((items) => {
          setResults({
            items,
            total: items.length, // TODO: may be truncated
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }, [filterID, globalLibraryItems, debouncedQuery, sourceID])

    const handleAdd = useCallback(
      (item: Build<BibliographyItem>) => saveBiblioItem(item, projectID),
      [projectID, saveBiblioItem]
    )

    const handleQueryChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
      },
      [setQuery]
    )

    // const handleSelect = useCallback(() => {}, [])

    useEffect(() => {
      const selected = new Map<string, BibliographyItem>()

      for (const item of projectLibrary.values()) {
        selected.set(estimateID(item), item)
      }

      setSelected(selected)
    }, [projectLibrary])

    const handleSelect = useCallback(
      (id: string, item: Build<BibliographyItem>) => {
        if (!selected) {
          throw new Error('Selected map not built')
        }

        const estimatedID = estimateID(item as Partial<BibliographyItem>)

        if (selected.has(estimatedID)) {
          return
        }

        setFetching((fetching) => {
          fetching.add(estimatedID)
          return new Set<string>([...fetching])
        })

        crossref
          .fetch(item as Partial<BibliographyItem>)
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
            // TODO: 'failed' state
            console.error('failed to add', error)
            setError('There was an error saving this item to the library')
          })
      },
      [handleAdd, selected]
    )

    if (!results) {
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
              placeholder={'Search my library'}
              type={'search'}
              value={query || ''}
            />
          </SearchWrapper>

          <SearchResults
            error={error}
            fetching={fetching}
            handleSelect={handleSelect}
            results={results}
            searching={false}
            selected={selected}
          />
        </Container>
      </Main>
    )
  }
)
