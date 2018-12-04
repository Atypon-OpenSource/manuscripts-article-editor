import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import config from '../../config'
import { importFile, openFilePicker } from '../../pressroom/importers'
import { Category, Dialog } from '../Dialog'
import { ProgressModal } from './ProgressModal'

interface Props {
  importManuscript: (models: Model[]) => Promise<void>
  handleComplete: () => void
}

interface State {
  canCancel: boolean
  cancelled: boolean
  status: string | null
  error: Error | null
}

export class Importer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    canCancel: false,
    cancelled: false,
    error: null,
    status: null,
  }

  public async componentDidMount() {
    try {
      this.setState({
        canCancel: true,
      })

      const data = await openFilePicker()

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
          header={'Import error'}
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
