import React from 'react'
import { buildAuthorPriority } from '../../lib/authors'
import { Contributor, UserProfile } from '../../types/models'
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
