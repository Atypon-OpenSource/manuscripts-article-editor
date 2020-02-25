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

import { Build } from '@manuscripts/manuscript-transform'
import { CountRequirement } from '@manuscripts/manuscripts-json-schema'
import React, { ChangeEvent, useCallback } from 'react'
import { useSyncedData } from '../../hooks/use-synced-data'
import { styled } from '../../theme/styled-components'
import { Checkbox, NumberField } from './inputs'

type Value = CountRequirement | Build<CountRequirement>

export const CountInput: React.FC<{
  value: Value
  handleChange: (requirement: Value) => Promise<void>
  label: string
  placeholder: string
}> = ({ value, handleChange, label, placeholder }) => {
  const [currentValue, handleLocalChange, setEditing] = useSyncedData<Value>(
    value,
    handleChange,
    500
  )

  const handleCheckboxChange = useCallback(() => {
    handleLocalChange({
      ...currentValue,
      ignored: currentValue.ignored === false ? true : false,
    })
  }, [currentValue, handleLocalChange])

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = {
        ...currentValue,
        count: event.target.value ? Number(event.target.value) : undefined,
      }

      handleLocalChange(value)
    },
    [currentValue, handleLocalChange]
  )

  return (
    <Field>
      <label>
        <Checkbox
          checked={currentValue.ignored === false}
          onChange={handleCheckboxChange}
        />
        {label}
      </label>

      <NumberField
        value={
          currentValue.ignored === false ? String(currentValue.count || '') : ''
        }
        disabled={currentValue.ignored !== false}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
      />
    </Field>
  )
}

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.grid.unit * 2}px;
`
