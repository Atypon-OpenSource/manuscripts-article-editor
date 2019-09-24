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

import React from 'react'
import { styled } from '../../theme/styled-components'
import { SearchIcon } from './ModalIcons'

const SearchContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  align-items: center;
`

const SearchIconContainer = styled.div`
  left: 16px;
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
`

const SearchText = styled.input`
  border: none;
  border-right: 1px solid ${props => props.theme.colors.popper.separator};
  border-radius: 4px 0 0 4px;
  font-size: 16px;
  line-height: 1;
  outline: none;
  padding: 12px 8px 12px 44px;
  flex: 1;
  -webkit-appearance: none;
  margin: 0;

  &:focus {
    background: ${props => props.theme.colors.sidebar.background.default};
  }

  &::-webkit-search-decoration {
    display: none;
  }
`

interface Props {
  value: string
  handleChange: (value: string) => void
}

interface State {
  searching: boolean
}

export class TemplateSearchInput extends React.Component<Props, State> {
  public state: Readonly<State> = {
    searching: false,
  }

  public render() {
    return (
      <SearchContainer
        onFocus={() => {
          this.setState({
            searching: true,
          })
        }}
        onBlur={() => {
          this.setState({
            searching: false,
          })
        }}
      >
        <SearchIconContainer>
          <SearchIcon />
        </SearchIconContainer>
        <SearchText
          autoFocus={true}
          type={'search'}
          value={this.props.value}
          placeholder={'Search'}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            this.props.handleChange(event.currentTarget.value)
          }
        />
      </SearchContainer>
    )
  }
}
