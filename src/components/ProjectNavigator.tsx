/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
