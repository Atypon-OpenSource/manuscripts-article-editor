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

import { BibliographyItem, Keyword } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import { styled } from '../../theme/styled-components'

const asNames = (items: BibliographyItem[]) => {
  const names: Set<string> = new Set<string>()

  items.forEach(item => {
    const ids = item.keywordIDs as string[]

    if (ids) {
      ids.forEach(id => {
        names.add(id)
      })
    }
  })

  return Array.from(names)
}

const sortByName = (a: Keyword, b: Keyword) => {
  return a.name.localeCompare(b.name)
}

const ListContainer = styled.div`
  margin: 0px -20px;
`

const TagText = styled.div`
  font-family: Barlow;
  font-size: 16px;
  border-radius: 4px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.sidebar.text.primary};
  padding: 0px 2px 0px 2px;
`

const ListBox = styled.div<{
  hasSelectedKeyword: boolean
  selectedKeywords?: Set<string>
  bgColor?: string
}>`
  padding: 3px 0px 3px 56px;
  background-color: ${props =>
    props.hasSelectedKeyword
      ? props.theme.colors.sidebar.background.selected
      : 'none'};
`

const TagContainer = styled.div<{
  hasSelectedKeyword: boolean
  selectedKeywords?: Set<string>
  bgColor?: string
}>`
  display: inline-block;
  height: 20px;
  border-radius: 4px;
  background-color: ${props =>
    props.hasSelectedKeyword && props.bgColor ? props.bgColor : 'none'};
  cursor: pointer;
`
interface Props {
  items: BibliographyItem[]
  handleKeyword: (keyword: string) => void
  projectID: string
  selectedKeywords?: Set<string>
}

const LibraryLists: React.FC<Props> = ({
  items,
  handleKeyword,
  projectID,
  selectedKeywords,
}) => (
  <ProjectKeywordsData projectID={projectID}>
    {keywords => {
      const sortedKeywords = asNames(items)
        .filter(id => keywords.has(id))
        .map(id => keywords.get(id))
        .sort(sortByName)

      if (!sortedKeywords.length) return null
      return (
        <ListContainer>
          {sortedKeywords.map((keyword: Keyword) => (
            <ListBox
              hasSelectedKeyword={
                (selectedKeywords && selectedKeywords.has(keyword._id)) || false
              }
              onClick={() => handleKeyword(keyword._id)}
            >
              <TagContainer
                hasSelectedKeyword={
                  (selectedKeywords && selectedKeywords.has(keyword._id)) ||
                  false
                }
                // bgColor={'#dcdcdc'}
                key={keyword._id}
              >
                <TagText>{keyword.name}</TagText>
              </TagContainer>
            </ListBox>
          ))}
        </ListContainer>
      )
    }}
  </ProjectKeywordsData>
)

export default LibraryLists
