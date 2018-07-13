import { Location } from 'history'
import React from 'react'
import { match } from 'react-router'
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
  margin-top: 10px;
  margin-bottom: 10px;

  &:hover,
  &.active {
    background: #fff;
    color: ${(props: ThemedDivProps) => props.theme.colors.primary.blue};
  }
`

const Tooltip = styled.div`
  background: #364d5e;
  color: #fff;
  padding: 2px 8px;
  border-radius: 2px;
  z-index: 10;
  position: absolute;
  top: 25%;
  left: 120%;
  opacity: 0.9;
`

const Container = styled.div`
  overflow: visible;
  position: relative;
`

interface Props {
  exact?: boolean
  title: string
  to: string
  isActive?<P>(match: match<P>, location: Location): boolean
}

interface State {
  isOver: boolean
}

class ProjectLink extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isOver: false,
  }

  private timer: number | undefined

  public render() {
    const { children, to, title, isActive } = this.props
    const { isOver } = this.state

    return (
      <Container onMouseLeave={this.hideTitle}>
        <IconLink to={to} isActive={isActive} onMouseEnter={this.showTitle}>
          {children}
        </IconLink>
        {isOver && <Tooltip>{title}</Tooltip>}
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

export default ProjectLink
