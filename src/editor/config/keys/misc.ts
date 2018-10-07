import {
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
  toggleMark,
  wrapIn,
} from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { undoInputRule } from 'prosemirror-inputrules'
import { wrapInList } from 'prosemirror-schema-list'
import { goToNextCell } from 'prosemirror-tables'
// import CrossReferencePickerContainer from '../../../containers/CrossReferencePickerContainer'
// import LibraryPickerContainer from '../../../containers/LibraryPickerContainer'
import {
  ignoreAtomBlockNodeBackward,
  ignoreAtomBlockNodeForward,
  insertBlock,
  insertInlineEquation,
  selectAllIsolating,
} from '../commands'
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
  Backspace: chainCommands(undoInputRule, ignoreAtomBlockNodeBackward),
  Delete: ignoreAtomBlockNodeForward,
  'Mod-y': redo,
  'Alt-ArrowUp': joinUp,
  'Alt-ArrowDown': joinDown,
  'Mod-BracketLeft': lift,
  Escape: selectParentNode,
  'Mod-a': selectAllIsolating,
  'Mod-b': toggleMark(schema.marks.bold),
  'Mod-i': toggleMark(schema.marks.italic),
  'Mod-u': toggleMark(schema.marks.underline),
  'Mod-`': toggleMark(schema.marks.code),
  'Alt-Mod-=': toggleMark(schema.marks.superscript),
  'Alt-Mod--': toggleMark(schema.marks.subscript),
  'Ctrl->': wrapIn(schema.nodes.blockquote),
  'Mod-Enter': chainCommands(exitCode, insertBreak),
  'Shift-Enter': chainCommands(exitCode, insertBreak),
  'Ctrl-Enter': chainCommands(exitCode, insertBreak), // mac-only?
  // 'Shift-Ctrl-0': setBlockType(schema.nodes.paragraph),
  // 'Shift-Ctrl-\\': setBlockType(schema.nodes.listing_element),
  'Mod-_': insertRule,
  Tab: goToNextCell(1),
  'Shift-Tab': goToNextCell(-1),
  'Ctrl-Mod-o': wrapInList(schema.nodes.ordered_list),
  'Ctrl-Mod-u': wrapInList(schema.nodes.bullet_list),
  'Ctrl-Mod-p': insertBlock(schema.nodes.figure_element),
  'Ctrl-Mod-t': insertBlock(schema.nodes.table_element),
  'Ctrl-Mod-l': insertBlock(schema.nodes.listing_element),
  'Ctrl-Mod-e': insertBlock(schema.nodes.equation_element),
  'Ctrl-Alt-Mod-e': insertInlineEquation,
  // 'Ctrl-Mod-c': openModal(LibraryPickerContainer),
  // 'Ctrl-Mod-r': openModal(CrossReferencePickerContainer),
}

export default customKeymap
