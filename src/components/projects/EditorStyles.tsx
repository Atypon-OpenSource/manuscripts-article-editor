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
  ParagraphStyle,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import React, { useEffect, useState } from 'react'
import { isColor } from '../../lib/colors'
import {
  buildFigureLayoutStyles,
  buildFigureStyles,
  buildHeadingStyles,
  buildInlineStyles,
  buildParagraphStyles,
  buildTableStyles,
  isBorderStyle,
  isFigureLayout,
  isFigureStyle,
  isInlineStyle,
  isParagraphStyle,
  isTableStyle,
} from '../../lib/styles'
import { styled } from '../../theme/styled-components'

// tslint:disable:cyclomatic-complexity
const buildStyles = (
  paragraphStyles: Map<string, ParagraphStyle>,
  figureStyles: Map<string, FigureStyle>,
  tableStyles: Map<string, TableStyle>,
  borderStyles: Map<string, BorderStyle>,
  inlineStyles: Map<string, InlineStyle>,
  figureLayouts: Map<string, FigureLayout>,
  colors: Map<string, Color>
): string => {
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

  for (const model of paragraphStyles.values()) {
    const modelStyles = buildParagraphModelStyles(model)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  for (const model of figureStyles.values()) {
    const modelStyles = buildFigureStyles(model, colors, borderStyles)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  for (const model of inlineStyles.values()) {
    const modelStyles = buildInlineStyles(model)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  for (const model of figureLayouts.values()) {
    const modelStyles = buildFigureLayoutStyles(model)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  for (const model of tableStyles.values()) {
    const modelStyles = buildTableStyles(model, colors, borderStyles)

    if (modelStyles) {
      styles.push(modelStyles)
    }
  }

  return styles.join('\n\n')
}

// TODO: subscribe to queries of only ParagraphStyle + Color objects?

// tslint:disable:cyclomatic-complexity
export const EditorStyles: React.FC<{
  modelMap: Map<string, Model>
}> = ({ children, modelMap }) => {
  const [styles, setStyles] = useState<string>()

  const paragraphStyles = new Map<string, ParagraphStyle>()
  const figureStyles = new Map<string, FigureStyle>()
  const tableStyles = new Map<string, TableStyle>()
  const borderStyles = new Map<string, BorderStyle>()
  const inlineStyles = new Map<string, InlineStyle>()
  const figureLayouts = new Map<string, FigureLayout>()
  const colors = new Map<string, Color>()

  for (const model of modelMap.values()) {
    if (isParagraphStyle(model)) {
      paragraphStyles.set(model._id, model)
    } else if (isFigureStyle(model)) {
      figureStyles.set(model._id, model)
    } else if (isFigureLayout(model)) {
      figureLayouts.set(model._id, model)
    } else if (isTableStyle(model)) {
      tableStyles.set(model._id, model)
    } else if (isBorderStyle(model)) {
      borderStyles.set(model._id, model)
    } else if (isInlineStyle(model)) {
      inlineStyles.set(model._id, model)
    } else if (isColor(model)) {
      colors.set(model._id, model)
    }
  }

  useEffect(() => {
    setStyles(
      buildStyles(
        paragraphStyles,
        figureStyles,
        tableStyles,
        borderStyles,
        inlineStyles,
        figureLayouts,
        colors
      )
    )
  }, [
    JSON.stringify([...paragraphStyles]),
    JSON.stringify([...figureStyles]),
    JSON.stringify([...tableStyles]),
    JSON.stringify([...borderStyles]),
    JSON.stringify([...inlineStyles]),
    JSON.stringify([...figureLayouts]),
    JSON.stringify([...colors]),
  ])

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
  ${props => props.styles}
`)
