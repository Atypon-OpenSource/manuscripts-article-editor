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
import ArrowDown from '@manuscripts/assets/react/ArrowDownBlack'
import OrderedList from '@manuscripts/assets/react/ToolbarIconOrderedList'
import { ToolbarButtonConfig } from '@manuscripts/body-editor'
import { DropdownList, useDropdown } from '@manuscripts/style-guide'
import { ManuscriptEditorView } from '@manuscripts/transform'
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'
import styled from 'styled-components'

import { ListButton, ListStyle, ListStyleButton } from './ListToolbarItemStyles'
import { ToolbarItem } from './ManuscriptToolbar'

export const ListStyleSelector: React.FC<{
  disabled: boolean
  styles: ListStyle[]
  onClick: (style: ListStyle) => void
}> = ({ disabled, styles, onClick }) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()

  return (
    <Container onClick={(e) => !disabled && toggleOpen(e)} ref={wrapperRef}>
      <ListStyleButton disabled={disabled}>
        <ArrowDown />
      </ListStyleButton>
      {isOpen && (
        <DropdownList direction={'right'} top={6} onClick={toggleOpen}>
          <ListContainer>
            {styles.map((style, index) => (
              <StyleBlock key={index} onClick={() => onClick(style)}>
                {style.items.map((style, index) => (
                  <BlockItem key={index}>
                    <Label>{style}</Label>
                    <Block />
                  </BlockItem>
                ))}
              </StyleBlock>
            ))}
          </ListContainer>
        </DropdownList>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const ListContainer = styled.div`
  padding: ${(props) => props.theme.grid.unit * 4}px;
  display: grid;
  grid-template-columns:
    ${(props) => props.theme.grid.unit * 21}px
    ${(props) => props.theme.grid.unit * 21}px;
  gap: 6px;
`

const StyleBlock = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border.tertiary};
  padding: ${(props) => props.theme.grid.unit * 2}px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  row-gap: ${(props) => props.theme.grid.unit * 2}px;

  &:hover {
    background: ${(props) => props.theme.colors.button.default.border.hover};
  }

  &:active {
    border-color: ${(props) => props.theme.colors.border.primary};
  }
`

const BlockItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Block = styled.div`
  height: 3px;
  width: ${(props) => props.theme.grid.unit * 14}px;
  background: ${(props) => props.theme.colors.border.tertiary};
`

const Label = styled.div`
  font-family: Lato, serif;
  font-size: ${(props) => props.theme.font.size.small};
  font-weight: ${(props) => props.theme.font.weight.normal};
  line-height: ${(props) => props.theme.font.lineHeight.small};
  font-style: normal;
`

export const OrderedListToolbarItem: React.FC<{
  state: EditorState
  dispatch: (tr: Transaction) => void
  view?: ManuscriptEditorView
  config: ToolbarButtonConfig
}> = ({ state, dispatch, view, config }) => {
  const isEnabled = !config.isEnabled || config.isEnabled(state)

  /**
   *  When choosing a list type will do one of these options:
   *  * if text is selected will wrap it with an order list
   *  * if the selection is on list will change just the list type and
   *    **in case it's nested list will change just the lists at the same level**
   */
  const handleClick = (style: ListStyle) => {
    const type = style.type
    config.options?.[type](state, dispatch)
    view && view.focus()
  }

  return (
    <ToolbarItem>
      <ListButton
        title={config.title}
        data-active={config.isActive && config.isActive(state)}
        disabled={!isEnabled}
        onMouseDown={(event) => {
          event.preventDefault()
          config.run(state, dispatch)
          view && view.focus()
        }}
      >
        <OrderedList />
      </ListButton>
      <ListStyleSelector
        disabled={!isEnabled}
        onClick={handleClick}
        styles={[
          { items: ['1.', '2.', '3.'], type: 'order' },
          { items: ['A.', 'B.', 'C.'], type: 'alpha-upper' },
          { items: ['a.', 'b.', 'c.'], type: 'alpha-lower' },
          { items: ['I.', 'II.', 'III.'], type: 'roman-upper' },
          { items: ['i.', 'ii.', 'iii.'], type: 'roman-lower' },
        ]}
      />
    </ToolbarItem>
  )
}
