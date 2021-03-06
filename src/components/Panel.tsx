/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  Resizer,
  ResizerDirection,
  ResizerSide,
  RoundIconButton,
} from '@manuscripts/style-guide'
import React from 'react'
import styled from 'styled-components'

import layout, { Pane } from '../lib/layout'

export interface ResizerButtonInnerProps {
  isCollapsed: boolean
  isVisible: boolean
}
export const ResizerButton = styled(RoundIconButton)<ResizerButtonInnerProps>`
  position: absolute;
  top: 50%;
  margin: -${(props) => props.theme.grid.unit * 5}px;
  line-height: 1;
`

interface PanelProps {
  name: string
  minSize?: number
  direction: ResizerDirection
  side: ResizerSide
  hideWhen?: string
  forceOpen?: boolean
  resizerButton?: React.ComponentType<ResizerButtonInnerProps>
}

interface PanelState {
  originalSize: number | null
  size: number | null
  collapsed: boolean
  hidden: boolean
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
    hidden: false,
  }

  private hideWhenQuery?: MediaQueryList

  public componentDidMount() {
    if (this.props.hideWhen) {
      this.hideWhenQuery = window.matchMedia(
        `screen and (${this.props.hideWhen})`
      )

      this.hideWhenQuery.addListener(this.handleHideWhenChange)

      this.setState({
        hidden: this.hideWhenQuery.matches,
      })
    }

    this.updateState(layout.get(this.props.name))
  }

  public componentWillReceiveProps(nextProps: PanelProps) {
    if (nextProps.forceOpen !== this.props.forceOpen) {
      this.updateState(layout.get(this.props.name), nextProps.forceOpen)
    }
  }

  public componentWillUnmount() {
    if (this.hideWhenQuery) {
      this.hideWhenQuery.removeListener(this.handleHideWhenChange)
    }
  }

  public render() {
    const { children, direction, resizerButton, side } = this.props
    const { collapsed, hidden, size, originalSize } = this.state

    if (size === null || originalSize === null) {
      return null
    }

    const style = this.buildStyle(direction, size)

    const resizer = hidden ? null : (
      <Resizer
        collapsed={collapsed}
        direction={direction}
        side={side}
        onResize={this.handleResize}
        onResizeEnd={this.handleResizeEnd}
        onResizeButton={this.handleResizeButton}
        buttonInner={resizerButton}
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

  private buildStyle = (direction: string | null, size: number): PanelStyle => {
    return {
      position: 'relative',
      width: direction === 'row' ? size : '100%',
      height: direction === 'row' ? '100%' : size,
    }
  }

  private handleHideWhenChange = (event: MediaQueryListEvent) => {
    this.setState({ hidden: event.matches })
    this.updateState(layout.get(this.props.name))
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

  private updateState(data: Pane, forceOpen = false) {
    const { minSize } = this.props
    const { hidden } = this.state

    const size = Math.max(minSize || 0, data.size)

    const collapsed = !forceOpen && (data.collapsed || hidden)

    this.setState({
      originalSize: size,
      size: collapsed ? 0 : size,
      collapsed,
    })
  }
}

export default Panel
