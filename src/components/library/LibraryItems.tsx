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

import ReferenceLibraryIcon from '@manuscripts/assets/react/ReferenceLibraryIcon'
import SearchIcon from '@manuscripts/assets/react/SearchIcon'
import {
  BibliographyItem,
  LibraryCollection,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { fullAuthorsString, issuedYear } from '../../lib/library'
import { styled } from '../../theme/styled-components'
import { Search, SearchContainer } from './Search'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const Items = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Item = styled.div`
  cursor: pointer;
  padding: ${props => props.theme.grid.unit * 3}px;
  border-bottom: 1px solid ${props => props.theme.colors.border.secondary};
  transition: background-color 0.25s;
  display: flex;

  &:hover {
    background-color: ${props => props.theme.colors.background.fifth};
    border-color: ${props => props.theme.colors.border.primary};
  }
`

const ItemMetadata = styled.div`
  flex: 1;
`

const Metadata = styled.div`
  margin-top: ${props => props.theme.grid.unit}px;
  color: ${props => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${props => props.theme.font.weight.light};
`

const Collections = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.grid.unit * 2}px;
`

const Collection = styled.span`
  border-radius: ${props => props.theme.grid.radius.default};
  display: inline-flex;
  align-items: center;
  padding: 2px ${props => props.theme.grid.unit * 2}px;
  margin-right: ${props => props.theme.grid.unit * 2}px;
  background-color: ${props => props.theme.colors.border.secondary};
  font-size: 90%;
`

const ActiveCollection = styled(Collection)`
  background-color: ${props => props.theme.colors.brand.default};
  color: ${props => props.theme.colors.text.onDark};
`

const ItemIcon = styled.div`
  flex-shrink: 1;
  margin-right: ${props => props.theme.grid.unit * 4}px;
  height: ${props => props.theme.grid.unit * 6}px;
  width: ${props => props.theme.grid.unit * 6}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const StyledReferenceLibraryIcon = styled(ReferenceLibraryIcon)`
  path {
    stroke: ${props => props.theme.colors.text.muted};
  }
`

const EmptyItems = styled.div`
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${props => props.theme.grid.unit * 4}px;
`

export const LibraryItems: React.FC<{
  query?: string
  setQuery: (query: string) => void
  handleSelect: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
  items: BibliographyItem[]
  filterID?: string
  projectLibraryCollections: Map<string, LibraryCollection>
}> = ({
  query,
  setQuery,
  handleSelect,
  items,
  filterID,
  projectLibraryCollections,
}) => (
  <Container>
    <SearchContainer>
      <SearchIcon />
      <Search
        type={'search'}
        value={query || ''}
        onChange={e => setQuery(e.target.value)}
        placeholder={'Search library…'}
        autoComplete={'off'}
      />
    </SearchContainer>

    {query && items.length === 0 && (
      <EmptyItems>No items match this query.</EmptyItems>
    )}

    {items.length > 0 && (
      <Items>
        {items.map((item: BibliographyItem) => (
          <Item onClick={() => handleSelect(item)} key={item._id}>
            <ItemIcon>
              <StyledReferenceLibraryIcon />
            </ItemIcon>
            <ItemMetadata>
              <Title value={item.title || 'Untitled'} title={item.title} />

              <Metadata data-cy={'search-result-author'}>
                {[
                  fullAuthorsString(item),
                  item['container-title'],
                  issuedYear(item),
                ]
                  .filter(part => part)
                  .join(', ')}
              </Metadata>

              {item.keywordIDs && (
                <Collections>
                  {item.keywordIDs.map(keywordID => {
                    const libraryCollection = projectLibraryCollections.get(
                      keywordID
                    )

                    if (!libraryCollection) {
                      return null
                    }

                    if (keywordID === filterID) {
                      return (
                        <ActiveCollection key={keywordID}>
                          {libraryCollection.name}
                        </ActiveCollection>
                      )
                    }

                    return (
                      <Collection key={keywordID}>
                        {libraryCollection.name}
                      </Collection>
                    )
                  })}
                </Collections>
              )}
            </ItemMetadata>
          </Item>
        ))}
      </Items>
    )}
  </Container>
)
