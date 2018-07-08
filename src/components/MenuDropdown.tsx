import React from 'react'
import { Dropdown, DropdownContainer, DropdownToggle } from './Dropdown'

interface Props {
  buttonContents: string | React.ReactNode
  dropdownStyle?: React.CSSProperties
}

interface State {
  open: boolean
}

class MenuDropdown extends React.Component<Props, State> {
  public state: Readonly<State> = {
    open: false,
  }

  public render() {
    const { buttonContents, children, dropdownStyle } = this.props

    return (
      <DropdownContainer>
        {buttonContents}

        <DropdownToggle id="drop-down-toggle" onClick={this.toggle}>
          ▼
        </DropdownToggle>

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
