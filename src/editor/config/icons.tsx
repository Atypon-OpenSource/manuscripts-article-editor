import React from 'react'

import Bold from '@manuscripts/assets/images/ToolbarIconBold.svg'
import Citation from '@manuscripts/assets/images/ToolbarIconCitation.svg'
import CodeSnippet from '@manuscripts/assets/images/ToolbarIconCodeSnippet.svg'
import EquationBlock from '@manuscripts/assets/images/ToolbarIconEquation.svg'
import Figure from '@manuscripts/assets/images/ToolbarIconFigure.svg'
import Equation from '@manuscripts/assets/images/ToolbarIconInlineMath@1x.svg'
import Italic from '@manuscripts/assets/images/ToolbarIconItalic.svg'
import OrderedList from '@manuscripts/assets/images/ToolbarIconOrderedList.svg'
import Subscript from '@manuscripts/assets/images/ToolbarIconSubscript.svg'
import Superscript from '@manuscripts/assets/images/ToolbarIconSuperscript.svg'
import Symbol from '@manuscripts/assets/images/ToolbarIconSymbol.svg'
import Table from '@manuscripts/assets/images/ToolbarIconTable.svg'
import Underline from '@manuscripts/assets/images/ToolbarIconUnderline.svg'
import UnorderedList from '@manuscripts/assets/images/ToolbarIconUnorderedList.svg'

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
