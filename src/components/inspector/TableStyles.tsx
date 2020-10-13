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
  Model,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'

import {
  DEFAULT_TABLE_CAPTION_ALIGNMENT,
  DEFAULT_TABLE_CAPTION_POSITION,
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
import { InspectorField } from './ManuscriptStyleInspector'
import { StyleActions } from './StyleActions'
import { SaveTableStyle, valueOrDefault } from './StyleFields'
import { CaptionAlignmentField, CaptionPositionField } from './TableStyleFields'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export const TableStyles: React.FC<{
  tableStyles: TableStyle[]
  borderStyles: BorderStyle[]
  colors: Color[]
  colorScheme: ColorScheme
  defaultTableStyle: TableStyle
  deleteTableStyle: () => void
  duplicateTableStyle: () => void
  error?: Error
  tableStyle: TableStyle
  renameTableStyle: () => void
  saveDebouncedTableStyle: SaveTableStyle
  saveModel: SaveModel
  saveTableStyle: SaveTableStyle
  setElementTableStyle: (id: string) => void
  setError: (error: Error) => void
}> = ({
  tableStyles,
  borderStyles,
  colors,
  colorScheme,
  defaultTableStyle,
  deleteTableStyle,
  duplicateTableStyle,
  error,
  tableStyle,
  renameTableStyle,
  saveDebouncedTableStyle,
  saveModel,
  saveTableStyle,
  setElementTableStyle,
  setError,
}) => {
  return (
    <InspectorSection title={'Table Styles'}>
      <InspectorField>
        <StyleSelect
          value={tableStyle._id}
          onChange={(event) => {
            setElementTableStyle(event.target.value)
          }}
        >
          {tableStyles.map((style) => (
            <option value={style._id} key={style._id}>
              {style.title}
            </option>
          ))}
        </StyleSelect>

        <StyleActions
          deleteStyle={deleteTableStyle}
          duplicateStyle={duplicateTableStyle}
          isDefault={tableStyle._id === defaultTableStyle._id}
          renameStyle={renameTableStyle}
        />
      </InspectorField>

      {error && <div>{error.message}</div>}

      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>Caption</InspectorTab>
          <InspectorTab>Header</InspectorTab>
          <InspectorTab>Footer</InspectorTab>
        </InspectorPanelTabList>

        <InspectorTabPanels>
          <InspectorTabPanel>
            <CaptionPositionField
              value={valueOrDefault<string>(
                tableStyle.captionPosition,
                DEFAULT_TABLE_CAPTION_POSITION
              )}
              handleChange={(captionPosition) => {
                saveTableStyle({
                  ...tableStyle,
                  captionPosition,
                })
              }}
            />

            <CaptionAlignmentField
              value={valueOrDefault<string>(
                tableStyle.alignment,
                DEFAULT_TABLE_CAPTION_ALIGNMENT
              )}
              handleChange={(alignment) => {
                saveTableStyle({
                  ...tableStyle,
                  alignment,
                })
              }}
            />
          </InspectorTabPanel>

          <InspectorTabPanel>
            <InspectorTabPanelHeading>Top Border</InspectorTabPanelHeading>

            {tableStyle.headerTopBorder && (
              <BorderFields
                border={tableStyle.headerTopBorder}
                borderStyles={borderStyles}
                colors={colors}
                colorScheme={colorScheme}
                saveModel={saveModel}
                setError={setError}
                saveBorder={(border) => {
                  saveTableStyle({
                    ...tableStyle,
                    headerTopBorder: border,
                  })
                }}
                saveDebouncedBorder={(border) =>
                  saveDebouncedTableStyle({
                    ...tableStyle,
                    headerTopBorder: border,
                  })
                }
              />
            )}

            <InspectorTabPanelHeading>Bottom Border</InspectorTabPanelHeading>

            {tableStyle.headerBottomBorder && (
              <BorderFields
                border={tableStyle.headerBottomBorder}
                borderStyles={borderStyles}
                colors={colors}
                colorScheme={colorScheme}
                saveModel={saveModel}
                setError={setError}
                saveBorder={(border) => {
                  saveTableStyle({
                    ...tableStyle,
                    headerBottomBorder: border,
                  })
                }}
                saveDebouncedBorder={(border) =>
                  saveDebouncedTableStyle({
                    ...tableStyle,
                    headerBottomBorder: border,
                  })
                }
              />
            )}
          </InspectorTabPanel>

          <InspectorTabPanel>
            <InspectorTabPanelHeading>Top Border</InspectorTabPanelHeading>

            {tableStyle.footerTopBorder && (
              <BorderFields
                border={tableStyle.footerTopBorder}
                borderStyles={borderStyles}
                colors={colors}
                colorScheme={colorScheme}
                saveModel={saveModel}
                setError={setError}
                saveBorder={(border) => {
                  saveTableStyle({
                    ...tableStyle,
                    footerTopBorder: border,
                  })
                }}
                saveDebouncedBorder={(border) =>
                  saveDebouncedTableStyle({
                    ...tableStyle,
                    footerTopBorder: border,
                  })
                }
              />
            )}

            <InspectorTabPanelHeading>Bottom Border</InspectorTabPanelHeading>

            {tableStyle.footerBottomBorder && (
              <BorderFields
                border={tableStyle.footerBottomBorder}
                borderStyles={borderStyles}
                colors={colors}
                colorScheme={colorScheme}
                saveModel={saveModel}
                setError={setError}
                saveBorder={(border) => {
                  saveTableStyle({
                    ...tableStyle,
                    footerBottomBorder: border,
                  })
                }}
                saveDebouncedBorder={(border) =>
                  saveDebouncedTableStyle({
                    ...tableStyle,
                    footerBottomBorder: border,
                  })
                }
              />
            )}
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorSection>
  )
}
