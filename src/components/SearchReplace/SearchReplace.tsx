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
  getNewMatch,
  searchReplacePluginKey,
  SearchReplacePluginState,
} from '@manuscripts/body-editor'
import {
  ArrowUpIcon,
  CloseButton,
  DotsIcon,
  IconButton,
} from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { DelayUnmount } from '../DelayUnmount'
import { Advanced } from './AdvancedSearch'
import { SearchField } from './SearchField'

export const SearchReplace: React.FC = () => {
  const [{ editor }] = useStore((state) => ({
    editor: state.editor,
  }))
  const [replacement, setReplacement] = useState('')
  const can = usePermissions()
  const isReadOnlyMode = !can.editArticle

  const setPluginState = useCallback(
    function (values: Partial<SearchReplacePluginState>) {
      const view = editor?.view
      if (view) {
        const tr = view.state.tr
        tr.setMeta(searchReplacePluginKey, values)
        view.dispatch(tr)
      }
    },
    [editor?.view]
  )

  const [newSearchValue, setNewSearchValue] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPluginState({ value: newSearchValue })
    }, 400)
    return () => clearTimeout(timeout)
  }, [newSearchValue, setPluginState])

  if (!editor) {
    return null
  }
  const pluginState = searchReplacePluginKey.getState(editor.state)

  if (!pluginState) {
    return null
  }
  const advanced = pluginState?.activeAdvanced
  const isActive = pluginState ? pluginState.active : false
  const current = pluginState.currentMatch
  const matches = pluginState?.matches
  const selection = editor.state.selection
  const value = pluginState?.value || ''
  const caseSensitive = pluginState?.caseSensitive || false
  const ignoreDiacritics = pluginState?.ignoreDiacritics || false

  function moveMatch(side: 'left' | 'right') {
    const newMatch = getNewMatch(side, current, selection, matches)
    setPluginState({
      currentMatch: newMatch,
      highlightCurrent: true,
    })
  }

  const setAdvanced = (val: boolean) => setPluginState({ activeAdvanced: val })
  const deactivate = () => setPluginState({ active: false })

  // replace only currently selected match
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
      /*
        since replacing current match of search will shorten the list by one, the next item will be located
        at the same index as the current, however we still need to check if there is actually a next item (current + 1) which would guarantee
        that 'current' will be valid once current 'current' is replaced and excluded from the matches list.
      */
      const newCurrent =
        matches.length <= 1 ? -1 : matches[current + 1] ? current : 0
      view.dispatch(
        view.state.tr.setMeta(searchReplacePluginKey, {
          value,
          currentMatch: newCurrent,
          highlightCurrent: true,
        })
      )
    }
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
      tr.setMeta('massSearchReplace', true) // needed to make tc-plugin not to freak out about a large amount of steps
      view.dispatch(tr)
      view.dispatch(view.state.tr.setMeta(searchReplacePluginKey, { value }))
    }
  }

  if (advanced) {
    return (
      <Advanced
        isOpen={advanced}
        setNewSearchValue={setNewSearchValue}
        value={newSearchValue}
        setIgnoreDiacritics={(val) => setPluginState({ ignoreDiacritics: val })}
        setCaseSensitive={(val) => setPluginState({ caseSensitive: val })}
        replaceAll={replaceAll}
        replaceCurrent={replaceCurrent}
        moveNext={() => moveMatch('right')}
        movePrev={() => moveMatch('left')}
        setReplaceValue={setReplacement}
        ignoreDiacritics={ignoreDiacritics}
        caseSensitive={caseSensitive}
        handleClose={() => {
          setAdvanced(false)
          deactivate()
        }}
        current={current}
        total={matches.length}
        onInputFocus={() => {
          setPluginState({
            highlightCurrent: true,
          })
        }}
        isReadOnlyMode={isReadOnlyMode}
      />
    )
  }

  return (
    <>
      <DelayUnmount isVisible={isActive}>
        <Search className={isActive ? 'active' : 'inactive'}>
          <SearchField
            value={newSearchValue}
            current={current}
            onInputFocus={() => {
              setPluginState({
                highlightCurrent: true,
              })
            }}
            total={matches.length}
            setNewSearchValue={setNewSearchValue}
            isActive={isActive}
          />
          <IconButton onClick={() => setAdvanced(true)}>
            <DotsIcon />
          </IconButton>
          <CloseButton
            onClick={() => deactivate()}
            data-cy="modal-close-button"
          />
          <IconButton onClick={() => moveMatch('left')}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton onClick={() => moveMatch('right')}>
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
