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

import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { buildAuthorPriority } from '../../lib/authors'
import { Category, Dialog } from '../Dialog'

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
        action: this.props.handleCancel,
        title: 'Cancel',
      },
      secondary: {
        action: this.handleCreate,
        title: 'Create',
        isDestructive: true,
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
