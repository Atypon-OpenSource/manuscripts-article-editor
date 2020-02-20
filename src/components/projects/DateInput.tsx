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

import { TextField } from '@manuscripts/style-guide'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/use-debounce'

const convertDateStringToNumber = (input?: string): number | undefined => {
  if (!input) {
    return undefined
  }

  const output = new Date(input)

  if (!output) {
    return undefined
  }

  return Number(output)
}

const convertNumberToDateString = (input?: number): string => {
  if (!input) {
    return ''
  }

  const output = new Date(input)

  if (!output) {
    return ''
  }

  return output.toISOString().substr(0, 10)
}

export const DateInput: React.FC<{
  value?: number
  handleChange: (value?: number) => void
}> = ({ value, handleChange }) => {
  const [date, setDate] = useState<number | undefined>(value)

  const debouncedDate = useDebounce(date || undefined, 500)

  useEffect(() => {
    if (debouncedDate !== value) {
      handleChange(debouncedDate)
    }
  }, [debouncedDate, value])

  return (
    <TextField
      value={convertNumberToDateString(date)}
      type={'date'}
      onChange={event => {
        setDate(convertDateStringToNumber(event.target.value))
      }}
    />
  )
}
