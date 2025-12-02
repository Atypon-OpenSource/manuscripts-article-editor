/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */

import {
  templateAllows,
  toolbar,
  ToolbarButtonConfig,
  TypeSelector,
} from '@manuscripts/body-editor'
import { Tooltip } from '@manuscripts/style-guide'
import { schema } from '@manuscripts/transform'
import { EditorState } from 'prosemirror-state'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'

import { usePermissions } from '../../lib/capabilities'
import { useStore } from '../../store'
import { ListToolbarItem } from './ListToolbarItem'

export const ToolbarItem = styled.div`
  display: inline-flex;
  position: relative;
`

const ToolbarButton = styled.button.attrs({
  type: 'button',
  'data-toolbar-button': true,
})<{
  'data-active'?: boolean
}>`
  background-color: ${(props) =>
    props['data-active'] ? '#eee' : props.theme.colors.background.primary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  cursor: pointer;
  padding: ${(props) => props.theme.grid.unit * 2 - 1}px
    ${(props) => props.theme.grid.unit * 2 - 1}px;
  display: inline-flex;
  align-items: center;
  transition: 0.2s all;
  height: 32px;

  &:hover {
    background: ${(props) =>
      props['data-active'] ? '#eee' : props.theme.colors.background.secondary};
    z-index: 2;
  }

  &:active {
    background: #ddd;
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.outline.focus};
    outline-offset: -2px;
  }
`

export const ToolbarContainer = styled.div`
  margin: ${(props) => props.theme.grid.unit}px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(props) => props.theme.grid.unit * 2}px;
  width: 100%;
  max-width: ${(props) => props.theme.grid.editorMaxWidth}px;
  margin: 0 auto;
  padding: ${(props) => props.theme.grid.unit * 2.5}px
    ${(props) => props.theme.grid.unit * 5}px
    ${(props) => props.theme.grid.unit * 2.5}px
    ${(props) => props.theme.grid.unit * 15}px;
  box-sizing: border-box;
`

export const ToolbarGroup = styled.div`
  display: flex;
  white-space: nowrap;

  & ${ToolbarItem} button {
    margin-right: 0;
    max-height: 32px;
  }

  & ${ToolbarItem}:not(:first-of-type) button {
    margin-left: -1px;
  }

  & ${ToolbarItem}:first-of-type button {
    border-top-left-radius: ${(props) => props.theme.grid.radius.small};
    border-bottom-left-radius: ${(props) => props.theme.grid.radius.small};
  }

  & ${ToolbarItem}:last-of-type button {
    border-top-right-radius: ${(props) => props.theme.grid.radius.small};
    border-bottom-right-radius: ${(props) => props.theme.grid.radius.small};
  }
`

export const ManuscriptToolbar: React.FC = () => {
  const can = usePermissions()
  const containerRef = useRef<HTMLDivElement>(null)

  const [{ editor }] = useStore((store) => ({
    editor: store.editor,
  }))

  // Get all enabled toolbar buttons
  const getButtons = useCallback(() => {
    if (!containerRef.current) {
      return []
    }
    return Array.from(
      containerRef.current.querySelectorAll<HTMLButtonElement>(
        '[data-toolbar-button]:not([disabled])'
      )
    )
  }, [])

  // Roving tabindex: only first button is tabbable, rest are -1
  useLayoutEffect(() => {
    const buttons = getButtons()
    if (buttons.length === 0) {
      return
    }

    buttons.forEach((button, index) => {
      button.tabIndex = index === 0 ? 0 : -1
    })
  }, [getButtons, editor])

  if (!editor || !editor.view) {
    return null
  }

  const view = editor.view
  const state = editor.state

  const isEnabled = (
    id: string,
    item: ToolbarButtonConfig,
    state: EditorState
  ) => {
    return item.isEnabled(state)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return
    }

    const target = event.target as HTMLElement
    // Only handle if a button is currently focused
    if (target.tagName !== 'BUTTON') {
      return
    }

    const buttons = getButtons()
    if (buttons.length === 0) {
      return
    }

    const currentIndex = buttons.indexOf(target as HTMLButtonElement)
    if (currentIndex === -1) {
      return
    }

    event.preventDefault()

    let nextIndex: number
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % buttons.length
    } else {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
    }

    buttons[nextIndex]?.focus()
  }

  return (
    <ToolbarContainer
      data-cy="toolbar"
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <ToolbarGroup>
        <TypeSelector state={state} dispatch={view.dispatch} view={view} />
      </ToolbarGroup>

      {Object.entries(toolbar).map(([groupKey, group]) => (
        <ToolbarGroup key={groupKey}>
          {Object.entries(group)
            .filter(([key]) => {
              switch (key) {
                case 'comment':
                  return can.handleOwnComments
                default:
                  if (groupKey === 'element') {
                    const nodeType = schema.nodes[key]
                    return nodeType ? templateAllows(state, nodeType) : true
                  }
                  return true
              }
            })
            .map(([key, item]) =>
              key === 'ordered_list' || key === 'bullet_list' ? (
                <ListToolbarItem
                  key={key}
                  type={key}
                  state={state}
                  dispatch={view.dispatch}
                  view={view}
                  config={item}
                />
              ) : (
                <ToolbarItem key={key}>
                  <ToolbarButton
                    data-tooltip-id={item.title}
                    data-active={item.isActive && item.isActive(state)}
                    disabled={!isEnabled(key, item, state)}
                    onClick={(e) => {
                      e.preventDefault()
                      item.run(state, view.dispatch, view)
                      view && view.focus()
                    }}
                    aria-label={item.title}
                  >
                    {item.content}
                  </ToolbarButton>
                  <Tooltip id={item.title} place="bottom">
                    {item.title}
                  </Tooltip>
                </ToolbarItem>
              )
            )}
        </ToolbarGroup>
      ))}
    </ToolbarContainer>
  )
}
