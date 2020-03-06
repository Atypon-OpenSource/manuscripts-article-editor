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

import { range } from 'lodash-es'
import React, { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'
import { useSyncedData } from '../../hooks/use-synced-data'
import { SmallNumberField, StyleRange } from '../projects/inputs'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'
import { valueOrDefault } from './StyleFields'

export const FigureWidthField: React.FC<{
  value?: number // fraction
  defaultValue: number
  handleChange: (value?: number) => void
}> = ({ value, defaultValue, handleChange }) => {
  const handlePercentChange = useCallback(
    (value: number) => {
      handleChange(value / 100)
    },
    [handleChange]
  )

  const [currentValue, handleLocalChange, setEditing] = useSyncedData<number>(
    Math.round(valueOrDefault<number>(value, defaultValue) * 100), // percent
    handlePercentChange,
    500
  )

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleLocalChange(Number(event.target.value))
    },
    [handleLocalChange]
  )

  return (
    <InspectorField>
      <InspectorLabel>Width</InspectorLabel>
      <RangeContainer style={{ flex: 1 }}>
        <DataList id={'figureWidthList'}>
          <option value={10} label={'10%'}>
            10%
          </option>

          {range(20, 100, 10).map(value => (
            <option key={value} value={value} />
          ))}

          <option value={100} label={'Fit to margin'}>
            Fit to margin
          </option>
          <option value={200} label={'Full page'}>
            Full page
          </option>
        </DataList>

        <StyleRange
          min={10}
          max={200}
          type={'range'}
          name={'figure-width'}
          list={'figureWidthList'}
          value={currentValue}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        />
      </RangeContainer>
      <SmallNumberField
        value={Math.min(currentValue, 100)}
        onChange={handleInputChange}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        disabled={currentValue > 100}
      />
      %
    </InspectorField>
  )
}

const RangeContainer = styled.div`
  flex: 1;
  margin-right: ${props => props.theme.grid.unit * 2}px;

  input[type='range']::-moz-range-track {
    background: repeating-linear-gradient(
      to right,
      #fff,
      #fff 4.5%,
      #555 4.5%,
      #555 5.5%,
      #fff 5.5%,
      #fff 10%
    );
  }
`

const DataList = styled.datalist`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #555;

  option {
    width: 58px;
    text-align: center;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }

    &:not([label]) {
      display: none;
    }
  }
`
