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

import { Section, StatusLabel } from '@manuscripts/manuscripts-json-schema'
import { format } from 'date-fns'
import React from 'react'
import { AnyElement } from '../../inspector/ElementStyleInspector'
import RenderIcon, { calculateCircumference } from './StatusIcons'
import {
  DateStyled,
  Details,
  DndItemButton,
  Expiring,
  TipItem,
} from './StatusInputStyling'

interface StatusTipProps {
  isOverdue?: boolean
  isDueSoon?: boolean
  selectedLabelPriority: number
  sortedLabels: StatusLabel[]
  target: AnyElement | Section
}

const StatusInputTipDropdown: React.FC<StatusTipProps> = ({
  isOverdue,
  isDueSoon,
  selectedLabelPriority,
  sortedLabels,
  target,
}) => {
  const getLocalDay = (ms: number): string =>
    format(new Date(ms * 1000), 'iiii d LLLL')

  return (
    <>
      {sortedLabels.map(
        label =>
          typeof label.priority !== 'undefined' &&
          label.priority <= selectedLabelPriority && (
            <TipItem>
              <DndItemButton
                defaultColor="#fff"
                isOverdue={label._id === target.status ? isOverdue : false}
                isDueSoon={label._id === target.status ? isDueSoon : false}
                pie={calculateCircumference(label._id, sortedLabels)}
              >
                {RenderIcon(label._id, sortedLabels)}
                {label.name}
              </DndItemButton>
              <Details>
                <DateStyled>{getLocalDay(label.updatedAt)}</DateStyled>
                {label._id === target.status && (
                  <>
                    {isDueSoon && (
                      <Expiring className="dueSoon">Due Soon</Expiring>
                    )}
                    {isOverdue && (
                      <Expiring className="overdue">Overdue</Expiring>
                    )}
                  </>
                )}
              </Details>
            </TipItem>
          )
      )}
    </>
  )
}

export default StatusInputTipDropdown
