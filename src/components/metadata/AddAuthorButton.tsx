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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { AddIconInverted, IconButton } from '@manuscripts/style-guide'
import React from 'react'
import { buildAuthorPriority } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'

const AddIconButton = styled(IconButton)`
  display: flex;
  width: unset;
  height: unset;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

interface State {
  isSelected: boolean
}

interface Props {
  isSelected?: boolean
  person: UserProfile
  authors: Contributor[]
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
}

class AddAuthorButton extends React.Component<Props, State> {
  public state: State = {
    isSelected: false,
  }

  public componentDidMount() {
    this.setState({
      isSelected: this.props.isSelected || false,
    })
  }

  public render() {
    const { isSelected } = this.state
    if (isSelected) {
      return (
        <AddIconButton>
          <AddedIcon />
        </AddIconButton>
      )
    }

    return (
      <AddIconButton onClick={this.handleSelected}>
        <AddIconInverted color={theme.colors.icon.primary} />
      </AddIconButton>
    )
  }

  private handleSelected = () => {
    const { person, authors, createAuthor } = this.props
    this.setState({ isSelected: true })

    createAuthor(buildAuthorPriority(authors), person)
  }
}

export default AddAuthorButton
