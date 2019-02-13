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

  private nodeRef: React.RefObject<HTMLDivElement> = React.createRef()

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
      <DropdownContainer id={id} ref={this.nodeRef}>
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
    if (
      this.nodeRef.current &&
      !this.nodeRef.current.contains(event.target as Node)
    ) {
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
