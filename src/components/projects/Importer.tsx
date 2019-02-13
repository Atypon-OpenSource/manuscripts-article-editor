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

import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { importFile, openFilePicker } from '../../pressroom/importers'
import { Category, Dialog } from '../Dialog'
import { buildImportErrorMessage } from '../Messages'
import { ProgressModal } from './ProgressModal'

interface Props {
  importManuscript: (models: Model[]) => Promise<void>
  handleComplete: () => void
  file?: File
}

interface State {
  canCancel: boolean
  cancelled: boolean
  status?: string
  error?: Error
}

export class Importer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    canCancel: false,
    cancelled: false,
  }

  public async componentDidMount() {
    try {
      this.setState({
        canCancel: true,
      })

      const data = this.props.file ? this.props.file : await openFilePicker()

      if (!data) {
        this.props.handleComplete()
        return
      }

      this.setState({
        status: 'Converting manuscript…',
      })

      const models = await importFile(data)

      if (this.state.cancelled) {
        return
      }

      this.setState({
        canCancel: false,
        status: 'Importing manuscript…',
      })

      await this.props.importManuscript(models)

      this.setState({
        status: undefined,
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
          header={'Import error'}
          message={buildImportErrorMessage(error)}
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
