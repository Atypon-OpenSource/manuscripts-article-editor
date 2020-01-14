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
  Color,
  Model,
  ObjectTypes,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import * as CSS from 'csstype'
import { range } from 'lodash-es'

export const DEFAULT_ALIGNMENT = 'left'
export const DEFAULT_COLOR = '#000'
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
export const DEFAULT_SPACING = 20
export const DEFAULT_TEXT_INDENT = 0

export const isParagraphStyle = hasObjectType<ParagraphStyle>(
  ObjectTypes.ParagraphStyle
)

const fontSize = (model: ParagraphStyle): number =>
  model.textStyling && model.textStyling.fontSize
    ? model.textStyling.fontSize
    : DEFAULT_FONT_SIZE

const fontStyle = (model: ParagraphStyle): string =>
  model.textStyling && model.textStyling.italic ? 'italic' : 'normal'

const fontWeight = (model: ParagraphStyle): string =>
  model.textStyling && model.textStyling.bold ? 'bold' : 'normal'

const color = (model: ParagraphStyle, colors: Map<string, Color>): string => {
  const id = model.textStyling && model.textStyling.color

  if (id) {
    const color = colors.get(id)

    if (color && color.value) {
      return color.value
    }
  }

  return DEFAULT_COLOR
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
        font-size: ${fontSize(model)}pt;
        font-style: ${fontStyle(model)};
        font-weight: ${fontWeight(model)};
        color: ${color(model, colors)};
        text-align: ${textAlign(model)};
        margin-top: ${marginTop(model)}pt !important;
        margin-bottom: ${marginBottom(model)}pt !important;
        line-height: ${lineHeight(model)};
        text-indent: ${textIndent(model)}pt;
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
      color: ${color(model, colors)} !important;
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
