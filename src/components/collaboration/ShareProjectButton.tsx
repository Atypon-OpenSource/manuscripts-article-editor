import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import ShareProjectIcon from '../../icons/shareProject'
import { styled } from '../../theme'
import { Project } from '../../types/models'
import { IconButton } from '../Button'
import ShareProjectPopperContainer from './ShareProjectPopperContainer'

const ShareIconButton = styled(IconButton)`
  height: 28px;
  width: 28px;

  &:focus {
    outline: none;
  }
`

interface State {
  isOpen: boolean
}

interface Props {
  project: Project
}

class ShareProjectButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  private node: Node
  private closedNow: boolean = false

  public componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false)
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false)
  }

  public render() {
    const { isOpen } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ShareIconButton
              // @ts-ignore: styled
              ref={ref}
              onClick={this.openPopper}
            >
              <ShareProjectIcon />
            </ShareIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper placement={'bottom'}>
            {(popperProps: PopperChildrenProps) => (
              <div ref={(node: HTMLDivElement) => (this.node = node)}>
                <ShareProjectPopperContainer
                  project={this.props.project}
                  popperProps={popperProps}
                />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private openPopper = () => {
    if (!this.closedNow) {
      this.setState({
        isOpen: true,
      })
    }
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (this.node && !this.node.contains(event.target as Node)) {
      this.setState({
        isOpen: false,
      })

      this.closedNow = true

      setTimeout(() => {
        this.closedNow = false
      }, 100)
    }
  }
}

export default ShareProjectButton
