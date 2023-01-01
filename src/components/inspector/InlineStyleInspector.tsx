/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  buildInlineStyle,
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptMark,
  ManuscriptMarkType,
  ManuscriptTextSelection,
  ManuscriptTransaction,
} from '@manuscripts/manuscript-transform'
import { InlineStyle, Model } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback } from 'react'

import { findInlineStyles } from '../../lib/styles'
import { InlineStyles } from './InlineStyles'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

type Dispatch = (tr: ManuscriptTransaction) => void

const findMarkOfType = (
  marks: readonly ManuscriptMark[],
  markType: ManuscriptMarkType
): ManuscriptMark | undefined => {
  for (const mark of marks) {
    if (mark.type === markType) {
      return mark
    }
  }
}

const findActiveStyledMark = (
  state: ManuscriptEditorState
): ManuscriptMark | undefined => {
  const { schema, selection } = state

  const { $from, $to, $cursor } = selection as ManuscriptTextSelection

  if ($cursor) {
    const mark = findMarkOfType($cursor.marks(), schema.marks.styled)

    if (mark) {
      return mark
    }
  } else {
    const nodeAfterFrom = $from.nodeAfter

    if (nodeAfterFrom) {
      const mark = findMarkOfType(nodeAfterFrom.marks, schema.marks.styled)

      if (mark) {
        return mark
      }
    }

    const nodeBeforeTo = $to.nodeBefore

    if (nodeBeforeTo) {
      const mark = findMarkOfType(nodeBeforeTo.marks, schema.marks.styled)

      if (mark) {
        return mark
      }
    }
  }
}

const addStyleMark = (
  rid: string,
  state: ManuscriptEditorState,
  dispatch: Dispatch
) => {
  const { tr, schema, selection } = state

  const { from, to } = selection

  if (from < to) {
    dispatch(tr.addMark(from, to, schema.marks.styled.create({ rid })))
  }
}

const removeStyledMark = (
  mark: ManuscriptMark,
  state: ManuscriptEditorState,
  dispatch: Dispatch
) => {
  dispatch(state.tr.removeMark(0, state.tr.doc.content.size, mark))
}

const nextPriority = (inlineStyles: InlineStyle[]) =>
  inlineStyles.reduce((max, style) => {
    return Math.max(max, style.priority || 0)
  }, 0)

export const InlineStyleInspector: React.FC<{
  modelMap: Map<string, Model>
  saveModel: SaveModel
  deleteModel: (id: string) => Promise<string>
  view: ManuscriptEditorView
}> = ({ modelMap, deleteModel, saveModel, view }) => {
  const inlineStyles = findInlineStyles(modelMap)
  const activeStyledMark = findActiveStyledMark(view.state)
  const activeStyle =
    activeStyledMark &&
    (modelMap.get(activeStyledMark.attrs.rid) as InlineStyle | undefined)

  const addStyle = useCallback(() => {
    const inlineStyle = buildInlineStyle(nextPriority(inlineStyles))

    inlineStyle.title = window.prompt('New style name:', '') || undefined

    saveModel(inlineStyle)
      .then(() => {
        addStyleMark(inlineStyle._id, view.state, view.dispatch)
        view.focus()
      })
      .catch((error) => {
        console.error(error)
      })
  }, [inlineStyles, saveModel, view])

  const applyStyle = useCallback(
    (id?: string) => {
      if (activeStyledMark) {
        // TODO: use a node so it can be updated?
        removeStyledMark(activeStyledMark, view.state, view.dispatch)
      }

      if (id) {
        addStyleMark(id, view.state, view.dispatch)
      }

      view.focus()
    },
    [activeStyledMark, view]
  )

  const deleteActiveStyle = useCallback(() => {
    if (activeStyle) {
      if (
        confirm(
          activeStyle.title
            ? `Delete "${activeStyle.title}"?`
            : 'Delete this style?'
        )
      ) {
        deleteModel(activeStyle._id).catch((error) => {
          console.error(error)
        })
      }

      view.focus()
    }
  }, [activeStyle, view, deleteModel])

  const renameActiveStyle = useCallback(() => {
    if (!activeStyle) {
      throw new Error('No active style!')
    }

    const title = window.prompt('New style name:', activeStyle.title)

    if (title && title !== activeStyle.title) {
      saveModel<InlineStyle>({
        ...activeStyle,
        title,
      }).catch((error) => {
        console.error(error)
      })
    }
  }, [activeStyle, saveModel])

  const updateStyle = useCallback(
    (style: string) => {
      saveModel<InlineStyle>({
        ...activeStyle,
        style,
      }).catch((error) => {
        console.error(error)
      })
    },
    [activeStyle, saveModel]
  )

  return (
    <InlineStyles
      activeStyle={activeStyle}
      addStyle={addStyle}
      applyStyle={applyStyle}
      deleteActiveStyle={deleteActiveStyle}
      inlineStyles={inlineStyles}
      renameActiveStyle={renameActiveStyle}
      updateStyle={updateStyle}
    />
  )
}
