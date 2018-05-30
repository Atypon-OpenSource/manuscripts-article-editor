import React from 'react'
import { KeywordsProps, withKeywords } from '../store/KeywordsProvider'
import { styled } from '../theme'
import { Keyword } from '../types/components'
import { LibraryDocument } from '../types/library'

const buildCounts = (items: LibraryDocument[]) => {
  const counts: Map<string, number> = new Map()

  items.forEach(item => {
    const ids = item.get('keywordIDs') as string[]

    if (ids) {
      ids.forEach(id => {
        counts.set(id, (counts.get(id) || 0) + 1)
      })
    }
  })

  return counts
}

const Container = styled.div`
  padding: 16px;
`

const LibraryKeywordText = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`

const LibraryKeywordCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 141, 54, 0.7);
  color: white;
  min-width: 1em;
  height: 100%;
  padding: 4px 4px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`

const LibraryKeyword = styled.span`
  display: inline-flex;
  align-items: center;
  background: white;
  box-shadow: 0 1px 3px #ccc;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover ${LibraryKeywordCount} {
    background: rgba(255, 141, 54, 1);
  }
`

interface Props {
  items: LibraryDocument[]
  handleQuery: (query: string) => void
}

const LibraryKeywords: React.SFC<Props & KeywordsProps> = ({
  items,
  handleQuery,
  keywords,
}) => {
  const counts = buildCounts(items)

  const sortByCount = (a: string, b: string) => {
    return (counts.get(b) as number) - (counts.get(a) as number)
  }

  const sortedKeywords = Array.from(counts.keys())
    .filter(id => keywords.data.has(id))
    .sort(sortByCount)
    .map(id => keywords.data.get(id))

  if (!sortedKeywords.length) return null

  return (
    <Container>
      {sortedKeywords.map((keyword: Keyword) => (
        <LibraryKeyword
          key={keyword.id}
          onClick={() => handleQuery('keyword:' + keyword.id)}
        >
          <LibraryKeywordText>{keyword.name}</LibraryKeywordText>
          <LibraryKeywordCount>{counts.get(keyword.id)}</LibraryKeywordCount>
        </LibraryKeyword>
      ))}
    </Container>
  )
}

export default withKeywords<Props>(LibraryKeywords)
