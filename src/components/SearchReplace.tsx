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

import { TextField } from '@manuscripts/style-guide'
import { findReplacePluginKey } from '@manuscripts/body-editor'
import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { useStore } from '../store'

function getClosestMatch(
  side: 'left' | 'right',
  selection: { from: number; to: number },
  matches: { from: number; to: number }[]
) {
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    if (
      side == 'right' &&
      match.from > selection.to &&
      (!matches[i - 1] || matches[i - 1].to <= selection.to)
    ) {
      return i
    }

    if (
      side == 'left' &&
      match.from < selection.from &&
      (!matches[i + 1] || matches[i + 1].from >= selection.from)
    ) {
      return i
    }
  }
}

function getNewMatch(
  side: 'left' | 'right',
  current: number,
  selection: { from: number; to: number },
  matches: { from: number; to: number }[]
) {
  if (current < 0) {
    // it means we need to recalc againt the new pointer
    return getClosestMatch(side, selection, matches)
  }

  let newMatch = 0
  if (side == 'left') {
    newMatch = current - 1 >= 0 ? current - 1 : matches.length - 1
  }
  if (side == 'right') {
    newMatch = current + 1 < matches.length ? current + 1 : 0
  }
  return newMatch
}

export const SearchReplace: React.FC = () => {
  const [editor] = useStore((state) => state.editor)
  const [advanced, setAdvanced] = useState(false)

  if (!editor) {
    return null
  }
  const pluginState = findReplacePluginKey.getState(editor.state)
  if (!pluginState) {
    return null
  }

  const isActive = pluginState ? pluginState.active : false
  const current = pluginState.currentMatch
  const matches = pluginState?.matches
  const selection = editor.state.selection

  function moveMatch(side: 'left' | 'right') {
    const view = editor.view
    if (view) {
      const tr = view.state.tr
      tr.setMeta(findReplacePluginKey, {
        currentMatch: getNewMatch(side, current, selection, matches),
      })
      view.dispatch(tr)
    }
  }

  const setNewSearchValue = (text: string) => {
    const view = editor.view

    if (view) {
      const tr = view.state.tr
      tr.setMeta(findReplacePluginKey, { value: text })
      view.dispatch(tr)
    }
  }

  const deactivate = () => {
    const view = editor.view

    if (view) {
      const tr = view.state.tr
      tr.setMeta(findReplacePluginKey, { active: false })
      view.dispatch(tr)
    }
  }

  return advanced ? (
    <Advanced />
  ) : (
    <>
      {isActive ? (
        <div>
          <TextField
            maxLength={2000}
            onChange={(e) => {
              setNewSearchValue(e.target.value)
            }}
            autoComplete="off"
            role="searchbox"
            spellCheck={false}
            placeholder={'Find in document'}
            aria-label="Find in document"
            type={'text'}
          />
          <button onClick={() => setAdvanced(true)}>Advanced</button>
          <button onClick={() => deactivate()}>X Close</button>
          <div className="navigate-search">
            <button
              onClick={() => {
                moveMatch('left')
              }}
            >
              Prev
            </button>
            <button
              onClick={() => {
                moveMatch('right')
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        'Closed state'
      )}
    </>
  )
}

const Advanced: React.FC = () => {
  return <div>AdvancedModal GoesHere</div>
}
