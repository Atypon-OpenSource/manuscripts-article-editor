import {
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
  setBlockType,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { undoInputRule } from 'prosemirror-inputrules'
import { goToNextCell } from 'prosemirror-tables'
import schema from '../schema'
import { EditorAction, StringMap } from '../types'

const insertBreak: EditorAction = (state, dispatch) => {
  const br = schema.nodes.hard_break.create()
  dispatch(state.tr.replaceSelectionWith(br).scrollIntoView())
  return true
}

const insertRule: EditorAction = (state, dispatch) => {
  const hr = schema.nodes.horizontal_rule.create()
  dispatch(state.tr.replaceSelectionWith(hr).scrollIntoView())
  return true
}

const customKeymap: StringMap<EditorAction> = {
  'Mod-z': undo,
  'Shift-Mod-z': redo,
  Backspace: undoInputRule,
  'Mod-y': redo,
  'Alt-ArrowUp': joinUp,
  'Alt-ArrowDown': joinDown,
  'Mod-BracketLeft': lift,
  Escape: selectParentNode,
  'Mod-b': toggleMark(schema.marks.bold),
  'Mod-i': toggleMark(schema.marks.italic),
  'Mod-u': toggleMark(schema.marks.underline),
  'Mod-`': toggleMark(schema.marks.code),
  'Ctrl->': wrapIn(schema.nodes.blockquote),
  'Mod-Enter': chainCommands(exitCode, insertBreak),
  'Shift-Enter': chainCommands(exitCode, insertBreak),
  'Ctrl-Enter': chainCommands(exitCode, insertBreak), // mac-only?
  'Shift-Ctrl-0': setBlockType(schema.nodes.paragraph),
  'Shift-Ctrl-\\': setBlockType(schema.nodes.code_block),
  'Shift-Ctrl-1': setBlockType(schema.nodes.heading, { level: 1 }),
  'Shift-Ctrl-2': setBlockType(schema.nodes.heading, { level: 2 }),
  'Shift-Ctrl-3': setBlockType(schema.nodes.heading, { level: 3 }),
  'Shift-Ctrl-4': setBlockType(schema.nodes.heading, { level: 4 }),
  'Shift-Ctrl-5': setBlockType(schema.nodes.heading, { level: 5 }),
  'Shift-Ctrl-6': setBlockType(schema.nodes.heading, { level: 6 }),
  'Mod-_': insertRule,
  Tab: goToNextCell(1),
  'Shift-Tab': goToNextCell(-1),
}

export default customKeymap
