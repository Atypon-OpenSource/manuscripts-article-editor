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

import { Build, generateID } from '@manuscripts/manuscript-transform'
import {
  Color,
  ColorScheme,
  NumberingStyle,
  ObjectTypes,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import { CheckboxField, CheckboxLabel } from '@manuscripts/style-guide'
import React from 'react'
import {
  DEFAULT_PART_OF_TOC,
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
  const {
    partOfTOC,
    sectionNumberingStyle = buildNumberingStyle(),
  } = paragraphStyle

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

            <InspectorField>
              <InspectorLabel />

              <CheckboxField
                name={'part-of-toc'}
                id={'part-of-toc'}
                checked={defaultValue<boolean>(partOfTOC, DEFAULT_PART_OF_TOC)}
                disabled={paragraphStyle.name === 'heading1'}
                onChange={event => {
                  saveParagraphStyle({
                    ...paragraphStyle,
                    partOfTOC: event.target.checked,
                  })
                }}
              />

              <CheckboxLabel htmlFor={'part-of-toc'}>
                Include in Table of Contents
              </CheckboxLabel>
            </InspectorField>
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorSection>
  )
}
