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
  BorderStyle,
  Color,
  ColorScheme,
  FigureStyle,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import {
  DEFAULT_FIGURE_CAPTION_POSITION,
  DEFAULT_FIGURE_INNER_SPACING,
  DEFAULT_FIGURE_OUTER_SPACING,
} from '../../lib/styles'
import {
  InspectorPanelTabList,
  InspectorTab,
  InspectorTabPanel,
  InspectorTabPanelHeading,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import { InspectorSection } from '../InspectorSection'
import { StyleSelect } from '../projects/inputs'
import { BorderFields } from './BorderFields'
import { CaptionPositionField, SpacingField } from './FigureStyleFields'
import { InspectorField } from './ManuscriptStyleInspector'
import { StyleActions } from './StyleActions'
import { SaveFigureStyle, valueOrDefault } from './StyleFields'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export const FigureStyles: React.FC<{
  borderStyles: BorderStyle[]
  figureStyles: FigureStyle[]
  colors: Color[]
  colorScheme: ColorScheme
  defaultFigureStyle: FigureStyle
  deleteFigureStyle: () => void
  duplicateFigureStyle: () => void
  error?: Error
  figureStyle: FigureStyle
  renameFigureStyle: () => void
  saveDebouncedFigureStyle: SaveFigureStyle
  saveModel: SaveModel
  saveFigureStyle: SaveFigureStyle
  setElementFigureStyle: (id: string) => void
  setError: (error: Error) => void
}> = ({
  borderStyles,
  figureStyles,
  colors,
  colorScheme,
  defaultFigureStyle,
  deleteFigureStyle,
  duplicateFigureStyle,
  error,
  figureStyle,
  renameFigureStyle,
  saveDebouncedFigureStyle,
  saveModel,
  saveFigureStyle,
  setElementFigureStyle,
  setError,
}) => {
  return (
    <InspectorSection title={'Figure Styles'}>
      <InspectorField>
        <StyleSelect
          value={figureStyle._id}
          onChange={event => {
            setElementFigureStyle(event.target.value)
          }}
        >
          {figureStyles.map(style => (
            <option value={style._id} key={style._id}>
              {style.title}
            </option>
          ))}
        </StyleSelect>

        <StyleActions
          deleteStyle={deleteFigureStyle}
          duplicateStyle={duplicateFigureStyle}
          isDefault={figureStyle._id !== defaultFigureStyle._id}
          renameStyle={renameFigureStyle}
        />
      </InspectorField>

      {error && <div>{error.message}</div>}

      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>Panel</InspectorTab>
          <InspectorTab>Figures</InspectorTab>
        </InspectorPanelTabList>

        <InspectorTabPanels>
          <InspectorTabPanel>
            <CaptionPositionField
              value={valueOrDefault<string>(
                figureStyle.captionPosition,
                DEFAULT_FIGURE_CAPTION_POSITION
              )}
              handleChange={captionPosition => {
                saveFigureStyle({
                  ...figureStyle,
                  captionPosition,
                })
              }}
            />

            <SpacingField
              defaultValue={DEFAULT_FIGURE_OUTER_SPACING}
              value={figureStyle.outerSpacing}
              handleChange={(outerSpacing: number) =>
                saveDebouncedFigureStyle({
                  ...figureStyle,
                  outerSpacing,
                })
              }
            />

            {figureStyle.outerBorder && (
              <>
                <InspectorTabPanelHeading>Border</InspectorTabPanelHeading>

                <BorderFields
                  border={figureStyle.outerBorder}
                  borderStyles={borderStyles}
                  colors={colors}
                  colorScheme={colorScheme}
                  saveModel={saveModel}
                  setError={setError}
                  saveBorder={border => {
                    saveFigureStyle({
                      ...figureStyle,
                      outerBorder: border,
                    })
                  }}
                  saveDebouncedBorder={border =>
                    saveDebouncedFigureStyle({
                      ...figureStyle,
                      outerBorder: border,
                    })
                  }
                />
              </>
            )}
          </InspectorTabPanel>

          <InspectorTabPanel>
            {figureStyle.innerBorder && (
              <>
                <InspectorTabPanelHeading>Border</InspectorTabPanelHeading>

                <BorderFields
                  border={figureStyle.innerBorder}
                  borderStyles={borderStyles}
                  colors={colors}
                  colorScheme={colorScheme}
                  saveModel={saveModel}
                  setError={setError}
                  saveBorder={border => {
                    saveFigureStyle({
                      ...figureStyle,
                      innerBorder: border,
                    })
                  }}
                  saveDebouncedBorder={border =>
                    saveDebouncedFigureStyle({
                      ...figureStyle,
                      innerBorder: border,
                    })
                  }
                />
              </>
            )}

            <SpacingField
              defaultValue={DEFAULT_FIGURE_INNER_SPACING}
              value={figureStyle.innerSpacing}
              handleChange={(innerSpacing: number) =>
                saveDebouncedFigureStyle({
                  ...figureStyle,
                  innerSpacing,
                })
              }
            />
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorSection>
  )
}
