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

import ArrowDownBlack from '@manuscripts/assets/react/ArrowDownBlack'
import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Button } from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useState } from 'react'
import config from '../../config'
import { useDebounce } from '../../hooks/use-debounce'
import { styled } from '../../theme/styled-components'
import { SearchResults } from './SearchResults'

const ResultsSection = styled.div`
  margin: 8px 0;
`

const SearchSource = styled.div`
  margin: 0 16px 8px;
  color: #777;
  cursor: pointer;

  &:hover {
    color: #777;
  }
`

const MoreButton = styled(Button)`
  font-size: inherit;
  text-transform: none;
  text-decoration: underline;
  margin-left: 42px;
  color: ${props => props.theme.colors.citationSearch.more};
`

const DropdownChevron = styled(ArrowDownBlack)`
  margin-right: 16px;
  width: 24px;
`

export const CitationSearchSection: React.FC<{
  query: string
  source: {
    id: string
    search: (
      query: string,
      params: { rows: number; sort?: string },
      mailto: string
    ) => Promise<{ items: Array<Build<BibliographyItem>>; total: number }>
    title: string
  }
  addToSelection: (id: string, item: Partial<BibliographyItem>) => void
  selectSource: (id: string) => void
  rows: number
  selected: Map<string, Build<BibliographyItem>>
  fetching: Set<string>
}> = ({
  query,
  source,
  addToSelection,
  selectSource,
  rows,
  selected,
  fetching,
}) => {
  const [error, setError] = useState<string>()
  const [expanded, setExpanded] = useState(true)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<{
    items: Array<Build<BibliographyItem>>
    total: number
  }>()

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    setError(undefined)
    setResults(undefined)
    setSearching(Boolean(query))
  }, [query])

  const handleSearchResults = useCallback(
    (searchQuery, results) => {
      if (searchQuery === query) {
        setError(undefined)
        setSearching(false)
        setResults(results)
      }
    },
    [query]
  )

  useEffect(() => {
    if (!expanded) {
      return
    }

    if (source.id !== 'library' && !debouncedQuery) {
      return
    }

    const initialQuery = debouncedQuery

    source
      .search(initialQuery, { rows }, config.support.email)
      .then(results => {
        handleSearchResults(initialQuery, results)
      })
      .catch(error => {
        setError(error.message)
      })
      .finally(() => {
        setSearching(false)
      })
      .catch(error => {
        setError(error.message)
      })
  }, [debouncedQuery, rows])

  const toggleExpanded = useCallback(() => {
    setExpanded(value => !value)
  }, [])

  return (
    <ResultsSection>
      <SearchSource onClick={toggleExpanded}>
        <DropdownChevron
          style={{
            transform: expanded ? 'rotate(0)' : 'rotate(-90deg)',
          }}
        />
        {source.title}
      </SearchSource>

      {expanded && (
        <SearchResults
          error={error}
          results={results}
          searching={searching}
          handleSelect={addToSelection}
          selected={selected}
          fetching={fetching}
        />
      )}

      {expanded && results && results.total > rows && (
        <MoreButton
          onClick={() => selectSource(source.id)}
          data-cy={'more-button'}
        >
          Show more
        </MoreButton>
      )}
    </ResultsSection>
  )
}
