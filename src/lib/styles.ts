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

import { hasObjectType } from '@manuscripts/manuscript-transform'
import {
  Border,
  BorderStyle,
  Color,
  FigureLayout,
  FigureStyle,
  Model,
  ObjectTypes,
  ParagraphStyle,
  TableStyle,
} from '@manuscripts/manuscripts-json-schema'
import * as CSS from 'csstype'
import { range } from 'lodash-es'
import { valueOrDefault } from '../components/inspector/StyleFields'
import { ascendingPriority } from './sort'

export const DEFAULT_ALIGNMENT = 'left'
export const DEFAULT_COLOR = '#000'
export const DEFAULT_FIGURE_CAPTION_ALIGNMENT = 'center'
export const DEFAULT_FIGURE_CAPTION_POSITION: FigureCaptionPosition = 'bottom'
export const DEFAULT_FIGURE_INNER_BORDER_WIDTH = 1
export const DEFAULT_FIGURE_INNER_SPACING = 4
export const DEFAULT_FIGURE_OUTER_BORDER_WIDTH = 1
export const DEFAULT_FIGURE_OUTER_SPACING = 4
export const DEFAULT_FONT_SIZE = 12
export const DEFAULT_LINE_HEIGHT = 1.5
export const DEFAULT_LIST_BULLET_STYLE = 'disc'
export const DEFAULT_LIST_INDENT = 0
export const DEFAULT_LIST_INDENT_PER_LEVEL = 20
export const DEFAULT_LIST_NUMBERING_STYLE = 'decimal'
export const DEFAULT_LIST_NUMBERING_PREFIX = ''
export const DEFAULT_LIST_NUMBERING_SUFFIX = '.'
export const DEFAULT_LIST_START_INDEX = 1
export const DEFAULT_MARGIN_BOTTOM = 0
export const DEFAULT_MARGIN_TOP = 12
export const DEFAULT_PART_OF_TOC = true
export const DEFAULT_SECTION_NUMBERING_STYLE = 'decimal'
export const DEFAULT_SECTION_START_INDEX = 1
export const DEFAULT_SECTION_NUMBERING_SUFFIX = '.'
// export const DEFAULT_SPACING = 20
export const DEFAULT_TABLE_BORDER_WIDTH = 1
export const DEFAULT_TABLE_CAPTION_ALIGNMENT = 'center'
export const DEFAULT_TABLE_CAPTION_POSITION: TableCaptionPosition = 'below'
export const DEFAULT_TABLE_FOOTER_BACKGROUND_COLOR = '#eee'
export const DEFAULT_TABLE_HEADER_BACKGROUND_COLOR = '#eee'
export const DEFAULT_TEXT_INDENT = 0

export const isParagraphStyle = hasObjectType<ParagraphStyle>(
  ObjectTypes.ParagraphStyle
)
export const isFigureStyle = hasObjectType<FigureStyle>(ObjectTypes.FigureStyle)
export const isBorderStyle = hasObjectType<BorderStyle>(ObjectTypes.BorderStyle)
export const isTableStyle = hasObjectType<TableStyle>(ObjectTypes.TableStyle)
export const isFigureLayout = hasObjectType<FigureLayout>(
  ObjectTypes.FigureLayout
)

// TODO: implement "above" and "below"
// export type FigureCaptionPosition = 'above' | 'top' | 'bottom' | 'below'
export type FigureCaptionPosition = 'top' | 'bottom'

export const figureCaptionPositions: {
  [key in FigureCaptionPosition]: {
    label: string
  }
} = {
  // above: {
  //   label: 'Above Figure',
  // },
  top: {
    label: 'Top of Figure',
  },
  bottom: {
    label: 'Bottom of Figure',
  },
  // below: {
  //   label: 'Below Figure',
  // },
}

export type TableCaptionPosition = 'above' | 'below'

export const tableCaptionPositions: {
  [key in TableCaptionPosition]: {
    label: string
  }
} = {
  above: {
    label: 'Above Table',
  },
  below: {
    label: 'Below Table',
  },
}

export type CaptionAlignment = 'left' | 'right' | 'center' | 'justify'

export const captionAlignments: {
  [key in CaptionAlignment]: {
    label: string
  }
} = {
  left: {
    label: 'Left',
  },
  center: {
    label: 'Center',
  },
  right: {
    label: 'Right',
  },
  justify: {
    label: 'Justify',
  },
}

/*export type BorderStyleType = 'none' | 'solid' | 'dashed' | 'dotted' | 'double'

export const borderStyles: {
  [key in BorderStyleType]: {
    css: CSS.BorderBlockStyleProperty
    label: string
  }
} = {
  none: {
    css: 'none',
    label: 'None',
  },
  solid: {
    css: 'solid',
    label: 'Solid',
  },
  dashed: {
    css: 'dashed',
    label: 'Dashed',
  },
  dotted: {
    css: 'dotted',
    label: 'Dotted',
  },
  double: {
    css: 'double',
    label: 'Double lines',
  },
}*/

const fontSize = (model: ParagraphStyle): number =>
  model.textStyling && model.textStyling.fontSize
    ? model.textStyling.fontSize
    : DEFAULT_FONT_SIZE

const fontStyle = (model: ParagraphStyle): string =>
  model.textStyling && model.textStyling.italic ? 'italic' : 'normal'

const fontWeight = (model: ParagraphStyle): string =>
  model.textStyling && model.textStyling.bold ? 'bold' : 'normal'

const paragraphColor = (
  model: ParagraphStyle,
  colors: Map<string, Color>
): string => {
  return colorValue(colors, model.textStyling && model.textStyling.color)
}

const borderColor = (border: Border, colors: Map<string, Color>): string => {
  return colorValue(colors, border && border.color)
}

const colorValue = (
  colors: Map<string, Color>,
  id?: string,
  defaultColor = DEFAULT_COLOR
): string => {
  if (id) {
    const color = colors.get(id)

    if (color && color.value) {
      return color.value
    }
  }

  return defaultColor
}

const borderStyle = (
  border: Border,
  borderStyles: Map<string, BorderStyle>
): CSS.LineStyle => {
  const id = border && border.style

  if (id) {
    const style = borderStyles.get(id)

    // TODO: use `doubleLines` and `pattern`?

    if (style && style.name) {
      return style.name as CSS.LineStyle
    }
  }

  return 'none'
}

export type Alignment = 'left' | 'right' | 'center' | 'justify'

export const alignments: {
  [key in Alignment]: {
    css: CSS.ListStyleProperty
    label: string
  }
} = {
  left: {
    css: 'left',
    label: 'Left',
  },
  center: {
    css: 'center',
    label: 'Center',
  },
  right: {
    css: 'right',
    label: 'Right',
  },
  justify: {
    css: 'justify',
    label: 'Justify',
  },
}

export const listLevels = ['1', '2', '3', '4', '5', '6']

// const lastLevel = listLevels[listLevels.length - 1]

export type ListBulletStyle = 'disc' | 'circle' | 'square' | 'none'

export const listBulletStyles: {
  [key in ListBulletStyle]: {
    css: CSS.ListStyleProperty
    label: string
  }
} = {
  disc: {
    css: 'disc',
    label: '●',
  },
  circle: {
    css: 'circle',
    label: '○',
  },
  square: {
    css: 'square',
    label: '■',
  },
  none: {
    css: 'none',
    label: '',
  },
}

export type ListNumberingScheme =
  | 'none'
  | 'decimal'
  | 'decimal-with-leading-zero'
  | 'lowercase-latin'
  | 'uppercase-latin'
  | 'uppercase-roman'
  | 'lowercase-roman'
  | 'lowercase-greek'

export const listNumberingSchemes: {
  [key in ListNumberingScheme]: {
    css: CSS.ListStyleProperty
    label: string
  }
} = {
  none: {
    css: 'none',
    label: 'None',
  },
  decimal: {
    css: 'decimal',
    label: '1 2 3',
  },
  'decimal-with-leading-zero': {
    css: 'decimal-leading-zero',
    label: '01 02 03',
  },
  'uppercase-latin': {
    css: 'upper-latin',
    label: 'A B C',
  },
  'lowercase-latin': {
    css: 'lower-latin',
    label: 'a b c',
  },
  'uppercase-roman': {
    css: 'upper-roman',
    label: 'I II III',
  },
  'lowercase-roman': {
    css: 'lower-roman',
    label: 'i ii iii',
  },
  'lowercase-greek': {
    css: 'lower-greek',
    label: 'α β γ',
  },
}

export type SectionNumberingScheme = 'none' | 'decimal'

export const sectionNumberingSchemes: {
  [key in SectionNumberingScheme]: {
    css: CSS.ListStyleProperty
    label: string
  }
} = {
  none: {
    css: 'none',
    label: 'None',
  },
  decimal: {
    css: 'decimal',
    label: '1 2 3',
  },
}

const chooseListNumberingStyle = (
  model: ParagraphStyle,
  level: string
): string => {
  if (model.embeddedListItemNumberingStyles) {
    const itemNumberingStyle = model.embeddedListItemNumberingStyles[level]

    if (itemNumberingStyle) {
      const { numberingScheme } = itemNumberingStyle

      if (numberingScheme) {
        const scheme = listNumberingSchemes[numberingScheme]

        if (scheme) {
          return scheme.css
        }
      }
    }
  }

  return DEFAULT_LIST_NUMBERING_STYLE
}

const chooseListNumberingPrefix = (
  model: ParagraphStyle,
  level: string
): string => {
  if (model.embeddedListItemNumberingStyles) {
    const itemNumberingStyle = model.embeddedListItemNumberingStyles[level]

    if (itemNumberingStyle) {
      const { prefix } = itemNumberingStyle

      if (prefix) {
        return prefix
      }
    }
  }

  return DEFAULT_LIST_NUMBERING_PREFIX
}

const chooseListNumberingSuffix = (
  model: ParagraphStyle,
  level: string
): string => {
  if (
    model.hierarchicalListNumbering &&
    model.hideListNumberingSuffixForLastLevel
    // level === lastLevel
  ) {
    return ''
  }

  if (model.embeddedListItemNumberingStyles) {
    const itemNumberingStyle = model.embeddedListItemNumberingStyles[level]

    if (itemNumberingStyle) {
      const { suffix } = itemNumberingStyle

      if (suffix) {
        return suffix
      }
    }
  }

  return DEFAULT_LIST_NUMBERING_SUFFIX
}

const chooseListNumberingStartIndex = (
  model: ParagraphStyle,
  level: string
): number => {
  if (model.embeddedListItemNumberingStyles) {
    const itemNumberingStyle = model.embeddedListItemNumberingStyles[level]

    if (itemNumberingStyle) {
      return itemNumberingStyle.startIndex
    }
  }

  return DEFAULT_LIST_START_INDEX
}

const chooseListBulletStyle = (
  model: ParagraphStyle,
  level: string
): string => {
  if (model.embeddedListItemBulletStyles) {
    const itemBulletStyle = model.embeddedListItemBulletStyles[level]

    if (itemBulletStyle) {
      const { bulletStyle } = itemBulletStyle

      if (bulletStyle) {
        const style = listBulletStyles[bulletStyle as ListBulletStyle]

        if (style) {
          return style.css
        }
      }
    }
  }

  return DEFAULT_LIST_BULLET_STYLE
}

const listStyles = (model: ParagraphStyle): string => {
  const styles = []

  for (const level of listLevels) {
    if (level === '1') {
      continue // already handled
    }

    // ordered lists

    const depth = Number(level) - 1

    const parentListSelector = '.list '.repeat(depth - 1)
    const listSelector = '.list '.repeat(depth)

    const startIndex = chooseListNumberingStartIndex(model, level)

    styles.push(`${listSelector} {
      counter-reset: list-level-${level} ${startIndex - 1};
    }`)

    styles.push(`${listSelector} > li {
      counter-increment: list-level-${level};
    }`)

    const buildHierarchicalOrderedListCounters = (level: string) => {
      return range(1, Number(level) + 1) // end is not inclusive
        .map(activeLevel => {
          const style = chooseListNumberingStyle(model, String(activeLevel))

          return `counter(list-level-${activeLevel}, ${style})`
        })
        .join('"."')
    }

    const buildOrderedListCounters = (
      level: string,
      hierarchical: boolean = false
    ) => {
      const style = chooseListNumberingStyle(model, level)
      const prefix = chooseListNumberingPrefix(model, level)
      const suffix = chooseListNumberingSuffix(model, level)

      const content = hierarchical
        ? buildHierarchicalOrderedListCounters(level)
        : `counter(list-level-${level}, ${style})`

      return `"${prefix}" ${content} "${suffix}"`
    }

    const stringNextLevel = String(Number(level))

    styles.push(
      `${parentListSelector} > li > ol > li::before {
        content: ${buildOrderedListCounters(
          stringNextLevel,
          model.hierarchicalListNumbering
        )};
      }`
    )

    const bulletStyle = chooseListBulletStyle(model, level)

    styles.push(
      `${parentListSelector} > li > ul {
        list-style-type: ${bulletStyle};
      }`
    )
  }

  return styles.join('\n')
}

const orderedListRootStyles = (model: ParagraphStyle): string => {
  const styles: string[] = []

  const startIndex = chooseListNumberingStartIndex(model, '1')

  styles.push(`counter-reset: list-level-1 ${startIndex - 1}`)
  styles.push(`> li { counter-increment: list-level-1 }`)

  const style = chooseListNumberingStyle(model, '1')
  const prefix = chooseListNumberingPrefix(model, '1')
  const suffix = chooseListNumberingSuffix(model, '1')

  styles.push(
    `> li::before {
      content: "${prefix}" counter(list-level-1, ${style}) "${suffix}";
    }`
  )

  return styles.join(';')
}

const bulletListRootStyles = (model: ParagraphStyle): string => {
  const styles: string[] = []

  const listBulletStyle = chooseListBulletStyle(model, '1')

  styles.push(`counter-reset: list-level-1`)
  styles.push(`> li { counter-increment: list-level-1 }`)
  styles.push(`list-style-type: ${listBulletStyle}`)

  return styles.join(';')
}

const marginTop = (model: ParagraphStyle): number => model.topSpacing

const marginBottom = (model: ParagraphStyle): number =>
  model.bottomSpacing === undefined
    ? DEFAULT_MARGIN_BOTTOM
    : model.bottomSpacing

const textIndent = (model: ParagraphStyle): number => model.firstLineIndent

const lineHeight = (model: ParagraphStyle): number => model.lineSpacing

const listIndentPerLevel = (model: ParagraphStyle): number =>
  model.listItemIndentPerLevel === undefined
    ? DEFAULT_LIST_INDENT_PER_LEVEL
    : model.listItemIndentPerLevel

const listIndent = (model: ParagraphStyle): number =>
  model.listTailIndent === undefined
    ? DEFAULT_LIST_INDENT
    : model.listTailIndent

const textAlign = (model: ParagraphStyle): string =>
  model.alignment || DEFAULT_ALIGNMENT

const chooseSectionNumberingSuffix = (model: ParagraphStyle): string => {
  const { sectionNumberingStyle } = model

  if (sectionNumberingStyle) {
    const { suffix } = sectionNumberingStyle

    if (suffix !== undefined) {
      return suffix
    }
  }

  return DEFAULT_SECTION_NUMBERING_SUFFIX
}

const chooseSectionNumberingStyle = (model: ParagraphStyle): string => {
  const { sectionNumberingStyle } = model

  if (sectionNumberingStyle) {
    const { numberingScheme } = sectionNumberingStyle

    if (numberingScheme) {
      const scheme =
        sectionNumberingSchemes[numberingScheme as SectionNumberingScheme]

      if (scheme) {
        return scheme.css
      }
    }
  }

  return DEFAULT_SECTION_NUMBERING_STYLE
}

export const buildParagraphStyles = (
  model: ParagraphStyle,
  colors: Map<string, Color>
) => `
      [data-paragraph-style="${model._id}"] {
        font-size: ${fontSize(model)}pt !important;
        font-style: ${fontStyle(model)} !important;
        font-weight: ${fontWeight(model)} !important;
        color: ${paragraphColor(model, colors)} !important;
        text-align: ${textAlign(model)} !important;
        margin-top: ${marginTop(model)}pt !important;
        margin-bottom: ${marginBottom(model)}pt !important;
        line-height: ${lineHeight(model)} !important;
        text-indent: ${textIndent(model)}pt !important;
        ${listStyles(model)}

        ul, ol {
          margin-left: ${listIndentPerLevel(model)}pt;
          padding-left: 0 !important;
        }
      }

      ol[data-paragraph-style="${model._id}"] {
        margin-left: ${listIndent(model)}pt !important;

        ${orderedListRootStyles(model)}
      }

      ul[data-paragraph-style="${model._id}"] {
        margin-left: ${listIndent(model)}pt !important;

        ${bulletListRootStyles(model)}
      }
    `

export const buildFigureStyles = (
  model: FigureStyle,
  colors: Map<string, Color>,
  borderStyles: Map<string, BorderStyle>
) => `
  [data-figure-style="${model._id}"] {
    ${model.outerBorder &&
      `
      border-color: ${borderColor(model.outerBorder, colors)} !important;
      border-style: ${borderStyle(model.outerBorder, borderStyles)} !important;
      border-width: ${valueOrDefault<number>(
        model.outerBorder.width,
        DEFAULT_FIGURE_OUTER_BORDER_WIDTH
      )}pt !important;
    `}

    padding: ${model.outerSpacing || DEFAULT_FIGURE_OUTER_SPACING}pt !important;
    gap: ${model.innerSpacing || DEFAULT_FIGURE_INNER_SPACING}pt !important;

    > figure {
      ${model.innerBorder &&
        `
        border-color: ${borderColor(model.innerBorder, colors)} !important;
        border-style: ${borderStyle(
          model.innerBorder,
          borderStyles
        )} !important;
        border-width: ${valueOrDefault<number>(
          model.innerBorder.width,
          DEFAULT_FIGURE_INNER_BORDER_WIDTH
        )}pt !important;
      `}
    }

    > figcaption {
      grid-row: ${
        // TODO: implement 'above' and 'below'
        model.captionPosition === 'top' || model.captionPosition === 'above'
          ? 1
          : 'caption'
      } !important;
      text-align: ${model.alignment ||
        DEFAULT_FIGURE_CAPTION_ALIGNMENT} !important;
    }
  }
`

export const buildFigureLayoutStyles = (model: FigureLayout) => `
  [data-figure-layout="${model._id}"] {
    grid-template-columns: ${
      model.columns ? `repeat(${model.columns}, 1fr)` : 1
    } !important;

    grid-template-rows: ${
      model.rows
        ? `repeat(${model.rows}, minmax(min-content, max-content)) [caption listing] auto`
        : 1
    } !important;

    .figure-caption {
      display: ${
        model.rows * model.columns === 1 ? 'none' : 'initial'
      } !important;
    }
  }
`

export const buildTableStyles = (
  model: TableStyle,
  colors: Map<string, Color>,
  borderStyles: Map<string, BorderStyle>
) => `
  [data-table-style="${model._id}"] {
    border-collapse: collapse;
    empty-cells: show;
    display: grid;

    tr:first-of-type {
      > td {
        background-color: ${colorValue(
          colors,
          model.headerBackgroundColor,
          DEFAULT_TABLE_HEADER_BACKGROUND_COLOR
        )} !important;

        ${model.headerTopBorder &&
          `
          border-top-color: ${borderColor(
            model.headerTopBorder,
            colors
          )} !important;
          border-top-style: ${borderStyle(
            model.headerTopBorder,
            borderStyles
          )} !important;
          border-top-width: ${valueOrDefault<number>(
            model.headerTopBorder.width,
            DEFAULT_TABLE_BORDER_WIDTH
          )}pt !important;
        `}

        ${model.headerBottomBorder &&
          `
          border-bottom-color: ${borderColor(
            model.headerBottomBorder,
            colors
          )} !important;
          border-bottom-style: ${borderStyle(
            model.headerBottomBorder,
            borderStyles
          )} !important;
          border-bottom-width: ${valueOrDefault<number>(
            model.headerBottomBorder.width,
            DEFAULT_TABLE_BORDER_WIDTH
          )}pt !important;
        `}
      }
    }

    tr:last-of-type {
      > td {
        background-color: ${colorValue(
          colors,
          model.footerBackgroundColor,
          DEFAULT_TABLE_FOOTER_BACKGROUND_COLOR
        )} !important;

        ${model.footerTopBorder &&
          `
          border-top-color: ${borderColor(
            model.footerTopBorder,
            colors
          )} !important;
          border-top-style: ${borderStyle(
            model.footerTopBorder,
            borderStyles
          )} !important;
          border-top-width: ${valueOrDefault<number>(
            model.footerTopBorder.width,
            DEFAULT_TABLE_BORDER_WIDTH
          )}pt !important;
        `}

        ${model.footerBottomBorder &&
          `
          border-bottom-color: ${borderColor(
            model.footerBottomBorder,
            colors
          )} !important;
          border-bottom-style: ${borderStyle(
            model.footerBottomBorder,
            borderStyles
          )} !important;
          border-bottom-width: ${valueOrDefault<number>(
            model.footerBottomBorder.width,
            DEFAULT_TABLE_BORDER_WIDTH
          )}pt !important;
        `}
      }
    }

    > figcaption {
      grid-row: ${model.captionPosition === 'above' ? 1 : 2} !important;
      text-align: ${model.alignment ||
        DEFAULT_TABLE_CAPTION_ALIGNMENT} !important;
    }
  }`

const headingCounter = (model: ParagraphStyle, depth: number) => {
  const numberingSuffix = chooseSectionNumberingSuffix(model)
  const numberingStyle = chooseSectionNumberingStyle(model)

  // TODO: iterate over higher levels to get their numbering styles?

  if (numberingStyle === 'none') {
    return '""'
  }

  const content = range(1, depth + 1) // end is non-inclusive
    .map(level => `counter(section-${level}, ${numberingStyle})`)
    .join(' "." ')

  return `${content} "${numberingSuffix} "`
}

// TODO: use a ParagraphStyle property?
const includeInNumberingSelector = ':not(.toc)'

export const buildHeadingStyles = (
  model: ParagraphStyle,
  colors: Map<string, Color>,
  depth: number
) => {
  const sectionSelector = `.ProseMirror ${'> section '.repeat(depth)}`.trim()

  const titleSelector = `${sectionSelector} > .block-section_title > h1`

  const titleContentSelector = `${sectionSelector}${includeInNumberingSelector} > .block-section_title > h1`

  const headingCounterContent = headingCounter(model, depth)

  return `
    ${sectionSelector}${includeInNumberingSelector} {
      counter-increment: section-${depth};
      counter-reset: section-${depth + 1};
    }

    ${titleSelector} {
      font-size: ${fontSize(model)}pt !important;
      font-style: ${fontStyle(model)} !important;
      font-weight: ${fontWeight(model)} !important;
      color: ${paragraphColor(model, colors)} !important;
      text-align: ${textAlign(model)};
      margin-top: ${marginTop(model)}pt !important;
      margin-bottom: ${marginBottom(model)}pt !important;
      line-height: ${lineHeight(model)};
      text-indent: ${textIndent(model)}pt;
    }

    ${titleContentSelector}::before {
      content: ${headingCounterContent};
    }

    ${titleContentSelector}.empty-node[data-placeholder]::before {
      content: ${headingCounterContent} attr(data-placeholder);
    }
  `
}

// TODO: read default embeddedNumberingStyle from PageLayout?

export const findBodyTextParagraphStyles = (modelMap: Map<string, Model>) => {
  const output: ParagraphStyle[] = []

  for (const model of modelMap.values()) {
    if (isParagraphStyle(model)) {
      if (model.kind === 'body' && model.prototype !== 'MPParagraphStyle:toc') {
        output.push(model)
      }
    }
  }

  return output
}

export const findFigureLayouts = (modelMap: Map<string, Model>) => {
  const output: FigureLayout[] = []

  for (const model of modelMap.values()) {
    if (isFigureLayout(model)) {
      output.push(model)
    }
  }

  return output.sort(ascendingPriority)
}

export const findFigureStyles = (modelMap: Map<string, Model>) => {
  const output: FigureStyle[] = []

  for (const model of modelMap.values()) {
    if (isFigureStyle(model)) {
      output.push(model)
    }
  }

  return output.sort(ascendingPriority)
}

export const findBorderStyles = (modelMap: Map<string, Model>) => {
  const output: BorderStyle[] = []

  for (const model of modelMap.values()) {
    if (isBorderStyle(model)) {
      output.push(model)
    }
  }

  return output.sort(ascendingPriority)
}

export const findTableStyles = (modelMap: Map<string, Model>) => {
  const output: TableStyle[] = []

  for (const model of modelMap.values()) {
    if (isTableStyle(model)) {
      output.push(model)
    }
  }

  return output
}
