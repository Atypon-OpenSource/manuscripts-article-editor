import {
  // joinUp,
  // lift,
  // setBlockType,
  toggleMark,
  // wrapIn,
} from 'prosemirror-commands'
// import { redo, undo } from 'prosemirror-history'
import { MarkType, Node as ProsemirrorNode, NodeType } from 'prosemirror-model'
import { wrapInList } from 'prosemirror-schema-list'
import {
  AllSelection,
  EditorState,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state'
// import { addColumnAfter, addColumnBefore } from 'prosemirror-tables'

import icons from './icons'
import schema from './schema'
import { MenuButtonMap } from './types'

interface AnySelection extends NodeSelection, TextSelection, AllSelection {}

const markActive = (type: MarkType) => (state: EditorState): boolean => {
  const { from, $from, to, empty } = state.selection as AnySelection

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type)
}

const blockActive = (type: NodeType, attrs = {}) => (state: EditorState) => {
  const { $from, to, node } = state.selection as AnySelection

  if (node) {
    return node.hasMarkup(type, attrs)
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs)
}

const canInsert = (type: NodeType) => (state: EditorState) => {
  const { $from } = state.selection as AnySelection

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d)

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true
    }
  }

  return false
}

const promptForURL = () => {
  let url = window && window.prompt('Enter the URL', 'https://')

  if (url && !/^https?:\/\//i.test(url)) {
    url = 'http://' + url
  }

  return url
}

const styles: MenuButtonMap = {
  strong: {
    title: 'Toggle strong',
    content: icons.strong,
    active: markActive(schema.marks.strong),
    enable: toggleMark(schema.marks.strong),
    run: toggleMark(schema.marks.strong),
  },
  em: {
    title: 'Toggle emphasis',
    content: icons.em,
    active: markActive(schema.marks.em),
    enable: toggleMark(schema.marks.em),
    run: toggleMark(schema.marks.em),
  },
  underline: {
    title: 'Toggle underline',
    content: icons.underline,
    active: markActive(schema.marks.underline),
    enable: toggleMark(schema.marks.underline),
    run: toggleMark(schema.marks.underline),
  },
}

const verticals: MenuButtonMap = {
  subscript: {
    title: 'Toggle subscript',
    content: icons.subscript,
    active: markActive(schema.marks.subscript),
    enable: toggleMark(schema.marks.subscript),
    run: toggleMark(schema.marks.subscript),
  },
  superscript: {
    title: 'Toggle superscript',
    content: icons.superscript,
    active: markActive(schema.marks.superscript),
    enable: toggleMark(schema.marks.superscript),
    run: toggleMark(schema.marks.superscript),
  },
}

const blocks: MenuButtonMap = {
  // plain: {
  //   title: 'Change to paragraph',
  //   content: images.paragraph,
  //   active: blockActive(schema.nodes.paragraph),
  //   enable: setBlockType(schema.nodes.paragraph),
  //   run: setBlockType(schema.nodes.paragraph),
  // },
  // code_block: {
  //   title: 'Change to code block',
  //   content: images.code_block,
  //   active: blockActive(schema.nodes.code_block),
  //   enable: setBlockType(schema.nodes.code_block),
  //   run: setBlockType(schema.nodes.code_block),
  // },
  // h1: {
  //   title: 'Change to heading level 1',
  //   content: images.heading,
  //   active: blockActive(schema.nodes.heading, { level: 1 }),
  //   enable: setBlockType(schema.nodes.heading, { level: 1 }),
  //   run: setBlockType(schema.nodes.heading, { level: 1 }),
  // },
  // h2: {
  //   title: 'Change to heading level 2',
  //   content: 'H2',
  //   active: blockActive(schema.nodes.heading, { level: 2 }),
  //   enable: setBlockType(schema.nodes.heading, { level: 2 }),
  //   run: setBlockType(schema.nodes.heading, { level: 2 })
  // },
  // blockquote: {
  //   title: 'Wrap in block quote',
  //   content: images.blockquote,
  //   active: blockActive(schema.nodes.blockquote),
  //   enable: wrapIn(schema.nodes.blockquote),
  //   run: wrapIn(schema.nodes.blockquote),
  // },
  bullet_list: {
    title: 'Wrap in bullet list',
    content: icons.bullet_list,
    active: blockActive(schema.nodes.bullet_list),
    enable: wrapInList(schema.nodes.bullet_list),
    run: wrapInList(schema.nodes.bullet_list),
  },
  ordered_list: {
    title: 'Wrap in ordered list',
    content: icons.ordered_list,
    active: blockActive(schema.nodes.ordered_list),
    enable: wrapInList(schema.nodes.ordered_list),
    run: wrapInList(schema.nodes.ordered_list),
  },
  // lift: {
  //   title: 'Lift out of enclosing block',
  //   content: images.lift,
  //   enable: lift,
  //   run: lift,
  // },
  // join_up: {
  //   title: 'Join with above block',
  //   content: images.join_up,
  //   enable: joinUp,
  //   run: joinUp,
  // },
}

const insert: MenuButtonMap = {
  image: {
    title: 'Insert image',
    content: icons.image,
    enable: canInsert(schema.nodes.image),
    run: (state, dispatch) => {
      const src = promptForURL()
      if (!src) return false

      const img = schema.nodes.image.createAndFill({ src })
      dispatch(state.tr.replaceSelectionWith(img as ProsemirrorNode))
      return
    },
  },
  // footnote: {
  //   title: 'Insert footnote',
  //   content: images.footnote,
  //   enable: canInsert(schema.nodes.footnote),
  //   run: (state, dispatch) => {
  //     const footnote = schema.nodes.footnote.create()
  //     dispatch(state.tr.replaceSelectionWith(footnote))
  //   },
  // },
  // hr: {
  //   title: 'Insert horizontal rule',
  //   content: 'HR',
  //   enable: canInsert(schema.nodes.horizontal_rule),
  //   run: (state, dispatch) => {
  //     const hr = schema.nodes.horizontal_rule.create()
  //     dispatch(state.tr.replaceSelectionWith(hr))
  //   }
  // },
  table: {
    title: 'Insert table',
    content: icons.table,
    enable: canInsert(schema.nodes.table),
    run: (state, dispatch) => {
      // const { from } = state.selection
      let rowCount = window ? Number(window.prompt('How many rows?', '2')) : 2
      let colCount = window
        ? Number(window.prompt('How many columns?', '2'))
        : 2

      /* tslint:disable-next-line:no-any */
      const cells: any[] = []
      while (colCount--) {
        cells.push(schema.nodes.table_cell.createAndFill())
      }

      /* tslint:disable-next-line:no-any */
      const rows: any[] = []
      while (rowCount--) {
        rows.push(schema.nodes.table_row.createAndFill({}, cells))
      }

      const table = schema.nodes.table.createAndFill({}, rows)
      dispatch(state.tr.replaceSelectionWith(table as ProsemirrorNode))

      // const tr = state.tr.replaceSelectionWith(table)
      // tr.setSelection(Selection.near(tr.doc.resolve(from)))
      // dispatch(tr.scrollIntoView())
      // view.focus()
    },
  },
}

const history: MenuButtonMap = {
  // undo: {
  //   title: 'Undo last change',
  //   content: images.undo,
  //   enable: undo,
  //   run: undo,
  // },
  // redo: {
  //   title: 'Redo last undone change',
  //   content: images.redo,
  //   enable: redo,
  //   run: redo,
  // },
}

const table: MenuButtonMap = {
  // addColumnBefore: {
  //   title: 'Insert column before',
  //   content: images.after,
  //   active: addColumnBefore, // TOOD: active -> select
  //   run: addColumnBefore
  // },
  // addColumnAfter: {
  //   title: 'Insert column before',
  //   content: images.before,
  //   active: addColumnAfter, // TOOD: active -> select
  //   run: addColumnAfter
  // }
}

export default {
  styles,
  verticals,
  blocks,
  insert,
  history,
  table,
}
