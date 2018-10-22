import React from 'react'

import listing from '@manuscripts/assets/react/OutlineIconCodeSnippet'
import equationElement from '@manuscripts/assets/react/OutlineIconEquation'
import figure from '@manuscripts/assets/react/OutlineIconFigure'
import manuscript from '@manuscripts/assets/react/OutlineIconManuscript'
import orderedList from '@manuscripts/assets/react/OutlineIconOrderedList'
import paragraph from '@manuscripts/assets/react/OutlineIconParagraph'
import section from '@manuscripts/assets/react/OutlineIconSection'
import table from '@manuscripts/assets/react/OutlineIconTable'
import unorderedList from '@manuscripts/assets/react/OutlineIconUnorderedList'

const icons: Map<string, React.SFC<React.SVGAttributes<SVGElement>>> = new Map([
  ['bibliography_element', section],
  ['bullet_list', unorderedList],
  ['listing_element', listing],
  ['equation_element', equationElement],
  ['title', manuscript],
  ['figure_element', figure],
  ['ordered_list', orderedList],
  ['paragraph', paragraph],
  ['section', section],
  ['table_element', table],
])

export const nodeTypeIcon = (type: string) => {
  const Icon = icons.get(type)

  return Icon ? <Icon /> : null
}
