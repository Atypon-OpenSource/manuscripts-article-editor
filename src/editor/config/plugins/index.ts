import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { history } from 'prosemirror-history'
import { tableEditing } from 'prosemirror-tables'
import { EditorProps } from '../../Editor'
import bibliography from './bibliography'
import conflicts from './conflicts'
import elements from './elements'
import models from './models'
import objects from './objects'
import paragraphs from './paragraphs'
import persist from './persist'
import placeholder from './placeholder'
import sections from './sections'

import 'prosemirror-gapcursor/style/gapcursor.css'
import 'prosemirror-tables/style/tables.css'

import keys from '../keys'
import rules from '../rules'
import styles from './styles'

export default (props: EditorProps) => [
  rules,
  ...keys,
  dropCursor(),
  gapCursor(),
  history(),
  models(props), // NOTE: this should come first
  conflicts(props),
  elements(),
  persist(),
  sections(),
  styles(props),
  bibliography(props),
  objects(props),
  paragraphs(),
  placeholder(),
  tableEditing(),
]

// for tables
document.execCommand('enableObjectResizing', false, 'false')
document.execCommand('enableInlineTableEditing', false, 'false')
