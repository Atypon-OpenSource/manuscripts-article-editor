import React from 'react'

import listing from '@manuscripts/assets/images/OutlineIconCodeSnippet.svg'
import equationBlock from '@manuscripts/assets/images/OutlineIconEquation.svg'
import figure from '@manuscripts/assets/images/OutlineIconFigure.svg'
import manuscript from '@manuscripts/assets/images/OutlineIconManuscript.svg'
import orderedList from '@manuscripts/assets/images/OutlineIconOrderedList.svg'
import paragraph from '@manuscripts/assets/images/OutlineIconParagraph.svg'
import section from '@manuscripts/assets/images/OutlineIconSection.svg'
import table from '@manuscripts/assets/images/OutlineIconTable.svg'
import unorderedList from '@manuscripts/assets/images/OutlineIconUnorderedList.svg'

const icons: Map<string, React.SFC<React.SVGAttributes<SVGElement>>> = new Map([
  ['bibliography', section],
  ['bullet_list', unorderedList],
  ['code_block', listing],
  ['equation_block', equationBlock],
  ['doc', manuscript],
  ['figure', figure],
  ['ordered_list', orderedList],
  ['paragraph', paragraph],
  ['section', section],
  ['table_figure', table],
])

export const nodeTypeIcon = (type: string) => {
  const Icon = icons.get(type)

  return Icon ? <Icon /> : null
}
