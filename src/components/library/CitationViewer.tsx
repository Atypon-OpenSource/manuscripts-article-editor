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
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { issuedYear, shortAuthorsString } from '../../lib/library'
import { styled } from '../../theme/styled-components'

const CitedItem = styled.div`
  padding: 16px 0;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid #eee;
  }
`

const CitedItemTitle = styled(Title)``

const CitedItemAuthors = styled.div`
  margin-top: 4px;
  color: #777;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const CitedItems = styled.div`
  padding: 0 16px;
  font-family: ${props => props.theme.fontFamily};
  max-height: 70vh;
  overflow-y: auto;
`

interface Props {
  items: BibliographyItem[]
}

export const CitationViewer: React.FC<Props> = ({ items }) => (
  <CitedItems>
    {items.map(item => (
      <CitedItem
        key={item._id}
        onClick={() => {
          if (item.DOI) {
            window.open(`https://doi.org/${item.DOI}`)
          }
        }}
      >
        <CitedItemTitle value={item.title || 'Untitled'} />

        <CitedItemAuthors>
          {shortAuthorsString(item)} {issuedYear(item)}
        </CitedItemAuthors>
      </CitedItem>
    ))}
  </CitedItems>
)
