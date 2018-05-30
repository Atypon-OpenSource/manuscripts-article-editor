import { toggleMark } from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { wrapInList } from 'prosemirror-schema-list'
import { EditorState } from 'prosemirror-state'
import React from 'react'
import CrossReferencePickerContainer from '../../containers/CrossReferencePickerContainer'
import LibraryPickerContainer from '../../containers/LibraryPickerContainer'
import {
  blockActive,
  canInsert,
  insertBlock,
  insertInlineEquation,
  markActive,
} from './commands'
import icons from './icons'
import schema from './schema'
import { Dispatch } from './types'

export interface MenuItem {
  label?: string
  role?: string
  type?: string
  accelerator?: string
  icon?: React.ReactNode
  dropdown?: any // tslint:disable-line:no-any // TODO
  active?: (state: EditorState) => boolean
  enable?: (state: EditorState) => boolean
  run?: (state: EditorState, dispatch: Dispatch) => void
  submenu?: MenuItem[]
}

const menus: MenuItem[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        submenu: [
          {
            label: 'Manuscript with Template…',
          },
          {
            label: 'Manuscript',
          },
        ],
      },
      {
        role: 'separator',
      },
      {
        label: 'Open…',
        accelerator: '⌘O',
      },
      {
        label: 'Open Recent',
        submenu: [], // TODO
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo',
        label: 'Undo',
        accelerator: '⌘Z',
        // icon: icons.undo,
        enable: undo,
        run: undo,
      },
      {
        role: 'redo',
        label: 'Redo',
        // icon: icons.redo,
        accelerator: '⇧⌘Z',
        enable: redo,
        run: redo,
      },
    ],
  },
  {
    label: 'Insert',
    submenu: [
      {
        label: 'Paragraph',
        active: blockActive(schema.nodes.paragraph),
        enable: wrapInList(schema.nodes.paragraph),
        run: wrapInList(schema.nodes.paragraph),
      },
      {
        role: 'separator',
      },
      {
        label: 'Numbered List',
        accelerator: '⌃⌘O',
        icon: icons.ordered_list,
        active: blockActive(schema.nodes.ordered_list),
        enable: wrapInList(schema.nodes.ordered_list),
        run: wrapInList(schema.nodes.ordered_list),
      },
      {
        label: 'Bullet List',
        accelerator: '⌃⌘U',
        icon: icons.bullet_list,
        active: blockActive(schema.nodes.bullet_list),
        enable: wrapInList(schema.nodes.bullet_list),
        run: wrapInList(schema.nodes.bullet_list),
      },
      {
        role: 'separator',
      },
      {
        label: 'Figure Panel',
        accelerator: '⌃⌘P',
        icon: icons.figure,
        active: blockActive(schema.nodes.figure),
        enable: canInsert(schema.nodes.figure),
        run: insertBlock(schema.nodes.figure),
      },
      {
        label: 'Table',
        accelerator: '⌃⌘T',
        icon: icons.bullet_list,
        active: blockActive(schema.nodes.table_figure),
        enable: canInsert(schema.nodes.table_figure),
        run: insertBlock(schema.nodes.table_figure),
      },
      {
        label: 'Listing',
        accelerator: '⌃⌘L',
        icon: icons.bullet_list,
        active: blockActive(schema.nodes.code_block),
        enable: canInsert(schema.nodes.code_block),
        run: insertBlock(schema.nodes.code_block),
      },
      {
        role: 'separator',
      },
      {
        label: 'Equation',
        accelerator: '⌃⌘E',
        icon: icons.equation_block,
        active: blockActive(schema.nodes.equation_block),
        enable: canInsert(schema.nodes.equation_block),
        run: insertBlock(schema.nodes.equation_block),
      },
      {
        label: 'Inline Equation',
        accelerator: '⌃⌥⌘E',
        icon: icons.equation,
        active: blockActive(schema.nodes.equation),
        enable: canInsert(schema.nodes.equation),
        run: insertInlineEquation,
      },
      {
        role: 'separator',
      },
      {
        label: 'Citation',
        accelerator: '⌃⌘C',
        icon: icons.citation,
        enable: canInsert(schema.nodes.citation),
        dropdown: LibraryPickerContainer,
      },
      {
        label: 'Cross-reference',
        accelerator: '⌃⌘R',
        icon: icons.citation,
        enable: canInsert(schema.nodes.cross_reference),
        dropdown: CrossReferencePickerContainer,
        // TODO: build a nested menu?
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Bold',
        accelerator: '⌘B',
        icon: icons.bold,
        active: markActive(schema.marks.bold),
        enable: toggleMark(schema.marks.bold),
        run: toggleMark(schema.marks.bold),
      },
      {
        label: 'Italic',
        accelerator: '⌘I',
        icon: icons.italic,
        active: markActive(schema.marks.italic),
        enable: toggleMark(schema.marks.italic),
        run: toggleMark(schema.marks.italic),
      },
      {
        label: 'Underline',
        accelerator: '⌘U',
        icon: icons.underline,
        active: markActive(schema.marks.underline),
        enable: toggleMark(schema.marks.underline),
        run: toggleMark(schema.marks.underline),
      },
      {
        role: 'separator',
      },
      {
        label: 'Superscript',
        accelerator: '⌥⌘=',
        icon: icons.superscript,
        active: markActive(schema.marks.superscript),
        enable: toggleMark(schema.marks.superscript),
        run: toggleMark(schema.marks.superscript),
      },
      {
        label: 'Subscript',
        accelerator: '⌥⌘-',
        icon: icons.subscript,
        active: markActive(schema.marks.subscript),
        enable: toggleMark(schema.marks.subscript),
        run: toggleMark(schema.marks.subscript),
      },
    ],
  },
]

export default menus
