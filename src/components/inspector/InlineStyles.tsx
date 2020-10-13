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

import { InlineStyle } from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'

import { useDebounce } from '../../hooks/use-debounce'
import { InspectorSection } from '../InspectorSection'
import { MediumTextArea, StyleSelect } from '../projects/inputs'
import { InspectorField } from './ManuscriptStyleInspector'
import { StyleActions } from './StyleActions'

export const InlineStyles: React.FC<{
  activeStyle?: InlineStyle
  addStyle: () => void
  applyStyle: (id?: string) => void
  deleteActiveStyle: () => void
  inlineStyles: InlineStyle[]
  renameActiveStyle: () => void
  updateStyle: (style: string) => void
}> = ({
  addStyle,
  deleteActiveStyle,
  renameActiveStyle,
  activeStyle,
  applyStyle,
  inlineStyles,
  updateStyle,
}) => (
  <InspectorSection title={'Inline Styles'}>
    <InspectorField>
      <StyleSelect
        value={(activeStyle && activeStyle._id) || 'none'}
        onChange={(event) =>
          applyStyle(
            event.target.value === 'none' ? undefined : event.target.value
          )
        }
      >
        <option value={'none'} key={'none'}>
          None
        </option>

        <option disabled={true} key={'separator'}>
          ————————
        </option>

        {inlineStyles.map((style) => (
          <option value={style._id} key={style._id}>
            {style.title || 'Untitled Style'}
          </option>
        ))}
      </StyleSelect>

      <StyleActions
        deleteStyle={deleteActiveStyle}
        addStyle={addStyle}
        isDefault={activeStyle === undefined}
        renameStyle={renameActiveStyle}
      />
    </InspectorField>

    {activeStyle && (
      <InlineStyleEditor
        key={activeStyle._id}
        value={activeStyle.style || ''}
        handleChange={updateStyle}
      />
    )}
  </InspectorSection>
)

const InlineStyleEditor: React.FC<{
  value: string
  handleChange: (value: string) => void
}> = ({ value, handleChange }) => {
  const [style, setStyle] = useState<string>(value)

  const debouncedStyle = useDebounce<string>(style, 1000)

  useEffect(() => {
    if (value !== debouncedStyle) {
      handleChange(debouncedStyle)
    }
  }, [value, handleChange, debouncedStyle])

  return (
    <MediumTextArea
      value={style}
      onChange={(event) => setStyle(event.target.value)}
      rows={5}
      placeholder={'Enter CSS styles…'}
    />
  )
}
