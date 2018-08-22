import React from 'react'
import { Dropdown, DropdownButton, DropdownContainer } from './Dropdown'

interface Props {
  buttonContents: string | React.ReactNode
  dropdownStyle?: React.CSSProperties
  id?: string
  notificationsCount?: number
}

interface State {
  isOpen: boolean
}

class MenuDropdown extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isOpen: false,
  }

  private node: Node

  public componentWillUnmount() {
    this.setOpen(false)
  }

  public render() {
    const {
      buttonContents,
      children,
      dropdownStyle,
      id,
      notificationsCount,
    } = this.props

    const { isOpen } = this.state

    return (
      <DropdownContainer
        id={id}
        innerRef={(node: HTMLDivElement) => (this.node = node)}
      >
        <DropdownButton
          isOpen={isOpen}
          notificationsCount={notificationsCount}
          onClick={() => this.setOpen(!isOpen)}
        >
          {buttonContents}
        </DropdownButton>
        {isOpen && <Dropdown style={dropdownStyle}>{children}</Dropdown>}
      </DropdownContainer>
    )
  }

  private setOpen = (isOpen: boolean) => {
    this.setState({ isOpen })
    this.updateListener(isOpen)
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (this.node && !this.node.contains(event.target as Node)) {
      this.setOpen(false)
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

export default MenuDropdown
