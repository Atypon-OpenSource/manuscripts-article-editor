import React from 'react'
import { ResizerDirection, ResizerSide } from './Resizer'
import {
  HorizontalEndResizerButtonInner,
  HorizontalStartResizerButtonInner,
  VerticalEndResizerButtonInner,
  VerticalStartResizerButtonInner,
} from './ResizerButtonInner'

export interface ResizerButtonProps {
  isCollapsed: boolean
  isVisible: boolean
  onClick?: () => void
  direction: ResizerDirection
  side: ResizerSide
}

const inners = {
  row: {
    start: HorizontalStartResizerButtonInner,
    end: HorizontalEndResizerButtonInner,
  },
  column: {
    start: VerticalStartResizerButtonInner,
    end: VerticalEndResizerButtonInner,
  },
}

export default class ResizerButton extends React.PureComponent<
  ResizerButtonProps
> {
  public static defaultProps = {
    isCollapsed: false,
    isVisible: false,
  }

  public render() {
    const { direction, side } = this.props

    const ResizerButtonInner = inners[direction][side]

    return (
      <ResizerButtonInner
        aria-expanded={!this.props.isCollapsed}
        isCollapsed={this.props.isCollapsed}
        onClick={this.props.onClick}
        isVisible={this.props.isVisible}
        onMouseDown={e => e.preventDefault()}
      />
    )
  }
}
