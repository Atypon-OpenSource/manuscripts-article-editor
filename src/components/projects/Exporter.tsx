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
  Manuscript,
  Model,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import { saveAs } from 'file-saver'
import React from 'react'
import {
  downloadExtension,
  ExportFormat,
  exportProject,
  generateDownloadFilename,
} from '../../pressroom/exporter'
import { ContactSupportButton } from '../ContactSupportButton'
import { ProgressModal } from './ProgressModal'
import { SuccessModal } from './SuccessModal'

export type GetAttachment = (
  id: string,
  attachmentID: string
) => Promise<Blob | undefined>

interface Props {
  format: ExportFormat
  getAttachment: GetAttachment
  handleComplete: () => void
  manuscriptID: string
  modelMap: Map<string, Model>
  project: Project
  closeOnSuccess?: boolean
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
    const {
      getAttachment,
      modelMap,
      manuscriptID,
      format,
      project,
    } = this.props

    try {
      this.setState({
        canCancel: true,
        cancelled: false,
        status: 'Exporting manuscript…',
      })

      const blob = await exportProject(
        getAttachment,
        modelMap,
        manuscriptID,
        format,
        project
      )

      if (this.state.cancelled) {
        return
      }

      const manuscript = modelMap.get(manuscriptID) as Manuscript

      const filename =
        generateDownloadFilename(manuscript.title || 'Untitled') +
        downloadExtension(format)

      saveAs(blob, filename)

      if (this.props.closeOnSuccess) {
        this.setState({
          status: null,
        })

        this.props.handleComplete()
      } else {
        this.setState({
          status: 'complete',
        })
      }
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console

      this.setState({ error })
    }
  }

  public render() {
    const { format } = this.props
    const { error, status, canCancel } = this.state

    if (error) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Export error'}
          message={
            <React.Fragment>
              There was an error exporting the manuscript. Please{' '}
              <ContactSupportButton>contact support</ContactSupportButton> if
              this persists.
            </React.Fragment>
          }
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

    if (status === 'complete') {
      if (format === 'do') {
        return (
          <SuccessModal
            status={'Export to Literatum completed successfully'}
            handleDone={() => {
              this.props.handleComplete()
            }}
          />
        )
      }

      if (format === 'submission') {
        return (
          <SuccessModal
            status={'Submission to Literatum completed successfully'}
            handleDone={() => {
              this.props.handleComplete()
            }}
          />
        )
      }
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
