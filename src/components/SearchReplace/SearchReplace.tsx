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

import { findReplacePluginKey } from '@manuscripts/body-editor'
import React, { useState } from 'react'

import { useStore } from '../../store'
import { getNewMatch } from './getNewMatch'
import { SearchField } from './SearchField'
import { Advanced } from './AdvancedSearch'

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
  const value = pluginState?.value || ''

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

  const replaceOne = (index: number) => {
    matches[index]
  }

  return advanced ? (
    <Advanced
      isOpen={advanced}
      setNewSearchValue={setNewSearchValue}
      value={value}
      replaceAll={() => {}}
      replaceOne={replaceOne}
      handleClose={() => {
        setAdvanced(false)
        deactivate()
      }}
    />
  ) : (
    <>
      {isActive ? (
        <div>
          <SearchField setNewSearchValue={setNewSearchValue} />
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
