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
  FigureLayout,
  FigureStyle,
  InlineStyle,
  Model,
  ObjectTypes,
  ParagraphStyle,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  buildFigureLayoutStyles,
  buildFigureStyles,
  buildHeadingStyles,
  buildInlineStyles,
  buildParagraphStyles,
  buildTableStyles,
} from '../../lib/styles'

interface StyleMaps {
  [key: string]: Map<string, Model>
}

const buildStyles = (styleMaps: StyleMaps): string => {
  const getStyleMap = <T extends Model>(type: ObjectTypes) =>
    styleMaps[type] as Map<string, T>

  const borderStyles = getStyleMap<BorderStyle>(ObjectTypes.BorderStyle)
  const colors = getStyleMap<Color>(ObjectTypes.Color)

  const buildParagraphModelStyles = (model: ParagraphStyle) => {
    const styleName = model.name

    if (!styleName) {
      return
    }

    // paragraphs, lists, etc
    if (styleName === 'bodyText') {
      return buildParagraphStyles(model, colors)
    }

    // headings
    const matches = styleName.match(/^heading(\d)$/)

    if (matches) {
      return buildHeadingStyles(model, colors, Number(matches[1]))
    }
  }

  const styles = []

  const paragraphStyles = getStyleMap<ParagraphStyle>(
    ObjectTypes.ParagraphStyle
  )

  for (const model of paragraphStyles.values()) {
    const modelStyles = buildParagraphModelStyles(model)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  const figureStyles = getStyleMap<FigureStyle>(ObjectTypes.FigureStyle)

  for (const model of figureStyles.values()) {
    const modelStyles = buildFigureStyles(model, colors, borderStyles)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  const inlineStyles = getStyleMap<InlineStyle>(ObjectTypes.InlineStyle)

  for (const model of inlineStyles.values()) {
    const modelStyles = buildInlineStyles(model)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  const figureLayouts = getStyleMap<FigureLayout>(ObjectTypes.FigureLayout)

  for (const model of figureLayouts.values()) {
    const modelStyles = buildFigureLayoutStyles(model)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  const tableStyles = getStyleMap<TableStyle>(ObjectTypes.TableStyle)

  for (const model of tableStyles.values()) {
    const modelStyles = buildTableStyles(model, colors, borderStyles)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  return styles.join('\n\n')
}

// TODO: subscribe to queries of only style objects?

export const EditorStyles: React.FC<{
  modelMap: Map<string, Model>
}> = ({ children, modelMap }) => {
  const [styles, setStyles] = useState<string>()

  const styleMaps: StyleMaps = {
    [ObjectTypes.BorderStyle]: new Map<string, BorderStyle>(),
    [ObjectTypes.Color]: new Map<string, Color>(),
    [ObjectTypes.FigureLayout]: new Map<string, FigureLayout>(),
    [ObjectTypes.FigureStyle]: new Map<string, FigureStyle>(),
    [ObjectTypes.InlineStyle]: new Map<string, InlineStyle>(),
    [ObjectTypes.ParagraphStyle]: new Map<string, ParagraphStyle>(),
    [ObjectTypes.TableStyle]: new Map<string, TableStyle>(),
  }

  for (const model of modelMap.values()) {
    if (model.objectType in styleMaps) {
      styleMaps[model.objectType].set(model._id, model)
    }
  }

  useEffect(
    () => {
      setStyles(buildStyles(styleMaps))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(
        Object.values(styleMaps).map((item) => [...item.entries()])
      ),
    ]
  )

  if (styles === undefined) {
    return null
  }

  return (
    <EditorStylesContainer styles={styles}>{children}</EditorStylesContainer>
  )
}

export const EditorStylesContainer = React.memo(styled.div<{
  styles: string
}>`
  ${(props) => props.styles}
`)
