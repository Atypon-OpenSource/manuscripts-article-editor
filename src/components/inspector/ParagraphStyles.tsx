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
  Color,
  ColorScheme,
  Model,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme/styled-components'
import {
  InspectorPanelTabList,
  InspectorTab,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import { InspectorSection } from '../InspectorSection'
import { InspectorField } from './ManuscriptStyleInspector'
import { ParagraphListsField } from './ParagraphListsField'
import { ParagraphStyleActions } from './ParagraphStyleActions'
import {
  BottomSpacingField,
  FirstLineIndentField,
  LineSpacingField,
  ListIndentPerLevelField,
  ListNumberingField,
  ListTailIndentField,
  SaveParagraphStyle,
  TextAlignmentField,
  TextColorField,
  TextSizeField,
  TextStyleField,
  TopSpacingField,
} from './StyleFields'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

export const ParagraphStyles: React.FC<{
  bodyTextParagraphStyles: ParagraphStyle[]
  colors: Color[]
  colorScheme: ColorScheme
  defaultParagraphStyle: ParagraphStyle
  deleteParagraphStyle: () => void
  duplicateParagraphStyle: () => void
  error?: Error
  paragraphStyle: ParagraphStyle
  renameParagraphStyle: () => void
  saveDebouncedParagraphStyle: SaveParagraphStyle
  saveModel: SaveModel
  saveParagraphStyle: SaveParagraphStyle
  setElementParagraphStyle: (id: string) => void
  setError: (error: Error) => void
}> = ({
  bodyTextParagraphStyles,
  colors,
  colorScheme,
  defaultParagraphStyle,
  deleteParagraphStyle,
  duplicateParagraphStyle,
  error,
  paragraphStyle,
  renameParagraphStyle,
  saveDebouncedParagraphStyle,
  saveModel,
  saveParagraphStyle,
  setElementParagraphStyle,
  setError,
}) => {
  return (
    <InspectorSection title={'Paragraph Styles'}>
      <InspectorField>
        <StyleSelector
          value={paragraphStyle._id}
          onChange={event => {
            setElementParagraphStyle(event.target.value)
          }}
        >
          {bodyTextParagraphStyles.map(style => (
            <option value={style._id} key={style._id}>
              {style.title}
            </option>
          ))}
        </StyleSelector>

        <ParagraphStyleActions
          deleteParagraphStyle={deleteParagraphStyle}
          duplicateParagraphStyle={duplicateParagraphStyle}
          isDefault={paragraphStyle._id !== defaultParagraphStyle._id}
          renameParagraphStyle={renameParagraphStyle}
        />
      </InspectorField>

      {error && <div>{error.message}</div>}

      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>Text</InspectorTab>
          <InspectorTab>Spacing</InspectorTab>
          <InspectorTab>Lists</InspectorTab>
        </InspectorPanelTabList>

        <InspectorTabPanels>
          <InspectorTabPanel>
            <TextSizeField
              saveParagraphStyle={saveParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <TextStyleField
              saveParagraphStyle={saveParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <TextColorField
              saveParagraphStyle={saveParagraphStyle}
              paragraphStyle={paragraphStyle}
              colors={colors}
              colorScheme={colorScheme}
              saveModel={saveModel}
              setError={setError}
            />
          </InspectorTabPanel>
          <InspectorTabPanel>
            <TextAlignmentField
              saveParagraphStyle={saveParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <TopSpacingField
              saveParagraphStyle={saveDebouncedParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <BottomSpacingField
              saveParagraphStyle={saveDebouncedParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <FirstLineIndentField
              saveParagraphStyle={saveDebouncedParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <LineSpacingField
              saveParagraphStyle={saveDebouncedParagraphStyle}
              paragraphStyle={paragraphStyle}
            />
          </InspectorTabPanel>
          <InspectorTabPanel>
            <ListTailIndentField
              saveParagraphStyle={saveDebouncedParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <ListIndentPerLevelField
              saveParagraphStyle={saveDebouncedParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <ListNumberingField
              saveParagraphStyle={saveParagraphStyle}
              paragraphStyle={paragraphStyle}
            />

            <ParagraphListsField
              saveParagraphStyle={saveParagraphStyle}
              paragraphStyle={paragraphStyle}
            />
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorSection>
  )
}

const StyleSelector = styled.select`
  flex: 1;
`
