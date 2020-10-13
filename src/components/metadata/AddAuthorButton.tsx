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

import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { AddIconInverted, IconButton } from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import { buildAuthorPriority } from '../../lib/authors'
import { theme } from '../../theme/theme'

const AddIconButton = styled(IconButton).attrs({ defaultColor: true })`
  width: unset;
  height: unset;
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
        <AddIconInverted color={theme.colors.brand.medium} />
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
