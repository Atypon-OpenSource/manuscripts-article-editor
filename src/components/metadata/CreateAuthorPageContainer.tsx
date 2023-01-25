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

import { Contributor, UserProfile } from '@manuscripts/json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'

import { buildAuthorPriority } from '../../lib/authors'

interface Props {
  authors: Contributor[]
  createAuthor: (
    priority: number,
    person?: UserProfile | null,
    name?: string,
    invitationID?: string
  ) => void
  handleCancel: () => void
  isOpen: boolean
  searchText: string
}

class CreateAuthorPageContainer extends React.Component<Props> {
  public render() {
    const actions = {
      primary: {
        action: this.handleCreate,
        title: 'Create',
      },
      secondary: {
        action: this.props.handleCancel,
        title: 'Cancel',
      },
    }
    return (
      <Dialog
        isOpen={this.props.isOpen}
        actions={actions}
        category={Category.confirmation}
        header={'Create author'}
        message={`Author already exist are you sure you want to create author with the same name?`}
      />
    )
  }
  private handleCreate = () => {
    this.props.createAuthor(
      buildAuthorPriority(this.props.authors),
      null,
      this.props.searchText
    )
    this.props.handleCancel()
  }
}

export default CreateAuthorPageContainer
