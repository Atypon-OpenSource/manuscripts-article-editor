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

import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { LibraryItem } from './LibraryItem'
import LibraryKeywords from './LibraryKeywords'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`

const Search = styled.input`
  margin: 5px;
  padding: 4px;
  font-size: 0.9em;
  flex: 1;
  -webkit-appearance: none;
  border: 1px solid #ccc;
  border-radius: 5px;
`

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
`

interface Props {
  query: string
  handleQuery: (query: string) => void
  handleSelect: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
  items: BibliographyItem[]
  projectID: string
}

export const LibraryItems: React.FunctionComponent<Props> = ({
  query,
  handleQuery,
  handleSelect,
  hasItem,
  items,
  projectID,
}) => (
  <Container>
    <SearchContainer>
      <Search
        type={'search'}
        value={query || ''}
        onChange={e => handleQuery(e.target.value)}
        placeholder={'Search library…'}
        autoComplete={'off'}
      />
    </SearchContainer>

    <LibraryKeywords
      items={items}
      handleQuery={handleQuery}
      projectID={projectID}
    />

    <Results>
      {items
        .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
        .map((item: BibliographyItem) => (
          <LibraryItem
            key={item._id}
            item={item}
            handleSelect={handleSelect}
            hasItem={hasItem}
          />
        ))}
    </Results>
  </Container>
)
