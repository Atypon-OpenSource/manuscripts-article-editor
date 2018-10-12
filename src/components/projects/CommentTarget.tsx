import React from 'react'

interface Props {
  isSelected: boolean
}

export class CommentTarget extends React.Component<Props> {
  private threadRef = React.createRef<HTMLDivElement>()

  public componentDidUpdate() {
    if (this.threadRef.current && this.props.isSelected) {
      // TODO: don't scroll into view if part of the thread is active?
      this.threadRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }
  }

  public render() {
    return <div ref={this.threadRef}>{this.props.children}</div>
  }
}
