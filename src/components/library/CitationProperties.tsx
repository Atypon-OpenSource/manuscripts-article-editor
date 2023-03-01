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

import { Citation } from '@manuscripts/json-schema'
import { TextField } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

type DisplayScheme = 'show-all' | 'author-only' | 'suppress-author'

export const CitationProperties: React.FC<{
  properties: Citation
  setProperties: (data: Citation) => void
}> = ({ properties, setProperties }) => {
  return (
    <>
      <FormGroup>
        <FormLabel>Show</FormLabel>
        <select
          value={properties.displayScheme || 'show-all'}
          onChange={(event) =>
            setProperties({
              ...properties,
              displayScheme: event.target.value as DisplayScheme,
            })
          }
        >
          <option value={'show-all'}>Authors and year</option>
          <option value={'author-only'}>Authors only</option>
          <option value={'suppress-author'}>No authors</option>
          <option value={'composite'}>Composite</option>
        </select>
      </FormGroup>

      <FormGroup>
        <FormLabel>Prefix</FormLabel>
        <TextField
          type={'text'}
          value={properties.prefix}
          onChange={(event) =>
            setProperties({
              ...properties,
              prefix: event.target.value as DisplayScheme,
            })
          }
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Suffix</FormLabel>
        <TextField
          type={'text'}
          value={properties.suffix}
          onChange={(event) =>
            setProperties({
              ...properties,
              suffix: event.target.value as DisplayScheme,
            })
          }
        />
      </FormGroup>

      {properties.displayScheme === 'composite' && (
        <FormGroup>
          <FormLabel>Infix</FormLabel>
          <TextField
            type={'text'}
            value={properties.infix}
            onChange={(event) =>
              setProperties({
                ...properties,
                infix: event.target.value as DisplayScheme,
              })
            }
          />
        </FormGroup>
      )}
    </>
  )
}

const FormGroup = styled.div`
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
  display: flex;
  align-items: center;

  ${TextField} {
    padding: 2px;
    flex: 1;
  }
`

const FormLabel = styled.label`
  flex-shrink: 0;
  width: 50px;
`
