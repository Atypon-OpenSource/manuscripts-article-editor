import * as React from 'react'

import * as bold from '../icons/Toolbar-BoldTextTemplate@2x.png'
import * as bulletList from '../icons/Toolbar-BulletListTemplate@2x.png'
import * as citation from '../icons/Toolbar-InsertCitation-N@2x.png'
import * as equation from '../icons/Toolbar-InsertEquation-N@2x.png'
import * as image from '../icons/Toolbar-InsertImage-N@2x.png'
import * as symbol from '../icons/Toolbar-InsertSymbolTemplate@2x.png'
import * as table from '../icons/Toolbar-InsertTable-N@2x.png'
import * as italic from '../icons/Toolbar-ItalicTextTemplate@2x.png'
import * as notes from '../icons/Toolbar-Notes-N@2x.png'
import * as orderedList from '../icons/Toolbar-NumberedListTemplate@2x.png'
import * as subscript from '../icons/Toolbar-SubscriptTextTemplate@2x.png'
import * as superscript from '../icons/Toolbar-SuperscriptTextTemplate@2x.png'
import * as highlight from '../icons/Toolbar-ToggleHighlight-N@2x.png'
import * as underline from '../icons/Toolbar-UnderlinedTextTemplate@2x.png'

interface ImageIconProps {
  src: string
  size?: number
}
const Icon: React.SFC<ImageIconProps> = ({ src, size = 12 }) => (
  <img src={src} height={size} />
)

export default {
  em: <Icon src={italic} />,
  italic: <Icon src={italic} />,
  strong: <Icon src={bold} />,
  bold: <Icon src={bold} />,
  // code: <Icon src={code} />,
  subscript: <Icon src={subscript} />,
  superscript: <Icon src={superscript} />,
  underline: <Icon src={underline} />,
  // strikethrough: <Icon src={strikethrough} />,
  // link: <Icon src={link} />,
  // paragraph: <Icon src={paragraph} />,
  // heading: <Icon src={heading} />,
  // blockquote: <Icon src={quote} />,
  // code_block: <Icon src={code} />,
  ordered_list: <Icon src={orderedList} />,
  bullet_list: <Icon src={bulletList} />,
  image: <Icon src={image} />,
  table: <Icon src={table} />,
  // footnote: <Icon src={footnote} />,
  // undo: <Icon src={undo} />,
  // redo: <Icon src={redo} />,
  // lift: <Icon src={outdent} />,
  // join_up: <Icon src={joinUp} />,
  citation: <Icon src={citation} />,
  equation: <Icon src={equation} />,
  symbol: <Icon src={symbol} />,
  notes: <Icon src={notes} />,
  highlight: <Icon src={highlight} />,
}
