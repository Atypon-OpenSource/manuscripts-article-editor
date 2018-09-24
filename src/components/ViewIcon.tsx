import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled, ThemedProps } from '../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const IconLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  background: none;
  color: white;
`

interface TooltipProps {
  top?: string
  left?: string
}

const Tooltip = styled.div<TooltipProps>`
  background: #364d5e;
  color: #fff;
  padding: 2px 8px;
  border-radius: 2px;
  z-index: 10;
  position: absolute;
  top: ${props => props.top || '4px'};
  left: ${props => props.left || '32px'};
  font-size: 12px;
  letter-spacing: -0.2px;
`

const Container = styled.div`
  overflow: visible;
  position: relative;
`

export const ViewLink = styled(IconLink)`
  margin: 12px 0;

  &:hover,
  &.active {
    background: #fff;
    color: ${(props: ThemedDivProps) => props.theme.colors.primary.blue};
  }
`

interface Props {
  title: string
  tooltip?: TooltipProps
}

interface State {
  isOver: boolean
}

class ViewIcon extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isOver: false,
  }

  private timer: number | undefined

  public render() {
    const { children, title, tooltip = {} } = this.props
    const { isOver } = this.state

    return (
      <Container onMouseEnter={this.showTitle} onMouseLeave={this.hideTitle}>
        {children}
        {isOver && <Tooltip {...tooltip}>{title}</Tooltip>}
      </Container>
    )
  }

  private showTitle = () => {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }

    this.timer = window.setTimeout(() => {
      this.setState({ isOver: true })
    }, 200)
  }

  private hideTitle = () => {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }

    this.setState({ isOver: false })
  }
}

export default ViewIcon
