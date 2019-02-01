import {
  BibliographicName,
  BibliographyItem,
} from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import Bookmark from '../../icons/bookmark'
import { issuedYear } from '../../lib/library'
import { styled } from '../../theme/styled-components'

const AddIcon = styled.button`
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 2px;
  cursor: pointer;
  margin-right: 8px;
  background: none;

  &:focus {
    outline: none;
  }
`

const Container = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  display: flex;
  transition: background-color 0.1s;
`

const LibraryItemTitle = styled(Title)`
  font-weight: bold;
`

const LibraryItemAuthors = styled.div`
  margin-top: 4px;
  color: #777;
`

const LibraryItemAuthor = styled.span``

interface LibraryItemProps {
  item: BibliographyItem
  handleSelect: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
}

export const LibraryItem: React.FunctionComponent<LibraryItemProps> = ({
  item,
  handleSelect,
  hasItem,
}) => (
  <Container
    onMouseDown={event => {
      event.preventDefault()
      handleSelect(item)
    }}
  >
    <div>
      <AddIcon>
        <Bookmark color={hasItem(item) ? '#65a3ff' : '#444'} size={24} />
      </AddIcon>
    </div>

    <div>
      <LibraryItemTitle value={item.title || 'Untitled'} />

      <LibraryItemAuthors>
        <span>{issuedYear(item)}</span>

        {item.author &&
          item.author.map((author: BibliographicName, index: number) => (
            <LibraryItemAuthor key={`author.${index}`}>
              {!!index && ', '}
              {author.literal || [author.given, author.family].join(' ')}
            </LibraryItemAuthor>
          ))}
      </LibraryItemAuthors>
    </div>
  </Container>
)
