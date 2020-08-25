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
import AttentionOrange from '@manuscripts/assets/react/AttentionOrange'
import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import { Section } from '@manuscripts/manuscripts-json-schema'
import { TextField, Tip } from '@manuscripts/style-guide'
import { format } from 'date-fns'
import React from 'react'
import DatePicker, { Day } from 'react-modern-calendar-datepicker'
import 'react-modern-calendar-datepicker/lib/DatePicker.css'
import styled from 'styled-components'
import { AnyElement } from '../inspector/ElementStyleInspector'
import { SaveModel } from './ManuscriptInspector'

const DateInput = styled(TextField).attrs({
  type: 'search',
})<{ overdue?: boolean; dueSoon?: boolean }>`
  padding: 8px;
  font-size: 1em;

  color: ${props =>
    props.overdue
      ? props.theme.colors.text.error
      : props.dueSoon
      ? props.theme.colors.text.warning
      : props.theme.colors.text.primary};

  &:focus::placeholder {
    color: transparent;
  }
`
const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
const Calendar = styled.div`
  width: 100%;

  .DatePicker {
    width: 100%;
    z-index: 10;
  }

  .selected-day {
    color: #353535 !important;
    border: 1px solid #bce7f6 !important;
  }

  .DatePicker__calendarContainer {
    position: absolute;
    top: unset;
  }
`

interface Props {
  ref: React.RefObject<HTMLInputElement>
}

export const DeadlineInput: React.FC<{
  saveModel: SaveModel
  target: AnyElement | Section
  isOverdue?: boolean
  isDueSoon?: boolean
}> = ({ saveModel, target, isOverdue, isDueSoon }) => {
  const renderCustomInput: React.FC<Props> = ({ ref }) => (
    <>
      <DateInput
        ref={ref}
        placeholder={'Empty'}
        value={target.deadline ? formatDate(target.deadline) : ''}
        onChange={async (event: React.FormEvent<HTMLInputElement>) => {
          const searchText = event.currentTarget.value
          if (!searchText) {
            await saveModel<AnyElement | Section>({
              ...target,
              deadline: undefined,
            })
          }
        }}
        overdue={isOverdue}
        dueSoon={isDueSoon}
      />
      {isOverdue && (
        <IconWrapper>
          <Tip placement={'bottom'} title={'Overdue'}>
            <AttentionRed width={20} height={20} />
          </Tip>
        </IconWrapper>
      )}
      {isDueSoon && (
        <IconWrapper>
          <Tip placement={'bottom'} title={'Due Soon'}>
            <AttentionOrange width={20} height={20} />
          </Tip>
        </IconWrapper>
      )}
    </>
  )

  return (
    <Calendar>
      <DatePicker
        value={target.deadline ? day(target.deadline) : null}
        renderInput={renderCustomInput}
        onChange={async date => {
          await saveModel<AnyElement | Section>({
            ...target,
            deadline: date ? timeStamp(date) / 1000 : undefined,
          })
        }}
        calendarPopperPosition={'bottom'}
        colorPrimary="#f2fbfc"
        calendarSelectedDayClassName={'selected-day'}
        calendarClassName={'responsive-calendar'}
      />
    </Calendar>
  )
}

const formatDate = (ms: number): string =>
  format(new Date(ms * 1000), 'iiii d LLLL')

const timeStamp = (date: Day) => {
  return Date.parse(`${date.year}-${date.month}-${date.day}`)
}

const day = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}
