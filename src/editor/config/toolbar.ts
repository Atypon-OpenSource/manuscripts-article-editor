import {
  // joinUp,
  // lift,
  // setBlockType,
  toggleMark,
  // wrapIn,
} from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'
// import CrossReferencePickerContainer from '../../containers/CrossReferencePickerContainer'
import LibraryPickerContainer from '../../components/library/LibraryPickerContainer'
import { ToolbarButtonMap } from '../Toolbar'
// import { addColumnAfter, addColumnBefore } from 'prosemirror-tables'

import {
  blockActive,
  canInsert,
  insertBlock,
  // insertInlineEquation,
  markActive,
} from './commands'
import icons from './icons'
import schema from './schema'

const styles: ToolbarButtonMap = {
  bold: {
    title: 'Toggle bold',
    content: icons.bold,
    active: markActive(schema.marks.bold),
    enable: toggleMark(schema.marks.bold),
    run: toggleMark(schema.marks.bold),
  },
  italic: {
    title: 'Toggle italic',
    content: icons.italic,
    active: markActive(schema.marks.italic),
    enable: toggleMark(schema.marks.italic),
    run: toggleMark(schema.marks.italic),
  },
  underline: {
    title: 'Toggle underline',
    content: icons.underline,
    active: markActive(schema.marks.underline),
    enable: toggleMark(schema.marks.underline),
    run: toggleMark(schema.marks.underline),
  },
}

const verticals: ToolbarButtonMap = {
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

const blocks: ToolbarButtonMap = {
  // plain: {
  //   title: 'Change to paragraph',
  //   content: images.paragraph,
  //   active: blockActive(schema.nodes.paragraph),
  //   enable: setBlockType(schema.nodes.paragraph),
  //   run: setBlockType(schema.nodes.paragraph),
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
  //   content: icons.lift,
  //   enable: lift,
  //   run: lift,
  // },
  // join_up: {
  //   title: 'Join with above block',
  //   content: icons.join_up,
  //   enable: joinUp,
  //   run: joinUp,
  // },
}

const insertCitation: ToolbarButtonMap = {
  citation: {
    title: 'Insert citation',
    content: icons.citation,
    enable: canInsert(schema.nodes.citation),
    dropdown: LibraryPickerContainer,
  },
}

// const insertCrossReference: ToolbarButtonMap = {
//   cross_reference: {
//     title: 'Insert cross reference',
//     content: icons.citation,
//     enable: canInsert(schema.nodes.cross_reference),
//     dropdown: CrossReferencePickerContainer,
//   },
// }

const inserts: ToolbarButtonMap = {
  figure_element: {
    title: 'Insert figure',
    content: icons.figure_element,
    enable: canInsert(schema.nodes.figure_element),
    run: insertBlock(schema.nodes.figure_element),
  },
  table_element: {
    title: 'Insert table',
    content: icons.table_element,
    enable: canInsert(schema.nodes.table_element),
    run: insertBlock(schema.nodes.table_element),
  },
  equation_element: {
    title: 'Insert equation',
    content: icons.equation_element,
    enable: canInsert(schema.nodes.equation_element),
    run: insertBlock(schema.nodes.equation_element),
  },
  listing_element: {
    title: 'Insert listing',
    content: icons.listing_element,
    enable: canInsert(schema.nodes.listing_element),
    run: insertBlock(schema.nodes.listing_element),
  },
}

// const insert: ToolbarButtonMap = {
//   hr: {
//     title: 'Insert horizontal rule',
//     content: 'HR',
//     enable: canInsert(schema.nodes.horizontal_rule),
//     run: (state, dispatch) => {
//       const hr = schema.nodes.horizontal_rule.create()
//       dispatch(state.tr.insert(state.tr.selection.anchor, hr))
//     }
//   },
// }
//
// const history: ToolbarButtonMap = {
//   undo: {
//     title: 'Undo last change',
//     content: images.undo,
//     enable: undo,
//     run: undo,
//   },
//   redo: {
//     title: 'Redo last undone change',
//     content: images.redo,
//     enable: redo,
//     run: redo,
//   },
// }

export default {
  styles,
  verticals,
  // inlines,
  blocks,
  insertCitation,
  inserts,
}
