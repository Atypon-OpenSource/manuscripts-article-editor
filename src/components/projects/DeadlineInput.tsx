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
import 'react-modern-calendar-datepicker/lib/DatePicker.css'

import AttentionOrange from '@manuscripts/assets/react/AttentionOrange'
import AttentionRed from '@manuscripts/assets/react/AttentionRed'
import { Manuscript, Section } from '@manuscripts/manuscripts-json-schema'
import { TextField } from '@manuscripts/style-guide'
import { format } from 'date-fns'
import React from 'react'
import DatePicker, { Day } from 'react-modern-calendar-datepicker'
import ReactTooltip from 'react-tooltip'
import styled, { css } from 'styled-components'

import { AnyElement } from '../inspector/ElementStyleInspector'
import { useStore } from '../../store'

const DateInput = styled(TextField).attrs({
  type: 'search',
})<{ overdue?: boolean; dueSoon?: boolean }>`
  -webkit-appearance: none;
  padding: 8px;
  border-radius: 8px;
  font-size: 1em;

  color: ${(props) =>
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

  .tooltip {
    border-radius: 6px;
  }
`

const todayStyles = css`
  .Calendar__day.-today {
    border: 1px solid #bce7f6 !important;
    background: #f2fbfc !important;
  }

  .Calendar__day.-today::after {
    opacity: 0.5 !important;
  }
`

const CalendarContainer = styled.div<{
  selected: boolean
}>`
  width: 100%;

  .DatePicker {
    width: 100%;
    z-index: 10;
  }

  .Calendar__weekDay {
    color: #e6e6e;
    font-size: 14px;
  }

  .Calendar__day:not(.-blank):not(.-selected):hover {
    background: #f2fbfc !important;
  }

  .Calendar__day.-today:hover::after {
    opacity: 0.5 !important;
  }

  ${(props) => !props.selected && todayStyles};

  .selected-day {
    color: #353535 !important;
    border: 1px solid #bce7f6 !important;
  }

  .DatePicker__calendarContainer {
    position: absolute;
    top: unset;
    left: unset !important;
    right: 0 !important;
    transform: unset !important;
  }
`

interface Props {
  ref: React.RefObject<HTMLInputElement>
}

export const DeadlineInput: React.FC<{
  target: AnyElement | Section | Manuscript
  isOverdue?: boolean
  isDueSoon?: boolean
}> = ({ target, isOverdue, isDueSoon }) => {
  const saveModel = useStore((store) => store.saveModel)

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
          <div data-tip={true} data-for={'Overdue'}>
            <AttentionRed width={20} height={20} />
          </div>
          <ReactTooltip
            id={'Overdue'}
            place="bottom"
            effect="solid"
            offset={{ top: 4 }}
            className="tooltip"
          >
            Overdue
          </ReactTooltip>
        </IconWrapper>
      )}
      {isDueSoon && (
        <IconWrapper>
          <div data-tip={true} data-for={'Due-Soon'}>
            <AttentionOrange width={20} height={20} />
          </div>
          <ReactTooltip
            id={'Due-Soon'}
            place="bottom"
            effect="solid"
            offset={{ top: 4 }}
            className="tooltip"
          >
            Due Soon
          </ReactTooltip>
        </IconWrapper>
      )}
    </>
  )

  return (
    <CalendarContainer selected={target.deadline ? true : false}>
      <DatePicker
        value={target.deadline ? day(target.deadline) : null}
        renderInput={renderCustomInput}
        onChange={async (date) => {
          await saveModel<AnyElement | Section | Manuscript>({
            ...target,
            deadline: date ? timeStamp(date) / 1000 : undefined,
          })
        }}
        calendarPopperPosition={'bottom'}
        colorPrimary="#f2fbfc"
        calendarSelectedDayClassName={'selected-day'}
        calendarClassName={'responsive-calendar'}
      />
    </CalendarContainer>
  )
}

const formatDate = (ms: number): string =>
  format(new Date(ms * 1000), 'iiii d LLLL')

const timeStamp = (date: Day) => {
  return Date.parse(
    `${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${
      date.day < 10 ? `0${date.day}` : date.day
    }`
  )
}

const day = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}
