import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { IconButton } from '../components/Button'
import ShareProjectIcon from '../icons/shareProject'
import { styled } from '../theme'
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
  projectID: string
}

class ShareProjectButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  }

  public render() {
    const { isOpen } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <ShareIconButton onClick={this.toggleOpen} innerRef={ref}>
              <ShareProjectIcon />
            </ShareIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper placement={'bottom'}>
            {(popperProps: PopperChildrenProps) => (
              <ShareProjectPopperContainer
                projectID={this.props.projectID}
                popperProps={popperProps}
              />
            )}
          </Popper>
        )}
      </Manager>
    )
  }

  private toggleOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
}

export default ShareProjectButton
