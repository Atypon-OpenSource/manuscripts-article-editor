import { History } from 'history'
import { toggleMark } from 'prosemirror-commands'
import { redo, undo } from 'prosemirror-history'
import { wrapInList } from 'prosemirror-schema-list'
import { EditorState } from 'prosemirror-state'
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
} from 'prosemirror-tables'
import React from 'react'
import CrossReferencePickerContainer from '../../containers/CrossReferencePickerContainer'
import LibraryPickerContainer from '../../containers/LibraryPickerContainer'
import { importFile, openFilePicker } from '../../lib/importers'
import { Manuscript } from '../../types/components'
import { ExportManuscript, ImportManuscript } from '../../types/manuscript'
import { DeleteComponent } from '../Editor'
import { textContent } from '../title/config'
import {
  blockActive,
  canInsert,
  ifInTableBody,
  insertBlock,
  insertInlineEquation,
  markActive,
} from './commands'
import icons from './icons'
import schema from './schema'
import { Dispatch } from './types'

export interface MenuItem {
  label?: React.ReactNode
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

export interface MenusProps {
  manuscript: Manuscript
  addManuscript?: () => void
  importManuscript: ImportManuscript
  exportManuscript: ExportManuscript
  deleteComponent: DeleteComponent
  history: History
}

const menus = (props: MenusProps): MenuItem[] => [
  {
    label: 'Project',
    submenu: [
      {
        label: 'New',
        submenu: [
          {
            label: 'Manuscript with Template…',
          },
          {
            label: 'Manuscript',
            run: props.addManuscript,
          },
        ],
      },
      {
        label: 'Open Recent',
        submenu: [], // TODO
      },
      {
        role: 'separator',
      },
      {
        label: 'Import…',
        run: () =>
          openFilePicker()
            .then(importFile)
            .then(props.importManuscript),
      },
      {
        label: 'Export as…',
        submenu: [
          {
            label: 'Markdown',
            run: () => props.exportManuscript('.md'),
          },
          {
            label: 'Microsoft Word',
            run: () => props.exportManuscript('.docx'),
          },
          {
            label: 'PDF',
            run: () => props.exportManuscript('.pdf'),
          },
        ],
      },
      {
        role: 'separator',
      },
      {
        label: 'Delete Project',
        run: () =>
          confirm('Are you sure you wish to delete this project?') &&
          props
            .deleteComponent(props.manuscript.containerID)
            .then(() => props.history.push('/')),
      },
      {
        label: props.manuscript.title ? (
          <span>
            Delete “
            <abbr
              style={{ textDecoration: 'none' }}
              title={textContent(props.manuscript.title)}
            >
              {textContent(props.manuscript.title, 15)}
            </abbr>
            ”
          </span>
        ) : (
          'Delete Untitled Manuscript'
        ),
        run: () =>
          confirm(
            props.manuscript.title
              ? `Are you sure you wish to delete the manuscript with title "${textContent(
                  props.manuscript.title
                )}"?`
              : `Are you sure you wish to delete this untitled manuscript?`
          ) &&
          props
            .deleteComponent(props.manuscript.id)
            .then(() => props.history.push('/')),
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
      {
        role: 'separator',
      },
      {
        label: 'Table',
        submenu: [
          {
            label: 'Add Row Above',
            enable: ifInTableBody(addRowBefore),
            run: addRowBefore,
          },
          {
            label: 'Add Row Below',
            enable: ifInTableBody(addRowAfter),
            run: addRowAfter,
          },
          {
            label: 'Delete Row',
            enable: ifInTableBody(deleteRow),
            run: deleteRow,
          },
          {
            role: 'separator',
          },
          {
            label: 'Add Column Before',
            enable: addColumnBefore,
            run: addColumnBefore,
          },
          {
            label: 'Add Column After',
            enable: addColumnAfter,
            run: addColumnAfter,
          },
          {
            label: 'Delete Column',
            enable: deleteColumn,
            run: deleteColumn,
          },
        ],
      },
    ],
  },
]

export default menus
