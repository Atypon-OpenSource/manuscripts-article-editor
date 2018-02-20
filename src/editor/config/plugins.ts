import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { history } from 'prosemirror-history'
import { columnResizing, tableEditing } from 'prosemirror-tables'

import 'prosemirror-gapcursor/style/gapcursor.css'
import 'prosemirror-tables/style/tables.css'

import keys from './keys'
import rules from './rules'

export default [
  rules,
  keys,
  dropCursor(),
  gapCursor(),
  history(),
  columnResizing({}),
  tableEditing(),
]

// for tables
document.execCommand('enableObjectResizing', false, false)
document.execCommand('enableInlineTableEditing', false, false)
