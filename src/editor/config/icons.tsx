import React from 'react'

import Bold from '@manuscripts/assets/react/ToolbarIconBold'
import Citation from '@manuscripts/assets/react/ToolbarIconCitation'
import CodeSnippet from '@manuscripts/assets/react/ToolbarIconCodeSnippet'
import Equation from '@manuscripts/assets/react/ToolbarIconEquation'
import Figure from '@manuscripts/assets/react/ToolbarIconFigure'
import InlineMath from '@manuscripts/assets/react/ToolbarIconInlineMath'
import Italic from '@manuscripts/assets/react/ToolbarIconItalic'
import OrderedList from '@manuscripts/assets/react/ToolbarIconOrderedList'
import Subscript from '@manuscripts/assets/react/ToolbarIconSubscript'
import Superscript from '@manuscripts/assets/react/ToolbarIconSuperscript'
import Symbol from '@manuscripts/assets/react/ToolbarIconSymbol'
import Table from '@manuscripts/assets/react/ToolbarIconTable'
import Underline from '@manuscripts/assets/react/ToolbarIconUnderline'
import UnorderedList from '@manuscripts/assets/react/ToolbarIconUnorderedList'

export default {
  italic: <Italic />,
  bold: <Bold />,
  subscript: <Subscript />,
  superscript: <Superscript />,
  underline: <Underline />,
  ordered_list: <OrderedList />,
  bullet_list: <UnorderedList />,
  figure_element: <Figure />,
  table_element: <Table />,
  citation: <Citation />,
  inline_equation: <InlineMath />,
  equation_element: <Equation />,
  listing_element: <CodeSnippet />,
  symbol: <Symbol />,
}
