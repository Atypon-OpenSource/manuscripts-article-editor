import AddedIcon from '@manuscripts/assets/react/AddedIcon'
import { Contributor, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import AddIconInverted from '../../icons/add-icon-inverted'
import { buildAuthorPriority } from '../../lib/authors'
import { styled } from '../../theme/styled-components'
import { theme } from '../../theme/theme'
import { IconButton } from '../Button'

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
