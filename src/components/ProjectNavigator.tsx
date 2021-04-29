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

// eslint-disable-next-line simple-import-sort/sort
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'

import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

type Props = RouteComponentProps<{ projectID: string }>

class ProjectNavigator extends React.PureComponent<Props> {
  private readonly keymap: { [key: string]: () => void }

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
      Mousetrap.bind(combo, handler)
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
