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

import { PrimaryButton } from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useState } from 'react'
// @ts-ignore
import DateTimePicker from 'react-datetime-picker'
import styled from 'styled-components'

export const DateTimeInput: React.FC<{
  value?: number
  handleChange: (value?: number) => void
}> = ({ value, handleChange }) => {
  const [date, setDate] = useState<number | undefined>(value)

  useEffect(() => {
    setDate(value)
  }, [value])

  const saveDate = useCallback(() => {
    handleChange(date)
  }, [date, handleChange])

  return (
    <Container>
      <StyledDateTimePicker
        onChange={(newValue?: Date) => {
          if (newValue) {
            setDate(newValue.getTime())
          } else {
            setDate(undefined)
            if (value !== undefined) {
              handleChange(undefined)
            }
          }
        }}
        value={date && new Date(date)}
        showLeadingZeros={true}
        maxDetail={'minute'}
        calendarIcon={null}
        disableClock={true}
      />

      {date !== value && (
        <PrimaryButton mini={true} onClick={saveDate}>
          Save
        </PrimaryButton>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDateTimePicker = styled(DateTimePicker)`
  height: 24px;

  .react-datetime-picker__wrapper {
    border: none;
    display: flex;
    align-items: center;
  }

  .react-datetime-picker__clear-button {
    display: none;
  }

  &:hover {
    .react-datetime-picker__clear-button {
      display: inline-flex;
    }
  }

  .react-datetime-picker__clear-button svg {
    stroke: #bbb;
  }
`
