import React from 'react'

interface Props {
  isOpen?: boolean
}

class Modal extends React.Component<Props> {
  public static setAppElement(selector: string) {
    return null
  }
  public render() {
    return this.props.isOpen ? <div>{this.props.children}</div> : null
  }
}

export default Modal
