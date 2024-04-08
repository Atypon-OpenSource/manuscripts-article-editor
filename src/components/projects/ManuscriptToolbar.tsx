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
  LevelSelector,
  toolbar,
  ToolbarButtonConfig,
} from '@manuscripts/body-editor'
import { usePermissions } from '@manuscripts/style-guide'
import {
  ManuscriptEditorState,
  ManuscriptEditorView,
} from '@manuscripts/transform'
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'
import styled from 'styled-components'

import config from '../../config'
import { ListToolbarItem } from './ListToolbarItem'

export const ToolbarItem = styled.div`
  display: inline-flex;
  position: relative;
`

const ToolbarButton = styled.button.attrs({
  type: 'button',
})<{
  'data-active'?: boolean
}>`
  background-color: ${(props) =>
    props['data-active'] ? '#eee' : props.theme.colors.background.primary};
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  cursor: pointer;
  padding: 2px ${(props) => props.theme.grid.unit * 3}px;
  display: inline-flex;
  align-items: center;
  transition: 0.2s all;

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
  }
`

export const ToolbarContainer = styled.div`
  margin: ${(props) => props.theme.grid.unit}px;
  display: flex;
  flex-wrap: wrap;
`

export const ToolbarGroup = styled.div`
  display: flex;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
  white-space: nowrap;

  & ${ToolbarItem} button {
    margin-right: 0;
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

export const ManuscriptToolbar: React.FC<{
  state: ManuscriptEditorState
  dispatch: (tr: Transaction) => void
  view?: ManuscriptEditorView
}> = ({ state, dispatch, view }) => {
  const can = usePermissions()

  const isEnabled = (
    id: string,
    item: ToolbarButtonConfig,
    state: EditorState
  ) => {
    if (id === 'table_element' && !config.features.tableEditing) {
      return false
    }
    return item.isEnabled(state)
  }

  return (
    <ToolbarContainer>
      <ToolbarGroup>
        <LevelSelector state={state} dispatch={dispatch} view={view} />
      </ToolbarGroup>

      {Object.entries(toolbar).map(([groupKey, group]) => (
        <ToolbarGroup key={groupKey}>
          {Object.entries(group)
            .filter(([key]) => {
              switch (key) {
                case 'footnotes':
                  return config.features.footnotes
                case 'comment':
                  return can.handleOwnComments
                default:
                  return true
              }
            })
            .map(([key, item]) =>
              key === 'ordered_list' || key === 'bullet_list' ? (
                <ListToolbarItem
                  key={key}
                  type={key}
                  state={state}
                  dispatch={dispatch}
                  view={view}
                  config={item}
                />
              ) : (
                <ToolbarItem key={key}>
                  <ToolbarButton
                    title={item.title}
                    data-active={item.isActive && item.isActive(state)}
                    disabled={!isEnabled(key, item, state)}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      item.run(state, dispatch)
                      view && view.focus()
                    }}
                  >
                    {item.content}
                  </ToolbarButton>
                </ToolbarItem>
              )
            )}
        </ToolbarGroup>
      ))}
    </ToolbarContainer>
  )
}
