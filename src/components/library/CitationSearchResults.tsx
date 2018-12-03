import PlusIcon from '@manuscripts/assets/react/PlusIcon'
import { Build } from '@manuscripts/manuscript-editor'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { altoGrey, manuscriptsBlue } from '../../colors'
import { estimateID, issuedYear, shortAuthorsString } from '../../lib/library'
import { styled } from '../../theme'

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

const Container = styled.div`
  //height: 200px;
`

const ResultMetadata = styled.div`
  flex: 1;
  overflow: hidden;
`

const StyledPlusIcon = styled(PlusIcon)<{ selected: boolean }>`
  flex-shrink: 1;
  width: 24px;
  height: 24px;
  margin-right: 16px;

  & path {
    fill: ${props => (props.selected ? manuscriptsBlue : 'transparent')};
  }
`

const ResultPlaceholder = () => (
  <SearchResult style={{ opacity: 0.2 }}>
    <div style={{ width: 40 }}>…</div>

    <ResultMetadata>
      <div style={{ background: '#aaa', height: '1.2em' }} />
      <SearchResultAuthors style={{ background: altoGrey, height: '1.2em' }} />
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
}

export const CitationSearchResults: React.FunctionComponent<Props> = ({
  error,
  searching,
  results,
  addToSelection,
  selected,
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
            <StyledPlusIcon data-cy={'plus-icon'} selected={selected.has(id)} />

            <ResultMetadata>
              <SearchResultTitle
                value={item.title || 'Untitled'}
                title={item.title}
              />

              <SearchResultAuthors>
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
