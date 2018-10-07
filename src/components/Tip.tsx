import React from 'react'
import Tooltip, { Options } from 'tooltip.js'
import '../styles/tip.css'

type Props = Pick<Options, 'placement' | 'title'>

export class Tip extends React.Component<Props> {
  private tooltip: Tooltip
  private readonly containerRef: React.RefObject<HTMLDivElement>

  public constructor(props: Props) {
    super(props)
    this.containerRef = React.createRef()
  }

  public componentDidMount() {
    this.createTooltip()
  }

  public componentDidUpdate() {
    this.createTooltip()
  }

  public componentWillUnmount() {
    if (this.tooltip) {
      this.tooltip.dispose()
      delete this.tooltip
    }
  }

  public render() {
    const { children } = this.props

    return (
      <div
        ref={this.containerRef}
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        {children}
      </div>
    )
  }

  private createTooltip = () => {
    const { placement, title } = this.props

    this.tooltip = new Tooltip(this.containerRef.current!, {
      placement,
      title,
    })
  }

  private close = () => {
    this.tooltip.hide()
  }

  private open = () => {
    this.tooltip.show()
  }
}
