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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import AddIcon from '@manuscripts/assets/react/AddIcon'
import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { estimateID, issuedYear, shortAuthorsString } from '../../lib/library'
import { styled } from '../../theme/styled-components'

const SearchResult = styled.div`
  padding: 0 8px;
  cursor: pointer;
  padding: 8px 0;
  display: flex;

  &:not(:last-of-type) {
    border-bottom: 1px solid #f6f6f6;
  }
`

const SearchResultTitle = styled(Title)`
  & .ProseMirror {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const SearchResultAuthors = styled.div`
  margin-top: 4px;
  color: #777;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const SearchResultAuthorsPlaceholder = styled(SearchResultAuthors)`
  background: ${props => props.theme.colors.citationSearch.placeholder};
  height: 1.2em;
`

const Container = styled.div`
  //height: 200px;
`

const ResultMetadata = styled.div`
  flex: 1;
  overflow: hidden;
`

const StatusIcon = styled.span<{ isFetching?: boolean }>`
  flex-shrink: 1;
  margin-right: 16px;
  position: relative;
  top: 2px;

  & svg {
    width: 24px;
    height: 24px;
  }

  transform-origin: 51% 29%;
  animation: ${props =>
    props.isFetching ? 'spin 4s infinite linear' : 'none'};

  @keyframes spin {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }
`

const ResultPlaceholder = () => (
  <SearchResult style={{ opacity: 0.2 }}>
    <div style={{ width: 40 }}>…</div>

    <ResultMetadata>
      <div style={{ background: '#aaa', height: '1.2em' }} />
      <SearchResultAuthorsPlaceholder />
    </ResultMetadata>
  </SearchResult>
)

interface Props {
  error: string | null
  searching: boolean
  results: {
    items: Array<Build<BibliographyItem>>
    total: number
  } | null
  addToSelection: (id: string, item: Build<BibliographyItem>) => void
  selected: Map<string, Build<BibliographyItem>>
  fetching: Set<string>
}

export const CitationSearchResults: React.FunctionComponent<Props> = ({
  error,
  searching,
  results,
  addToSelection,
  selected,
  fetching,
}) => {
  if (error) {
    return <div>{error}</div>
  }

  if (searching) {
    return (
      <Container>
        <ResultPlaceholder />
        <ResultPlaceholder />
        <ResultPlaceholder />
      </Container>
    )
  }

  if (!results || !results.items || !results.items.length) {
    return <Container />
  }

  return (
    <Container>
      {results.items.map(item => {
        const id = estimateID(item)

        return (
          <SearchResult onClick={() => addToSelection(id, item)} key={id}>
            <StatusIcon isFetching={fetching.has(id)}>
              {selected.has(id) ? (
                <AddedIcon data-cy={'plus-icon-ok'} />
              ) : (
                <AddIcon data-cy={'plus-icon'} />
              )}
            </StatusIcon>

            <ResultMetadata>
              <SearchResultTitle
                value={item.title || 'Untitled'}
                title={item.title}
              />

              <SearchResultAuthors data-cy={'search-result-author'}>
                {shortAuthorsString(item)}{' '}
                {issuedYear(item as BibliographyItem)}
              </SearchResultAuthors>
            </ResultMetadata>
          </SearchResult>
        )
      })}
    </Container>
  )
}
