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

import { SearchIcon, TextField } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

const SearchContainer = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  position: relative;
`

const SearchIconContainer = styled.span<{ active?: boolean }>`
  display: flex;
  left: ${(props) => props.theme.grid.unit * 4}px;
  position: absolute;
  z-index: 2;

  path {
    fill: ${(props) =>
      props.active
        ? props.theme.colors.brand.medium
        : props.theme.colors.text.primary};
  }
`

const SearchText = styled(TextField)`
  -webkit-appearance: textfield;
  padding-left: ${(props) => props.theme.grid.unit * 11}px;
  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.colors.background.fifth};
  }
`

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 3}px;
`

export interface SearchInterface {
  autoComplete?: string
  autoFocus?: boolean
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  maxLength?: number
  placeholder?: string
  type?: string
  value?: string
  defaultValue?: string
}

interface State {
  isSearchFocused: boolean
  isSearchHovered: boolean
}

class Search extends React.Component<SearchInterface, State> {
  public state = {
    isSearchFocused: false,
    isSearchHovered: false,
  }

  public render() {
    const {
      autoComplete,
      autoFocus,
      handleSearchChange,
      maxLength,
      placeholder,
      type,
      value,
      defaultValue,
    } = this.props

    const { isSearchFocused, isSearchHovered } = this.state

    return (
      <SearchContainer
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onFocus={this.handleSearchFocus}
        onBlur={this.handleSearchBlur}
      >
        <SearchIconContainer active={isSearchHovered || isSearchFocused}>
          <SearchIcon />
        </SearchIconContainer>

        <SearchText
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          onChange={handleSearchChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          type={type}
          value={value}
        />
      </SearchContainer>
    )
  }

  private handleSearchFocus = () => {
    this.setState({
      isSearchFocused: true,
    })
  }

  private handleSearchBlur = () => {
    this.setState({
      isSearchFocused: false,
    })
  }

  private onMouseEnter = () => {
    this.setState({ isSearchHovered: true })
  }

  private onMouseLeave = () => {
    this.setState({ isSearchHovered: false })
  }
}

export default Search
