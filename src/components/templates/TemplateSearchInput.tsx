/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SearchIcon } from '@manuscripts/style-guide'
import React from 'react'
import { theme } from '../../theme/theme'
import {
  SidebarSearchField,
  SidebarSearchIconContainer,
  SidebarSearchText,
} from '../Sidebar'

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
      <SidebarSearchField
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
        <SidebarSearchIconContainer>
          {this.state.searching ? (
            <SearchIcon
              color={theme.colors.templateSelector.search.icon.searching}
            />
          ) : (
            <SearchIcon />
          )}
        </SidebarSearchIconContainer>
        <SidebarSearchText
          type={'search'}
          value={this.props.value}
          placeholder={'Search'}
          autoFocus={true}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            this.props.handleChange(event.currentTarget.value)
          }
        />
      </SidebarSearchField>
    )
  }
}
