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
import { SecondaryButton } from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import config from '../../config'
import { SearchResults } from './SearchResults'

const ResultsSection = styled.div`
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
`

const SearchSource = styled.div`
  margin: 0 ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 2}px;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.text.muted};
  }
`

const MoreButton = styled(SecondaryButton)`
  font-size: inherit;
  text-transform: none;
  text-decoration: underline;
  border: none;
  margin-left: ${(props) => props.theme.grid.unit * 4}px;
  color: ${(props) => props.theme.colors.button.default.color.default};
`

const DropdownChevron = styled(ArrowDownBlack)`
  margin-right: ${(props) => props.theme.grid.unit * 4}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
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
  addToSelection: (id: string, item: Build<BibliographyItem>) => void
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

  useEffect(() => {
    setError(undefined)
    setResults(undefined)
    setSearching(query !== '')
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

  const requests = useMemo<undefined[]>(() => [], [])

  useEffect(() => {
    if (!expanded) {
      return
    }

    if (source.id !== 'library' && !query) {
      return
    }

    requests.push(undefined)
    source
      .search(query, { rows }, config.support.email)
      .then((results) => {
        handleSearchResults(query, results)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        requests.pop()
        setSearching(false)
      })
      .catch((error) => {
        setError(error.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, expanded, handleSearchResults, rows, requests])

  const toggleExpanded = useCallback(() => {
    setExpanded((value) => !value)
  }, [])

  const showMoreCallback = useCallback(() => {
    selectSource(source.id)
    setSearching(true)
  }, [selectSource, source.id])

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
        <>
          {(requests.length > 1 && (
            <SearchingLabel>Searching....</SearchingLabel>
          )) ||
            (rows < 25 && (
              <MoreButton onClick={showMoreCallback} data-cy={'more-button'}>
                Show more
              </MoreButton>
            ))}
        </>
      )}
    </ResultsSection>
  )
}

const SearchingLabel = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  margin: ${(props) => props.theme.grid.unit * 4}px 0
    ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 7}px;
`
