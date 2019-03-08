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

import {
  Manuscript,
  Model,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import config from '../../config'
import { download } from '../../lib/download'
import {
  downloadExtension,
  exportProject,
  generateDownloadFilename,
} from '../../pressroom/exporter'
import { ProgressModal } from './ProgressModal'

interface Props {
  format: string
  handleComplete: () => void
  manuscriptID: string
  modelMap: Map<string, Model>
  project: Project
}

interface State {
  canCancel: boolean
  cancelled: boolean
  status: string | null
  error: Error | null
}

export class Exporter extends React.Component<Props, State> {
  public state: Readonly<State> = {
    canCancel: false,
    cancelled: false,
    error: null,
    status: null,
  }

  public async componentDidMount() {
    const { modelMap, manuscriptID, format, project } = this.props

    try {
      this.setState({
        canCancel: true,
        cancelled: false,
        status: 'Exporting manuscript…',
      })

      const blob = await exportProject(modelMap, manuscriptID, format, project)

      if (this.state.cancelled) {
        return
      }

      const manuscript = modelMap.get(manuscriptID) as Manuscript

      const filename =
        generateDownloadFilename(manuscript.title || 'Untitled') +
        downloadExtension(format)

      download(blob, filename)

      this.setState({
        status: null,
      })

      this.props.handleComplete()
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console

      this.setState({ error })
    }
  }

  public render() {
    const { error, status, canCancel } = this.state

    if (error) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Export error'}
          message={`There was an error importing the manuscript. Please contact ${
            config.support.email
          } if this persists.`}
          actions={{
            primary: {
              action: this.handleCancel,
              title: 'OK',
            },
          }}
        />
      )
    }

    if (!status) {
      return null
    }

    return (
      <ProgressModal
        canCancel={canCancel}
        handleCancel={this.handleCancel}
        status={status}
      />
    )
  }

  private handleCancel = () => {
    this.setState(
      {
        cancelled: true,
      },
      this.props.handleComplete
    )
  }
}
