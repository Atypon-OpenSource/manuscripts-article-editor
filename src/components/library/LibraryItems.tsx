import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme'
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
