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

import { Build } from '@manuscripts/manuscript-transform'
import { CountRequirement } from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'
import { styled } from '../../theme/styled-components'
import { Checkbox, NumberField } from './inputs'

type Value = CountRequirement | Build<CountRequirement>

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const CountInput: React.FC<{
  value: Value
  handleChange: (requirement: Value) => Promise<void>
  label: string
  placeholder: string
}> = ({ value, handleChange, label, placeholder }) => {
  const [requirement, setRequirement] = useState(value)

  useEffect(() => {
    setRequirement(value)
  }, [value])

  // TODO: debounce handleChange somewhere

  return (
    <Field>
      <label>
        <Checkbox
          checked={requirement.ignored === false}
          onChange={async event => {
            const value = {
              ...requirement,
              ignored: requirement.ignored === false ? true : false,
            }

            setRequirement(value)

            await handleChange(value)
          }}
        />
        {label}
      </label>

      <NumberField
        value={
          requirement.ignored === false ? String(requirement.count || '') : ''
        }
        disabled={requirement.ignored !== false}
        placeholder={placeholder}
        onChange={async event => {
          const value = {
            ...requirement,
            count: event.target.value ? Number(event.target.value) : undefined,
          }

          setRequirement(value)

          await handleChange(value)
        }}
      />
    </Field>
  )
}
