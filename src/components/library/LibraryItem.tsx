import React from 'react'
import Title from '../../editor/title/Title'
import Bookmark from '../../icons/bookmark'
import { styled } from '../../theme'
import { BibliographicName, BibliographyItem } from '../../types/components'

export const AddIcon = styled.button`
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

  &:hover {
    background: #eee;
  }
`

export const LibraryItemTitle = styled(Title)`
  font-weight: bold;
`

export const LibraryItemAuthors = styled.div`
  margin-top: 4px;
  color: #777;
`

export const LibraryItemAuthor = styled.span``

export const getYear = (item: BibliographyItem) => {
  if (
    !item.issued ||
    !item.issued['date-parts'] ||
    !item.issued['date-parts']![0] ||
    !item.issued['date-parts']![0][0]
  ) {
    return null
  }

  return item.issued['date-parts']![0][0] + ' / '
}

interface LibraryItemProps {
  item: BibliographyItem
  handleSelect: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
}

export const LibraryItem: React.SFC<LibraryItemProps> = ({
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
        <span>{getYear(item)}</span>

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
