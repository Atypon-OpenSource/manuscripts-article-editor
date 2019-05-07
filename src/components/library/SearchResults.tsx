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

const SearchResultTitle = styled(Title)<{ whiteSpace: string }>`
  & .ProseMirror {
    white-space: ${props => props.whiteSpace};
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const SearchResultAuthors = styled.div<{ whiteSpace: string }>`
  margin-top: 4px;
  color: #777;
  flex: 1;
  white-space: ${props => props.whiteSpace};
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

const StatusIcon = styled.span<{ color: string }>`
  flex-shrink: 1;
  margin-right: 16px;
  position: relative;
  top: 2px;
  height: 24px;
  width: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 50%;
  background: white;

  & svg {
    width: 24px;
    height: 24px;
  }

  &.active:before {
    position: absolute;
    content: '';
    height: 100%;
    width: 100%;
    border: 1px dashed ${props => props.color};
    top: -1px;
    left: -1px;
    border-radius: inherit;
    animation: spin 10s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotateZ(360deg);
    }
  }
`

const ResultPlaceholder: React.FC<{ whiteSpace: string }> = ({
  whiteSpace,
}) => (
  <SearchResult style={{ opacity: 0.2 }}>
    <div style={{ width: 40 }}>…</div>

    <ResultMetadata>
      <div style={{ background: '#aaa', height: '1.2em' }} />
      <SearchResultAuthorsPlaceholder whiteSpace={whiteSpace} />
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
  whiteSpace?: string
}

export const SearchResults: React.FunctionComponent<Props> = ({
  error,
  searching,
  results,
  addToSelection,
  selected,
  fetching,
  whiteSpace = 'nowrap',
}) => {
  if (error) {
    return <div>{error}</div>
  }

  if (searching) {
    return (
      <Container>
        <ResultPlaceholder whiteSpace={whiteSpace} />
        <ResultPlaceholder whiteSpace={whiteSpace} />
        <ResultPlaceholder whiteSpace={whiteSpace} />
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
            <StatusIcon
              color="#7fb5db"
              className={fetching.has(id) ? 'active' : ''}
            >
              {selected.has(id) ? (
                <AddedIcon data-cy={'plus-icon-ok'} />
              ) : (
                <AddIcon data-cy={'plus-icon'} />
              )}
            </StatusIcon>

            <ResultMetadata>
              <SearchResultTitle
                whiteSpace={whiteSpace}
                value={item.title || 'Untitled'}
                title={item.title}
              />

              <SearchResultAuthors
                data-cy={'search-result-author'}
                whiteSpace={whiteSpace}
              >
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
