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
import {
  ArrowUpIcon,
  CloseButton,
  DotsIcon,
  IconButton,
} from '@manuscripts/style-guide'
import React, { useState } from 'react'

import { useStore } from '../../store'
import { getNewMatch } from './getNewMatch'
import { SearchField } from './SearchField'
import { Advanced } from './AdvancedSearch'
import styled, { keyframes } from 'styled-components'
import { DelayUnmount } from '../DelayUnmount'

export const SearchReplace: React.FC = () => {
  const [editor] = useStore((state) => state.editor)
  const [advanced, setAdvanced] = useState(false)
  const [replacement, setReplacement] = useState('')

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

  const replaceCurrent = () => {
    const view = editor.view
    if (view) {
      const tr = view.state.tr
      tr.replaceWith(
        matches[current].from,
        matches[current].to,
        view.state.schema.text(replacement)
      )
      view.dispatch(tr)

      // recalcing the positions, not tested
      view.dispatch(view.state.tr.setMeta(findReplacePluginKey, { value }))
    }
    // @TODO make plugin recalculate positions of the matches and set currentMatch to be the next match from the list
  }

  const replaceAll = () => {
    const view = editor.view
    if (view) {
      const tr = view.state.tr
      if (matches) {
        matches.forEach(({ from, to }) => {
          tr.replaceWith(
            tr.mapping.map(from),
            tr.mapping.map(to),
            view.state.schema.text(replacement)
          )
        })
      }
      view.dispatch(tr)
    }
  }

  if (advanced) {
    return (
      <Advanced
        isOpen={advanced}
        setNewSearchValue={setNewSearchValue}
        value={value}
        replaceAll={replaceAll}
        replaceCurrent={replaceCurrent}
        moveNext={() => moveMatch('right')}
        movePrev={() => moveMatch('left')}
        setReplaceValue={setReplacement}
        handleClose={() => {
          setAdvanced(false)
          deactivate()
        }}
      />
    )
  }

  return (
    <>
      <DelayUnmount isVisible={isActive}>
        <Search className={isActive ? 'active' : 'inactive'}>
          <SearchField value={value} setNewSearchValue={setNewSearchValue} />
          <IconButton onClick={() => setAdvanced(true)}>
            <DotsIcon />
          </IconButton>
          <CloseButton
            onClick={() => deactivate()}
            data-cy="modal-close-button"
          />
          <IconButton
            onClick={() => {
              moveMatch('left')
            }}
          >
            <ArrowUpIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              moveMatch('right')
            }}
          >
            <ArrowDownIcon />
          </IconButton>
        </Search>
      </DelayUnmount>
    </>
  )
}

const ArrowDownIcon = styled(ArrowUpIcon)`
  transform: scaleY(-1);
`

const inAnimation = keyframes`
  0% {
    top: 50%;
    opacity: 0;
  }
  100% {
    top: 100%;
    transform: scale(1);
  }
}`

const Search = styled.div`
  display: flex;
  padding: 0.5rem;
  width: 440px;
  position: absolute;
  top: 50%;
  right: 1rem;
  background: #fff;
  border: 1px solid #f2f2f2;
  border-top: none;
  transition: all 0.2s ease;
  &.active {
    animation: ${inAnimation} 0.2s ease-in-out;
    top: 100%;
    opacity: 1;
  }
  &.inactive {
    opacity: 0;
  }
`
