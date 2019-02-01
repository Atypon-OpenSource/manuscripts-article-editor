import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import config from '../../config'
import { BulkCreateError } from '../../lib/errors'
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
          message={this.buildErrorMessage(error)}
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

  private buildErrorMessage = (error: Error) => {
    const contactMessage = (
      <p>Please contact {config.support.email} if this persists.</p>
    )

    if (error instanceof BulkCreateError) {
      return (
        <div>
          <p>There was an error saving one or more items.</p>

          {contactMessage}

          <ul>
            {error.failures.map(failure => (
              <li>
                {failure.name}: {failure.id}
              </li>
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

  private handleCancel = () => {
    this.setState(
      {
        cancelled: true,
      },
      this.props.handleComplete
    )
  }
}
