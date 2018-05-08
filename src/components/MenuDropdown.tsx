import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../theme'

const DropdownContainer = styled.div`
  position: relative;
`

const DropdownToggle = styled.button`
  border: none;
  background: none;
  color: #999;
  font-size: inherit;
  cursor: pointer;

  &:hover {
    color: #7fb5d5;
  }

  &:focus {
    outline: none;
  }
`

const Dropdown = styled.div`
  position: absolute;
  top: 32px;
  left: 5px;
  padding: 5px 0;
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
`

export const DropdownLink = styled(NavLink)`
  padding: 10px 20px;
  display: block;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: #7fb5d5;
    color: white;
  }
`

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

        <DropdownToggle onClick={this.toggle}>▼</DropdownToggle>

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
