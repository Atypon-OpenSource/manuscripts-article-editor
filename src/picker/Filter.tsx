/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
import { Manuscript } from '@manuscripts/manuscripts-json-schema'
import React, { useState } from 'react'
import styled from 'styled-components'

import { TemplateSearchInput } from '../components/templates/TemplateSearchInput'

export const Filter: React.FC<{
  children: (filtered: Manuscript[]) => React.ReactNode
  rows: Manuscript[]
}> = ({ children, rows }) => {
  const [value, setValue] = useState('')

  const filter = (rows: Manuscript[]) => {
    if (value) {
      return rows.reduce((acc, item) => {
        if (item.title) {
          const isMatching =
            item.title.toUpperCase().indexOf(value.toUpperCase().trim()) >= 0
          if (isMatching) {
            acc.push(item)
          }
        }
        return acc
      }, [] as Manuscript[])
    } else {
      return rows
    }
  }

  const results = filter(rows)

  return (
    <SearchContainer>
      <TemplateSearchInput value={value} handleChange={setValue} />
      {results.length ? children(results) : 'No results'}
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  margin: 0 30px 20px 10px;
  margin-left: 0;
  margin-right: 0;
`
