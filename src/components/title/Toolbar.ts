/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */

import { toggleMark } from 'prosemirror-commands'
import { MarkType } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

import icons from './Icons'
import { schema } from './Schema'
import { ToolbarConfig } from './TitleToolbar'

const markActive =
  (type: MarkType) =>
  (state: EditorState): boolean => {
    const { from, $from, to, empty } = state.selection

    return empty
      ? Boolean(type.isInSet(state.storedMarks || $from.marks()))
      : state.doc.rangeHasMark(from, to, type)
  }

export const toolbar: ToolbarConfig = {
  style: {
    italic: {
      title: 'Toggle italic',
      content: icons.italic,
      active: markActive(schema.marks.italic),
      enable: toggleMark(schema.marks.italic),
      run: toggleMark(schema.marks.italic),
    },
    /*smallcaps: {
      title: 'Toggle small caps',
      content: icons.smallcaps,
      active: markActive(schema.marks.smallcaps),
      enable: toggleMark(schema.marks.smallcaps),
      run: toggleMark(schema.marks.smallcaps),
    },*/
  },
  vertical: {
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
  },
}
