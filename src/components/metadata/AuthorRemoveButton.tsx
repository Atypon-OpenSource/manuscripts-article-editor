import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import VerticalEllipsis from '../../icons/vertical-ellipsis'
import { styled } from '../../theme'
import { Contributor } from '../../types/components'
import { IconButton } from '../Button'
import AuthorRemovePopper from './AuthorRemovePopper'

const RemoveButton = styled(IconButton)`
  display: flex;
  height: unset;
  width: unset;

  &:focus {
    outline: none;
  }
`

interface Props {
  author: Contributor
  isOpen: boolean
  authorRemove: () => void
  handleOpen: () => void
}

class AuthorRemoveButton extends React.Component<Props> {
  private node: Node

  public componentDidMount() {
    this.updateListener(this.props.isOpen)
  }

  public render() {
    const { isOpen } = this.props
    const { authorRemove, author } = this.props

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <RemoveButton
              onClick={this.openPopper}
              // @ts-ignore: styled
              ref={ref}
            >
              <VerticalEllipsis color={'#7fb5d5'} />
            </RemoveButton>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <AuthorRemovePopper
                author={author}
                removeAuthor={authorRemove}
                popperProps={popperProps}
                openPopper={this.openPopper}
              />
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private openPopper = () => {
    this.updateListener(!this.props.isOpen)
    this.props.handleOpen()
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (this.node && !this.node.contains(event.target as Node)) {
      this.openPopper()
    }
  }

  private updateListener = (isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousedown', this.handleClickOutside)
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }
}

export default AuthorRemoveButton
