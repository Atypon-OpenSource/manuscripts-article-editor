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

import { BibliographyItem, Keyword } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import { styled } from '../../theme/styled-components'

const buildCounts = (items: BibliographyItem[]) => {
  const counts: Map<string, number> = new Map()

  items.forEach(item => {
    const ids = item.keywordIDs as string[]

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
  items: BibliographyItem[]
  handleQuery: (query: string) => void
  projectID: string
}

const LibraryKeywords: React.FunctionComponent<Props> = ({
  items,
  handleQuery,
  projectID,
}) => (
  <ProjectKeywordsData projectID={projectID}>
    {keywords => {
      const counts = buildCounts(items)

      const sortByCount = (a: string, b: string) => {
        return (counts.get(b) as number) - (counts.get(a) as number)
      }

      const sortedKeywords = Array.from(counts.keys())
        .filter(id => keywords.has(id))
        .sort(sortByCount)
        .map(id => keywords.get(id))

      if (!sortedKeywords.length) return null

      return (
        <Container>
          {sortedKeywords.map((keyword: Keyword) => (
            <LibraryKeyword
              key={keyword._id}
              onClick={() => handleQuery('keyword:' + keyword._id)}
            >
              <LibraryKeywordText>{keyword.name}</LibraryKeywordText>
              <LibraryKeywordCount>
                {counts.get(keyword._id)}
              </LibraryKeywordCount>
            </LibraryKeyword>
          ))}
        </Container>
      )
    }}
  </ProjectKeywordsData>
)

export default LibraryKeywords
