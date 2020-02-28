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

import { Citation } from '@manuscripts/manuscripts-json-schema'
import React, { ChangeEvent, useCallback, useState } from 'react'
import styled from 'styled-components'

type DisplayScheme = 'show-all' | 'author-only' | 'suppress-author'

export const DisplaySchemeSelector: React.FC<{
  citation: Citation
  updateCitation: (data: Partial<Citation>) => Promise<void>
}> = ({ citation, updateCitation }) => {
  const [displayScheme, setDisplayScheme] = useState(citation.displayScheme)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const displayScheme = event.target.value as DisplayScheme
      setDisplayScheme(displayScheme)
      updateCitation({ displayScheme }).catch(error => {
        console.error(error) // tslint:disable-line:no-console
      })
    },
    [updateCitation]
  )

  return (
    <Label>
      Show{' '}
      <select value={displayScheme || 'show-all'} onChange={handleChange}>
        <option value={'show-all'}>Authors and year</option>
        <option value={'author-only'}>Authors only (suppress year)</option>
        <option value={'suppress-author'}>Year only (suppress authors)</option>
      </select>
    </Label>
  )
}

const Label = styled.label`
  display: block;
  margin: ${props => props.theme.grid.unit * 4}px 0;
`
