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

import { Model } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import { BulkCreateError, FileExtensionError } from '../../lib/errors'
import { importFile, openFilePicker } from '../../pressroom/importers'
import { ContactSupportButton } from '../ContactSupportButton'
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

const buildImportErrorMessage = (error: Error) => {
  const contactMessage = (
    <p>
      Please <ContactSupportButton>contact support</ContactSupportButton> if
      this persists.
    </p>
  )

  if (error instanceof BulkCreateError) {
    return (
      <div>
        <p>There was an error saving one or more items.</p>

        {contactMessage}

        <ul>
          {error.failures.map(failure => (
            <li key={failure.id}>
              {failure.name}: {failure.id}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (error instanceof FileExtensionError) {
    return (
      <div>
        <p>Could not import file with extension {error.extension}</p>

        <p>The following file extensions are supported:</p>

        <ul>
          {error.acceptedExtensions.map(extension => (
            <li key={extension}>{extension}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <p>There was an error importing the manuscript.</p>
      {contactMessage}
    </div>
  )
}
