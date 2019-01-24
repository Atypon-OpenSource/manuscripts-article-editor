import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

type Props = RouteComponentProps<{ projectID: string }>

class ProjectNavigator extends React.PureComponent<Props> {
  private keymap: { [key: string]: () => void }

  public constructor(props: Props) {
    super(props)

    const { match, history } = this.props
    const { projectID } = match.params

    this.keymap = {
      'alt+mod+3': () => history.push(`/projects/${projectID}`),
      'alt+mod+4': () => history.push(`/projects/${projectID}/library`),
      'alt+mod+5': () => history.push(`/projects/${projectID}/collaborators`),
    }
  }

  public componentDidMount() {
    Object.entries(this.keymap).forEach(([combo, handler]) => {
      Mousetrap.bindGlobal(combo, handler)
    })
  }

  public componentWillUnmount() {
    Mousetrap.unbind(Object.keys(this.keymap))
  }

  public render() {
    return null
  }
}

export default withRouter(ProjectNavigator)
