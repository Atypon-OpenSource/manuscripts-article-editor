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

import {
  Border,
  BorderStyle,
  Color,
  ColorScheme,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { DEFAULT_TABLE_BORDER_WIDTH } from '../../lib/styles'
import { SmallNumberField, SpacingRange, StyleSelect } from '../projects/inputs'
import { ColorField } from './ColorField'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'
import { SaveModel, valueOrDefault } from './StyleFields'

export const BorderStyleField: React.FC<{
  value?: string
  handleChange: (style: string) => void
  borderStyles: BorderStyle[]
}> = ({ value, handleChange, borderStyles }) => {
  return (
    <InspectorField>
      <InspectorLabel>Style</InspectorLabel>

      <StyleSelect
        value={value}
        onChange={event => {
          handleChange(event.target.value)
        }}
      >
        <option value={undefined} key={'none'}>
          None
        </option>

        <option disabled={true}>————————</option>

        {borderStyles.map(borderStyle => (
          <option value={borderStyle._id} key={borderStyle._id}>
            {borderStyle.title || 'Untitled'}
          </option>
        ))}
      </StyleSelect>
    </InspectorField>
  )
}

export const BorderWidthField: React.FC<{
  value?: number
  defaultValue: number
  handleChange: (spacing?: number) => void
}> = ({ value, defaultValue, handleChange }) => {
  const currentValue = valueOrDefault<number>(value, defaultValue)

  return (
    <InspectorField>
      <InspectorLabel>Width</InspectorLabel>
      <SpacingRange
        name={'border-width'}
        min={0}
        max={8}
        step={2}
        list={'borderWidthList'}
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

export const BorderFields: React.FC<{
  border: Border
  saveBorder: (border: Border) => void
  saveDebouncedBorder: (border: Border) => void
  borderStyles: BorderStyle[]
  colors: Color[]
  colorScheme: ColorScheme
  saveModel: SaveModel
  setError: (error: Error) => void
}> = ({
  border,
  borderStyles,
  saveBorder,
  saveDebouncedBorder,
  colors,
  colorScheme,
  saveModel,
  setError,
}) => {
  return (
    <>
      <BorderStyleField
        borderStyles={borderStyles}
        value={border.style}
        handleChange={(style?: string) => {
          saveBorder({ ...border, style })
        }}
      />

      <BorderWidthField
        defaultValue={DEFAULT_TABLE_BORDER_WIDTH}
        value={border.width}
        handleChange={(width: number) =>
          saveDebouncedBorder({ ...border, width })
        }
      />

      <ColorField
        colors={colors}
        colorScheme={colorScheme}
        value={border.color}
        handleChange={(color?: string) => saveBorder({ ...border, color })}
        saveModel={saveModel}
        setError={setError}
      />
    </>
  )
}
