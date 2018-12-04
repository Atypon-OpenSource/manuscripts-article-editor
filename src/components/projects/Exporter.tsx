import { Manuscript, Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import config from '../../config'
import { download } from '../../lib/download'
import {
  downloadExtension,
  exportProject,
  generateDownloadFilename,
} from '../../pressroom/exporter'
import { Category, Dialog } from '../Dialog'
import { ProgressModal } from './ProgressModal'

interface Props {
  format: string
  handleComplete: () => void
  manuscriptID: string
  modelMap: Map<string, Model>
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
    const { modelMap, manuscriptID, format } = this.props

    try {
      this.setState({
        canCancel: true,
        cancelled: false,
        status: 'Exporting manuscript…',
      })

      const blob = await exportProject(modelMap, manuscriptID, format)

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
