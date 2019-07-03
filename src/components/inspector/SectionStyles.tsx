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

import { Build, generateID } from '@manuscripts/manuscript-transform'
import {
  Color,
  ColorScheme,
  NumberingStyle,
  ObjectTypes,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import {
  DEFAULT_SECTION_NUMBERING_STYLE,
  DEFAULT_SECTION_NUMBERING_SUFFIX,
  DEFAULT_SECTION_START_INDEX,
  SectionNumberingScheme,
  sectionNumberingSchemes,
} from '../../lib/styles'
import {
  InspectorPanelTabList,
  InspectorTab,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import { InspectorSection } from '../InspectorSection'
import { SmallTextField, StyleSelect } from '../projects/inputs'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'
import {
  BottomSpacingField,
  defaultValue,
  FirstLineIndentField,
  LineSpacingField,
  SaveModel,
  SaveParagraphStyle,
  TextAlignmentField,
  TextColorField,
  TextSizeField,
  TextStyleField,
  TopSpacingField,
} from './StyleFields'

const buildNumberingStyle = (): Build<NumberingStyle> => ({
  _id: generateID(ObjectTypes.NumberingStyle),
  objectType: ObjectTypes.NumberingStyle,
  startIndex: DEFAULT_SECTION_START_INDEX,
})

export const SectionStyles: React.FC<{
  colors: Color[]
  colorScheme: ColorScheme
  error?: Error
  paragraphStyle: ParagraphStyle
  saveModel: SaveModel
  saveParagraphStyle: SaveParagraphStyle
  saveDebouncedParagraphStyle: SaveParagraphStyle
  setError: (error: Error) => void
  title: string
}> = ({
  colors,
  colorScheme,
  error,
  paragraphStyle,
  saveModel,
  saveParagraphStyle,
  saveDebouncedParagraphStyle,
  setError,
  title,
}) => {
  const { sectionNumberingStyle = buildNumberingStyle() } = paragraphStyle

  return (
    <InspectorSection title={title}>
      {error && <div>{error.message}</div>}

      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>Text</InspectorTab>
          <InspectorTab>Spacing</InspectorTab>
          <InspectorTab>Numbering</InspectorTab>
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
            <InspectorField>
              <InspectorLabel>Numbering</InspectorLabel>

              <StyleSelect
                name={'section-numbering-scheme'}
                value={defaultValue<string>(
                  sectionNumberingStyle.numberingScheme,
                  DEFAULT_SECTION_NUMBERING_STYLE
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    sectionNumberingStyle: {
                      ...(sectionNumberingStyle as NumberingStyle),
                      numberingScheme: event.target
                        .value as SectionNumberingScheme,
                    },
                  })
                }}
              >
                {Object.entries(sectionNumberingSchemes).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value.label}
                  </option>
                ))}
              </StyleSelect>
            </InspectorField>

            <InspectorField>
              <InspectorLabel>Suffix</InspectorLabel>

              <SmallTextField
                name={'list-suffix'}
                value={defaultValue<string>(
                  sectionNumberingStyle.suffix,
                  DEFAULT_SECTION_NUMBERING_SUFFIX
                )}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    sectionNumberingStyle: {
                      ...(sectionNumberingStyle as NumberingStyle),
                      suffix: event.target.value,
                    },
                  })
                }}
              />
            </InspectorField>
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorSection>
  )
}
