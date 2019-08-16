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

import SearchIcon from '@manuscripts/assets/react/SearchIcon'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import { styled } from '../../theme/styled-components'
import LibraryItem from './LibraryItem'

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
  border: none;
`

const Results = styled.div`
  flex: 1;
  overflow-y: auto;
`

interface Props {
  query: string | null
  handleQuery: (query: string) => void
  handleSelect: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
  items: BibliographyItem[]
  projectID: string
  selectedKeywords?: Set<string>
}

export const LibraryItems: React.FC<Props> = ({
  query,
  handleQuery,
  handleSelect,
  hasItem,
  items,
  projectID,
  selectedKeywords,
}) => (
  <ProjectKeywordsData projectID={projectID}>
    {keywordIdMap => {
      return (
        <Container>
          <SearchContainer>
            <SearchIcon />
            <Search
              type={'search'}
              value={query || ''}
              onChange={e => handleQuery(e.target.value)}
              placeholder={'Search library…'}
              autoComplete={'off'}
            />
          </SearchContainer>

          <Results>
            {items
              .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
              .map((item: BibliographyItem) => (
                <LibraryItem
                  key={item._id}
                  item={item}
                  handleSelect={handleSelect}
                  hasItem={hasItem}
                  selectedKeywords={selectedKeywords}
                  keywordIdMap={keywordIdMap}
                />
              ))}
          </Results>
        </Container>
      )
    }}
  </ProjectKeywordsData>
)
