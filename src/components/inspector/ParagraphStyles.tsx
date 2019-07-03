/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
