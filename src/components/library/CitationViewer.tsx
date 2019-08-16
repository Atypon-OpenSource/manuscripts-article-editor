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
