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
import { TextSelection, Selection } from 'prosemirror-state'
import { Node as PmNode } from 'prosemirror-model'
import { CHANGE_STATUS, trackCommands, clear } from '@manuscripts/track-changes-plugin'
import { useCallback, useEffect } from 'react'

import { useStore } from '../store'
import useExecCmd from './use-exec-cmd'

export const useDebugUtils = () => {
  const [trackState] = useStore((store) => store.trackState)
  const [view] = useStore((store) => store.view)
  const execCmd = useExecCmd()

  const revertAllChanges = useCallback(() => {
    execCmd(
      trackCommands.setChangeStatuses(
        CHANGE_STATUS.rejected,
        trackState?.changeSet.changes.map((m) => m.id) || []
      )
    )
  }, [trackState, execCmd])

  useEffect(() => {
    // @ts-ignore
    window.revertAllChanges = revertAllChanges

    // @ts-ignore
    window.prosemirrorView = view // for easier for debugging
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // @ts-ignore
    window.prosemirrorViewHelpers = {
      iterateChidren: (node: PmNode) => clear(node),
      setCursor(pos: number) {
        // @ts-ignore
        const view = window.prosemirrorView as EditorView
        const sel = TextSelection.create(view.state.doc, pos)
        view.dispatch(view.state.tr.setSelection(sel))
        view.focus()
      },
      setCursorNear(pos: number, bias: number = -1) {
        // @ts-ignore
        const view = window.prosemirrorView as EditorView
        const sel = Selection.near(view.state.doc.resolve(pos), bias)
        view.dispatch(view.state.tr.setSelection(sel))
        view.focus()
      },
      setTextSelection(from: number, to: number) {
        // @ts-ignore
        const view = window.prosemirrorView as EditorView
        const sel = TextSelection.create(view.state.doc, from, to)
        view.dispatch(view.state.tr.setSelection(sel))
        view.focus()
      },
      findText(text: string, startPos = 0) {
        // @ts-ignore
        const view = window.prosemirrorView as EditorView
        let result: { from: number; to: number } | null = null
        view.state.doc.descendants((node: PmNode, pos: number) => {
          if (result) return false
          if (node.isText) {
            const offset = pos >= startPos ? 0 : startPos - pos
            const index = node.text ? node.text.indexOf(text, offset) : -1
            if (index >= 0) {
              const from = pos + index
              result = { from, to: from + text.length }
              return false
            }
          }
        })
        return result
      },
      findTextInRange(text: string, from: number, to: number) {
        let result: { from: number; to: number } | null = null
        // @ts-ignore
        const view = window.prosemirrorView as EditorView
        view.state.doc.nodesBetween(from, to, (node: PmNode, pos: number) => {
          if (result) return false
          if (node.isText) {
            const index = node.text ? node.text.indexOf(text) : -1
            if (index >= 0) {
              const absFrom = pos + index
              if (absFrom >= from && absFrom + text.length <= to) {
                result = { from: absFrom, to: absFrom + text.length }
                return false
              }
            }
          }
        })
        return result
      },
    }
  }, [view?.state])
}
