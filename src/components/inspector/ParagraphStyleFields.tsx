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

import { ParagraphStyle } from '@manuscripts/manuscripts-json-schema'
import { range } from 'lodash-es'
import React from 'react'
import styled from 'styled-components'
import {
  alignments,
  DEFAULT_ALIGNMENT,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_LIST_INDENT,
  DEFAULT_LIST_INDENT_PER_LEVEL,
  DEFAULT_MARGIN_BOTTOM,
  DEFAULT_MARGIN_TOP,
  DEFAULT_TEXT_INDENT,
} from '../../lib/styles'
import {
  SmallNumberField,
  SpacingRange,
  StyleRange,
  StyleSelect,
} from '../projects/inputs'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'
import { BlockField, BlockFields, valueOrDefault } from './StyleFields'

export type SaveParagraphStyle = (style: ParagraphStyle) => void

export const TextSizeField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const { textStyling } = paragraphStyle

  if (!textStyling) {
    return null
  }

  return (
    <InspectorField>
      <InspectorLabel>Size</InspectorLabel>
      <SmallNumberField
        value={valueOrDefault<number>(textStyling.fontSize, DEFAULT_FONT_SIZE)}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            textStyling: {
              ...textStyling,
              fontSize: Number(event.target.value),
            },
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const TextStyleField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const { textStyling } = paragraphStyle

  if (!textStyling) {
    return null
  }

  return (
    <InspectorField>
      <InspectorLabel>Style</InspectorLabel>
      <TextStyleButton
        type={'button'}
        isActive={textStyling.bold}
        onMouseDown={() => {
          saveParagraphStyle({
            ...paragraphStyle,
            textStyling: {
              ...textStyling,
              bold: !textStyling.bold,
            },
          })
        }}
      >
        B
      </TextStyleButton>

      <TextStyleButton
        type={'button'}
        isActive={textStyling.italic}
        style={{ fontStyle: 'italic' }}
        onMouseDown={() => {
          saveParagraphStyle({
            ...paragraphStyle,
            textStyling: {
              ...textStyling,
              italic: !textStyling.italic,
            },
          })
        }}
      >
        I
      </TextStyleButton>
    </InspectorField>
  )
}

const TextStyleButton = styled.button<{ isActive: boolean }>`
  font-weight: ${props =>
    props.isActive
      ? props.theme.font.weight.bold
      : props.theme.font.weight.normal};
  font-size: inherit;
  border: none;
  border-radius: 50%;
  background: none;
  padding: 0 ${props => props.theme.grid.unit * 2}px;
  cursor: pointer;
`
export const TextAlignmentField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<string>(
    paragraphStyle.alignment,
    DEFAULT_ALIGNMENT
  )

  return (
    <InspectorField>
      <InspectorLabel>Alignment</InspectorLabel>
      <StyleSelect
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            alignment: event.target.value,
          })
        }}
      >
        {Object.entries(alignments).map(([key, value]) => (
          <option value={key} key={key}>
            {value.label}
          </option>
        ))}
      </StyleSelect>
    </InspectorField>
  )
}

export const TopSpacingField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<number>(
    paragraphStyle.topSpacing,
    DEFAULT_MARGIN_TOP
  )

  return (
    <InspectorField>
      <InspectorLabel>Top spacing</InspectorLabel>
      <SpacingRange
        name={'top-spacing'}
        min={0}
        max={40}
        step={2}
        list={'topSpacingList'}
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            topSpacing: Number(event.target.value),
          })
        }}
      />
      <SmallNumberField
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            topSpacing: Number(event.target.value),
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const BottomSpacingField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<number>(
    paragraphStyle.bottomSpacing,
    DEFAULT_MARGIN_BOTTOM
  )

  return (
    <InspectorField>
      <InspectorLabel>Bottom spacing</InspectorLabel>
      <SpacingRange
        name={'bottom-spacing'}
        min={0}
        max={40}
        step={2}
        value={value}
        list={'bottomSpacingLsit'}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            bottomSpacing: Number(event.target.value),
          })
        }}
      />
      <SmallNumberField
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            bottomSpacing: Number(event.target.value),
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const FirstLineIndentField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<number>(
    paragraphStyle.firstLineIndent,
    DEFAULT_TEXT_INDENT
  )

  return (
    <InspectorField>
      <InspectorLabel>First line indent</InspectorLabel>
      <SpacingRange
        name={'first-line-indent'}
        min={0}
        max={40}
        step={2}
        value={value}
        list={'firstLineIndentList'}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            firstLineIndent: Number(event.target.value),
          })
        }}
      />
      <SmallNumberField
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            firstLineIndent: Number(event.target.value),
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const LineSpacingField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<number>(
    paragraphStyle.lineSpacing,
    DEFAULT_LINE_HEIGHT
  )

  return (
    <InspectorField>
      <InspectorLabel>Line spacing</InspectorLabel>
      <StyleRange
        name={'line-spacing'}
        type={'range'}
        min={1}
        max={2}
        step={0.25}
        value={value}
        list={'lineSpacingList'}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            lineSpacing: Number(event.target.value),
          })
        }}
      />
      <datalist id={'lineSpacingList'}>
        {range(1, 2, 0.25).map(value => (
          <option key={value}>{value}</option>
        ))}
      </datalist>
      <SmallNumberField
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            lineSpacing: Number(event.target.value),
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const ListTailIndentField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<number>(
    paragraphStyle.listTailIndent,
    DEFAULT_LIST_INDENT
  )

  return (
    <InspectorField>
      <InspectorLabel>List indent</InspectorLabel>
      <SpacingRange
        name={'list-indent'}
        type={'range'}
        min={0}
        max={40}
        step={2}
        list={'listTailIndentList'}
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            listTailIndent: Number(event.target.value),
          })
        }}
      />
      <SmallNumberField
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            listTailIndent: Number(event.target.value),
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const ListIndentPerLevelField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => {
  const value = valueOrDefault<number>(
    paragraphStyle.listItemIndentPerLevel,
    DEFAULT_LIST_INDENT_PER_LEVEL
  )

  return (
    <InspectorField>
      <InspectorLabel>Indent per level</InspectorLabel>
      <SpacingRange
        name={'list-level-indent'}
        type={'range'}
        min={0}
        max={40}
        step={2}
        list={'listLevelIndentList'}
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            listItemIndentPerLevel: Number(event.target.value),
          })
        }}
      />
      <SmallNumberField
        value={value}
        onChange={event => {
          saveParagraphStyle({
            ...paragraphStyle,
            listItemIndentPerLevel: Number(event.target.value),
          })
        }}
      />
      pt
    </InspectorField>
  )
}

export const ListNumberingField: React.FC<{
  paragraphStyle: ParagraphStyle
  saveParagraphStyle: SaveParagraphStyle
}> = ({ paragraphStyle, saveParagraphStyle }) => (
  <InspectorField>
    <InspectorLabel>List numbering</InspectorLabel>

    <BlockFields>
      <BlockField>
        <input
          name={'list-hierarchical-numbering'}
          type={'checkbox'}
          checked={paragraphStyle.hierarchicalListNumbering}
          onChange={event => {
            saveParagraphStyle({
              ...paragraphStyle,
              hierarchicalListNumbering: Boolean(event.target.checked),
            })
          }}
        />
        Hierarchical
      </BlockField>

      {paragraphStyle.hierarchicalListNumbering && (
        <BlockField>
          <input
            name={'list-hide-suffix'}
            type={'checkbox'}
            checked={paragraphStyle.hideListNumberingSuffixForLastLevel}
            onChange={event => {
              saveParagraphStyle({
                ...paragraphStyle,
                hideListNumberingSuffixForLastLevel: Boolean(
                  event.target.checked
                ),
              })
            }}
          />
          Hide suffix for last level
        </BlockField>
      )}
    </BlockFields>
  </InspectorField>
)
