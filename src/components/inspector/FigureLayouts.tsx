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

import {
  FigureElement,
  FigureLayout,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import config from '../../config'
import {
  DEFAULT_FIGURE_ALIGNMENT,
  DEFAULT_FIGURE_WIDTH,
} from '../../lib/styles'
import { InspectorSection } from '../InspectorSection'
import { StyleSelect } from '../projects/inputs'
import { FigureAlignmentField } from './FigureAlignmentField'
import { FigureWidthField } from './FigureWidthField'
import { InspectorField } from './ManuscriptStyleInspector'

export const FigureLayouts: React.FC<{
  figureElement: FigureElement
  figureLayouts: FigureLayout[]
  figureLayout: FigureLayout
  setElementFigureLayout: (id: string) => void
  setElementAlignment: (value?: string) => void
  setElementSizeFraction: (sizeFraction: number) => void
}> = ({
  figureElement,
  figureLayouts,
  figureLayout,
  setElementFigureLayout,
  setElementAlignment,
  setElementSizeFraction,
}) => {
  return (
    <InspectorSection title={'Figure Layout'}>
      <InspectorField>
        <StyleSelect
          value={figureLayout._id}
          onChange={event => {
            setElementFigureLayout(event.target.value)
          }}
        >
          {figureLayouts.map(style => (
            <option value={style._id} key={style._id}>
              {style.title}
            </option>
          ))}
        </StyleSelect>
      </InspectorField>

      <FigureWidthField
        defaultValue={DEFAULT_FIGURE_WIDTH}
        value={figureElement.sizeFraction}
        handleChange={setElementSizeFraction}
      />

      {config.export.literatum && (
        <FigureAlignmentField
          defaultValue={DEFAULT_FIGURE_ALIGNMENT}
          value={figureElement.alignment}
          handleChange={setElementAlignment}
          disabled={Boolean(
            figureElement.sizeFraction && figureElement.sizeFraction >= 1
          )}
        />
      )}
    </InspectorSection>
  )
}
