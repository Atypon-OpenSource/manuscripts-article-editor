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
import { ListStyles, ToolbarButtonConfig } from '@manuscripts/body-editor'
import {
  ArrowDownIcon,
  DropdownList,
  ToolbarOrderedListIcon,
  ToolbarUnorderedListIcon,
  Tooltip,
  useDropdown,
} from '@manuscripts/style-guide'
import { ManuscriptEditorView } from '@manuscripts/transform'
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'
import styled from 'styled-components'

import { ListButton, ListStyleButton } from './ListToolbarItemStyles'
import { ToolbarItem } from './ManuscriptToolbar'

const Container = styled.div`
  display: flex;
`

type ListStyleSelectorProps = {
  title: string
  styles: string[]
  disabled: boolean
  onClick: (style: string) => void
}

const ListStyleSelector: React.FC<ListStyleSelectorProps> = ({
  title,
  disabled,
  styles,
  onClick,
}) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()

  return (
    <Container onClick={() => !disabled && toggleOpen()} ref={wrapperRef}>
      <ListStyleButton data-tooltip-id={title} disabled={disabled}>
        <ArrowDownIcon />
      </ListStyleButton>
      <Tooltip id={title} place="bottom">
        {title}
      </Tooltip>
      {isOpen && (
        <DropdownList direction={'right'} top={6} onClick={toggleOpen}>
          <ListStyles styles={styles} onClick={onClick} />
        </DropdownList>
      )}
    </Container>
  )
}

export const ListToolbarItem: React.FC<{
  state: EditorState
  type: 'ordered_list' | 'bullet_list'
  dispatch: (tr: Transaction) => void
  view?: ManuscriptEditorView
  config: ToolbarButtonConfig
}> = ({ state, type, dispatch, view, config }) => {
  if (!config.options) {
    return null
  }

  const isEnabled = !config.isEnabled || config.isEnabled(state)

  /**
   *  When choosing a list type will do one of these options:
   *  * if text is selected will wrap it with an order list
   *  * if the selection is on list will change just the list type and
   *    **in case it's nested list will change just the lists at the same level**
   */
  const handleClick = (style: string) => {
    config.options?.[style](state, dispatch, view)
    view && view.focus()
  }

  const styles = Object.keys(config.options)

  return (
    <ToolbarItem>
      <ListButton
        data-tooltip-id={config.title}
        data-active={config.isActive && config.isActive(state)}
        disabled={!isEnabled}
        onMouseDown={(event) => {
          event.preventDefault()
          config.run(state, dispatch, view)
          view && view.focus()
        }}
      >
        {type === 'ordered_list' ? (
          <ToolbarOrderedListIcon />
        ) : (
          <ToolbarUnorderedListIcon />
        )}
      </ListButton>
      <Tooltip id={config.title} place="bottom">
        {config.title}
      </Tooltip>
      <ListStyleSelector
        title={config.title + ' styles'}
        disabled={!isEnabled}
        onClick={handleClick}
        styles={styles}
      />
    </ToolbarItem>
  )
}
