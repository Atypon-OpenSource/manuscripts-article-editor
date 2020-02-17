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

import React from 'react'
import {
  CaptionAlignment,
  captionAlignments,
  FigureCaptionPosition,
  figureCaptionPositions,
} from '../../lib/styles'
import { SmallNumberField, SpacingRange, StyleSelect } from '../projects/inputs'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'
import { valueOrDefault } from './StyleFields'

// TODO: remove this once "above" and "below" are supported
const replaceCaptionPosition = (value: string) => {
  if (value === 'above') {
    return 'top'
  }

  if (value === 'below') {
    return 'bottom'
  }

  return value
}

export const CaptionPositionField: React.FC<{
  value: string
  handleChange: (value: FigureCaptionPosition) => void
}> = ({ value, handleChange }) => {
  value = replaceCaptionPosition(value)

  return (
    <InspectorField>
      <InspectorLabel>Position</InspectorLabel>
      <StyleSelect
        value={value}
        onChange={event => {
          handleChange(event.target.value as FigureCaptionPosition)
        }}
      >
        {Object.entries(figureCaptionPositions).map(([key, value]) => (
          <option value={key} key={key}>
            {value.label}
          </option>
        ))}
      </StyleSelect>
    </InspectorField>
  )
}

export const CaptionAlignmentField: React.FC<{
  value: string
  handleChange: (value: CaptionAlignment) => void
}> = ({ value, handleChange }) => (
  <InspectorField>
    <InspectorLabel>Alignment</InspectorLabel>
    <StyleSelect
      value={value}
      onChange={event => {
        handleChange(event.target.value as CaptionAlignment)
      }}
    >
      {Object.entries(captionAlignments).map(([key, value]) => (
        <option value={key} key={key}>
          {value.label}
        </option>
      ))}
    </StyleSelect>
  </InspectorField>
)

export const SpacingField: React.FC<{
  value?: number
  defaultValue: number
  handleChange: (spacing?: number) => void
}> = ({ value, defaultValue, handleChange }) => {
  const currentValue = valueOrDefault<number>(value, defaultValue)

  return (
    <InspectorField>
      <InspectorLabel>Spacing</InspectorLabel>
      <SpacingRange
        name={'border-spacing'}
        min={0}
        max={40}
        step={2}
        list={'borderSpacingList'}
        value={currentValue}
        onChange={event => {
          handleChange(Number(event.target.value))
        }}
      />
      <SmallNumberField
        value={currentValue}
        onChange={event => {
          handleChange(Number(event.target.value))
        }}
      />
      pt
    </InspectorField>
  )
}
