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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import AddIcon from '@manuscripts/assets/react/AddIcon'
import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { estimateID, libraryItemMetadata } from '../../lib/library'
import { styled } from '../../theme/styled-components'

const SearchResult = styled.div`
  cursor: pointer;
  padding: ${props => props.theme.grid.unit * 2}px 0;
  display: flex;

  &:not(:last-of-type) {
    border-bottom: 1px solid #f6f6f6;
  }
`

const SearchResultAuthors = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${props => props.theme.font.weight.light};
  margin-top: ${props => props.theme.grid.unit}px;
`

const ResultAuthorsPlaceholder = styled(SearchResultAuthors)`
  background: ${props => props.theme.colors.text.muted};
  height: 1.2em;
`

const ResultTitlePlaceholder = styled.div`
  background: ${props => props.theme.colors.border.primary};
  height: 1.2em;
`

const ResultMetadata = styled.div`
  flex: 1;
`

const Fetching = styled.div`
  display: inline-block;
  height: ${props => props.theme.grid.unit * 6}px;
  width: ${props => props.theme.grid.unit * 6}px;
  border: 1px dashed ${props => props.theme.colors.brand.default};
  box-sizing: border-box;
  border-radius: 50%;
  animation: spin 10s linear infinite;

  @keyframes spin {
    100% {
      transform: rotateZ(360deg);
    }
  }
`

const StatusIcon = styled.div`
  flex-shrink: 1;
  margin-right: ${props => props.theme.grid.unit * 3}px;
  height: ${props => props.theme.grid.unit * 6}px;
  width: ${props => props.theme.grid.unit * 6}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const Results = styled.div`
  padding: 0 ${props => props.theme.grid.unit * 4}px;
  flex: 1;
  overflow-y: auto;
`

const Error = styled.div`
  padding: 0 ${props => props.theme.grid.unit * 3}px;
`

const ResultPlaceholder: React.FC = () => (
  <SearchResult style={{ opacity: 0.2 }}>
    <div style={{ width: 40 }}>…</div>

    <ResultMetadata>
      <ResultTitlePlaceholder />
      <ResultAuthorsPlaceholder />
    </ResultMetadata>
  </SearchResult>
)

const chooseStatusIcon = (
  fetching: Set<string>,
  selected: Map<string, Build<BibliographyItem>>,
  id: string
) => {
  if (fetching.has(id)) {
    return <Fetching />
  }

  if (selected.has(id)) {
    return <AddedIcon data-cy={'plus-icon-ok'} width={24} height={24} />
  }

  return <AddIcon data-cy={'plus-icon'} width={24} height={24} />
}

export const SearchResults: React.FC<{
  error?: string
  searching: boolean
  results?: {
    items: Array<Partial<BibliographyItem>>
    total: number
  }
  handleSelect: (id: string, item: Partial<BibliographyItem>) => void
  selected: Map<string, Build<BibliographyItem>>
  fetching: Set<string>
}> = ({ error, searching, results, handleSelect, selected, fetching }) => {
  if (error) {
    // TODO: keep results if error while fetching
    return <Error>{error}</Error>
  }

  if (searching) {
    return (
      <Results>
        <ResultPlaceholder />
        <ResultPlaceholder />
        <ResultPlaceholder />
      </Results>
    )
  }

  if (!results || !results.items || !results.items.length) {
    return null
  }

  return (
    <Results>
      {results.items.map(item => {
        const id = estimateID(item)

        return (
          <SearchResult onClick={() => handleSelect(id, item)} key={id}>
            <StatusIcon>{chooseStatusIcon(fetching, selected, id)}</StatusIcon>

            <ResultMetadata>
              <Title value={item.title || 'Untitled'} title={item.title} />

              <SearchResultAuthors data-cy={'search-result-author'}>
                {libraryItemMetadata(item)}
              </SearchResultAuthors>
            </ResultMetadata>
          </SearchResult>
        )
      })}
    </Results>
  )
}
