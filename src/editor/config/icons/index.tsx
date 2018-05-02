import React from 'react'

import equation from './png/InlineMathA.png'
import bold from './png/Toolbar-BoldTextTemplate@2x.png'
import bulletList from './png/Toolbar-BulletListTemplate@2x.png'
import citation from './png/Toolbar-InsertCitation-N@2x.png'
import equationBlock from './png/Toolbar-InsertEquation-N@2x.png'
import image from './png/Toolbar-InsertImage-N@2x.png'
import symbol from './png/Toolbar-InsertSymbolTemplate@2x.png'
import table from './png/Toolbar-InsertTable-N@2x.png'
import italic from './png/Toolbar-ItalicTextTemplate@2x.png'
import notes from './png/Toolbar-Notes-N@2x.png'
import orderedList from './png/Toolbar-NumberedListTemplate@2x.png'
import subscript from './png/Toolbar-SubscriptTextTemplate@2x.png'
import superscript from './png/Toolbar-SuperscriptTextTemplate@2x.png'
import highlight from './png/Toolbar-ToggleHighlight-N@2x.png'
import underline from './png/Toolbar-UnderlinedTextTemplate@2x.png'

interface ImageIconProps {
  src: string
  size?: number
}
const Icon: React.SFC<ImageIconProps> = ({ src, size = 12 }) => (
  <img src={src} height={size} />
)

export default {
  // em: <Icon src={italic} />,
  italic: <Icon src={italic} />,
  // strong: <Icon src={bold} />,
  bold: <Icon src={bold} />,
  // code: <Icon src={code} />,
  subscript: <Icon src={subscript} />,
  superscript: <Icon src={superscript} />,
  underline: <Icon src={underline} />,
  // strikethrough: <Icon src={strikethrough} />,
  // smallcaps: <Icon src={smallcaps} />,
  // link: <Icon src={link} />,
  // paragraph: <Icon src={paragraph} />,
  // heading: <Icon src={heading} />,
  // blockquote: <Icon src={quote} />,
  // code_block: <Icon src={code} />,
  ordered_list: <Icon src={orderedList} />,
  bullet_list: <Icon src={bulletList} />,
  figure: <Icon src={image} />,
  table: <Icon src={table} />,
  // footnote: <Icon src={footnote} />,
  // undo: <Icon src={undo} />,
  // redo: <Icon src={redo} />,
  // lift: <Icon src={outdent} />,
  // join_up: <Icon src={joinUp} />,
  citation: <Icon src={citation} />,
  equation: <Icon src={equation} />,
  equation_block: <Icon src={equationBlock} />,
  symbol: <Icon src={symbol} />,
  notes: <Icon src={notes} />,
  highlight: <Icon src={highlight} />,
}
