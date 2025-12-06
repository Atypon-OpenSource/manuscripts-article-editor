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
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import layout, { Pane } from '../lib/layout'
import { useStore } from '../store'

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
  resizerButton?: React.ComponentType<ResizerButtonInnerProps>
  children: React.ReactNode
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

const Panel: React.FC<PanelProps> = (props) => {
  const [state, setState] = useState<PanelState>({
    originalSize: null,
    size: null,
    collapsed: false,
    hidden: false,
  })

  const hideWhenQuery = useRef<MediaQueryList | undefined>(undefined)
  const firstRender = useRef(true)
  const [{ selectedCommentKey, selectedSuggestionID, inspectorOpenTabs }] =
    useStore((store) => ({
      selectedCommentKey: store.selectedCommentKey,
      selectedSuggestionID: store.selectedSuggestionID,
      inspectorOpenTabs: store.inspectorOpenTabs,
    }))

  useEffect(() => {
    const { name } = props
    if (name === 'inspector' && !firstRender.current) {
      const data = layout.get(name)
      //we should not close the inspector automatically when
      //things are deselected
      if (
        data.collapsed &&
        (selectedCommentKey || selectedSuggestionID || inspectorOpenTabs)
      ) {
        updateState(
          layout.set(name, {
            ...data,
            collapsed: false,
          })
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommentKey, selectedSuggestionID, inspectorOpenTabs])

  useEffect(() => {
    if (props.hideWhen) {
      hideWhenQuery.current = window.matchMedia(
        `screen and (${props.hideWhen})`
      )

      hideWhenQuery.current.addListener(handleHideWhenChange)

      setState((state) => {
        return { ...state, hidden: !!hideWhenQuery.current?.matches }
      })
    }
    updateState(layout.get(props.name))

    return () => {
      if (hideWhenQuery.current) {
        hideWhenQuery.current.removeListener(handleHideWhenChange)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateState(data: Pane) {
    const { minSize } = props
    const { hidden } = state
    const size = Math.max(minSize || 0, data.size)
    const collapsed = data.collapsed || hidden
    if (firstRender.current) {
      firstRender.current = false
    }
    setState((state) => ({
      ...state,
      originalSize: size,
      size: collapsed ? 0 : size,
      collapsed,
    }))
  }

  function buildStyle(direction: string | null, size: number): PanelStyle {
    return {
      position: 'relative',
      width: direction === 'row' ? size : '100%',
      height: direction === 'row' ? '100%' : size,
    }
  }

  function handleHideWhenChange(event: MediaQueryListEvent) {
    setState((state) => ({ ...state, hidden: event.matches }))
    updateState(layout.get(props.name))
  }

  function handleResize(resizeDelta: number) {
    const { originalSize } = state as InitializedPanelState

    setState((state) => ({
      ...state,
      size: originalSize + resizeDelta,
    }))
  }

  function handleResizeEnd(resizeDelta: number) {
    const { originalSize } = state as InitializedPanelState
    const { name } = props
    const data = layout.get(name)
    data.size = resizeDelta < -originalSize ? 0 : originalSize + resizeDelta
    data.collapsed = data.size === 0
    layout.set(name, data)
    updateState(data)
  }

  function handleResizeButton() {
    const { name } = props
    const data = layout.get(name)
    data.collapsed = !data.collapsed
    layout.set(name, data)
    updateState(data)
  }

  const { children, direction, resizerButton, side } = props
  const { collapsed, hidden, size, originalSize } = state

  if (size === null || originalSize === null) {
    return null
  }

  const style = buildStyle(direction, size)

  const resizer = hidden ? null : (
    <Resizer
      collapsed={collapsed}
      direction={direction}
      side={side}
      onResize={handleResize}
      onResizeEnd={handleResizeEnd}
      onResizeButton={handleResizeButton}
      buttonInner={resizerButton}
    />
  )

  return side === 'start' ? (
    <div style={style} data-panel-name={props.name}>
      {resizer}
      {!collapsed && children}
    </div>
  ) : (
    <div style={style} data-panel-name={props.name}>
      {!collapsed && children}
      {resizer}
    </div>
  )
}

export default Panel
