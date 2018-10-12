import { Resizer, ResizerDirection, ResizerSide } from '@manuscripts/resizer'
import React from 'react'
import layout, { Pane } from '../lib/layout'

interface PanelProps {
  name: string
  minSize?: number
  direction: ResizerDirection
  side: ResizerSide
}

interface PanelState {
  originalSize: number | null
  size: number | null
  collapsed: boolean
}

interface InitializedPanelState extends PanelState {
  originalSize: number
  size: number
}

interface PanelStyle {
  position: 'relative'
  width: number | string
  height: number | string
}

class Panel extends React.Component<PanelProps, PanelState> {
  public state: PanelState = {
    originalSize: null,
    size: null,
    collapsed: false,
  }

  public componentDidMount() {
    this.updateState(layout.get(this.props.name))
  }

  public render() {
    const { children, direction, side } = this.props
    const { collapsed, size, originalSize } = this.state

    if (size === null || originalSize === null) return null

    const style: PanelStyle = {
      position: 'relative',
      width: direction === 'row' ? size : '100%',
      height: direction === 'row' ? '100vh' : size,
    }

    const resizer = (
      <Resizer
        collapsed={collapsed}
        direction={direction}
        side={side}
        onResize={this.handleResize}
        onResizeEnd={this.handleResizeEnd}
        onResizeButton={this.handleResizeButton}
      />
    )

    return side === 'start' ? (
      <div style={style}>
        {resizer}
        {!collapsed && children}
      </div>
    ) : (
      <div style={style}>
        {!collapsed && children}
        {resizer}
      </div>
    )
  }

  private handleResize = (resizeDelta: number) => {
    const { originalSize } = this.state as InitializedPanelState

    this.setState({
      size: originalSize + resizeDelta,
    })
  }

  private handleResizeEnd = (resizeDelta: number) => {
    const { originalSize } = this.state as InitializedPanelState

    const { name } = this.props

    const data = layout.get(name)
    data.size = resizeDelta < -originalSize ? 0 : originalSize + resizeDelta
    data.collapsed = data.size === 0
    layout.set(name, data)

    this.updateState(data)
  }

  private handleResizeButton = () => {
    const { name } = this.props

    const data = layout.get(name)
    data.collapsed = !data.collapsed
    layout.set(name, data)

    this.updateState(data)
  }

  private updateState(data: Pane) {
    const size = Math.max(this.props.minSize || 0, data.size)

    this.setState({
      originalSize: size,
      size: data.collapsed ? 0 : size,
      collapsed: data.collapsed,
    })
  }
}

export default Panel
