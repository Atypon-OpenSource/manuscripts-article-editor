import React from 'react'
import DropdownToggle from '../icons/dropdown-toggle'
import { Dropdown, DropdownContainer, DropdownToggleButton } from './Dropdown'

interface Props {
  buttonContents: string | React.ReactNode
  dropdownStyle?: React.CSSProperties
  id?: string
}

interface State {
  open: boolean
}

class MenuDropdown extends React.Component<Props, State> {
  public state: Readonly<State> = {
    open: false,
  }

  public render() {
    const { buttonContents, children, dropdownStyle, id } = this.props

    return (
      <DropdownContainer id={id}>
        {buttonContents}
        <DropdownToggleButton
          onClick={this.toggle}
          className={'dropdown-toggle'}
        >
          <DropdownToggle />
        </DropdownToggleButton>

        {this.state.open && (
          <Dropdown style={dropdownStyle}>{children}</Dropdown>
        )}
      </DropdownContainer>
    )
  }

  private toggle = () => {
    this.setState({
      open: !this.state.open,
    })
  }
}

export default MenuDropdown
