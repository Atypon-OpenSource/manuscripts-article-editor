import React from 'react'

import Bold from '@manuscripts/assets/react/ToolbarIconBold'
import Citation from '@manuscripts/assets/react/ToolbarIconCitation'
import CodeSnippet from '@manuscripts/assets/react/ToolbarIconCodeSnippet'
import EquationBlock from '@manuscripts/assets/react/ToolbarIconEquation'
import Figure from '@manuscripts/assets/react/ToolbarIconFigure'
import Equation from '@manuscripts/assets/react/ToolbarIconInlineMath'
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
  figure: <Figure />,
  table: <Table />,
  citation: <Citation />,
  equation: <Equation />,
  equation_block: <EquationBlock />,
  code_block: <CodeSnippet />,
  symbol: <Symbol />,
}
