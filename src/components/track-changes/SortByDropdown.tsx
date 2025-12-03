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

import { SecondaryButton, useDropdown } from '@manuscripts/style-guide'
import React from 'react'
import styled, { css } from 'styled-components'

import {
  Dropdown,
  DropdownButtonContainer,
  DropdownContainer,
  DropdownToggle,
} from '../nav/Dropdown'

interface Props {
  sortBy: string
  setSortBy: (sortBy: string) => void
}
export const SortByDropdown: React.FC<Props> = ({ sortBy, setSortBy }) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()

  return (
    <>
      <Container ref={wrapperRef}>
        <DropdownButtonContainer
          isOpen={isOpen}
          onClick={toggleOpen}
          className={'dropdown-toggle'}
        >
          <Label>
            Sorted by:
            <Bold>{sortBy}</Bold>
            <DropdownToggle className={isOpen ? 'open' : ''} />
          </Label>
        </DropdownButtonContainer>
        {isOpen && (
          <DropdownList direction={'right'} minWidth={100}>
            <Option
              onClick={(e) => {
                setSortBy('Date')
                toggleOpen()
              }}
              key={'Date'}
              value={'Date'}
            >
              Date
            </Option>
            <Option
              onClick={(e) => {
                setSortBy('in Context')
                toggleOpen()
              }}
              key={'in Context'}
              value={'in Context'}
            >
              in Context
            </Option>
          </DropdownList>
        )}
      </Container>
      <SeparatorLine />
    </>
  )
}

const SeparatorLine = styled.div`
  margin: 0 ${(props) => props.theme.grid.unit * 6}px;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  height: 1px;
`
const Bold = styled.span`
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.bold};
  margin-left: ${(props) => props.theme.grid.unit}px;
`
const Label = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.normal};
  display: flex;
  align-items: center;
`
const Container = styled(DropdownContainer)`
  padding-top: ${(props) => props.theme.grid.unit * 4}px;
  padding-left: ${(props) => props.theme.grid.unit * 4}px;
  width: fit-content;
  .dropdown-toggle {
    border: none;
    background: transparent !important;
  }
`

const Option = styled(SecondaryButton)`
  ${(props) => props.disabled && disabledBtnStyle}
  text-align: left;
  display: block;
  border: none;
  &:not([disabled]):hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;
    color: ${(props) =>
      props.theme.colors.button.secondary.color.default} !important;
  }
`
const DropdownList = styled(Dropdown)`
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`
const disabledBtnStyle = css`
  cursor: default !important;
  background-color: unset !important;
  color: ${(props) => props.theme.colors.text.secondary} !important;
  border: none !important;
`
