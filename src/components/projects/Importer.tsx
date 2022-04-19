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
  DEFAULT_PAGE_LAYOUT,
  fromPrototype,
  isManuscriptModel,
  loadBundledDependencies,
  StyleObject,
  updatedPageLayout,
} from '@manuscripts/manuscript-transform'
import { Manuscript, Model } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import { History } from 'history'
import React from 'react'

import config from '../../config'
import { loadBundle } from '../../lib/bundles'
import {
  BulkCreateError,
  FileExtensionError,
  FileImportError,
} from '../../lib/errors'
import { isManuscript, nextManuscriptPriority } from '../../lib/manuscript'
import { trackEvent } from '../../lib/tracking'
import {
  acceptedFileExtensions,
  importFile,
  openFilePicker,
} from '../../pressroom/importers'
import { bulkCreate } from '../../store'
import { ContactSupportButton } from '../ContactSupportButton'
import { ProgressModal } from './ProgressModal'

const progressText = (index: number, total: number): string =>
  total === 1 ? '' : ` ${index + 1} of ${total}`

interface Props {
  importManuscript: (models: Model[], redirect?: boolean) => Promise<void>
  handleComplete: (file?: File) => void
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

      const data: File[] = this.props.file
        ? [this.props.file]
        : await openFilePicker(acceptedFileExtensions(), true)

      if (!data.length) {
        this.props.handleComplete()
        return
      }

      const fileModels = []

      for (const [index, file] of data.entries()) {
        this.setState({
          status: `Converting manuscript${progressText(index, data.length)}…`,
        })

        try {
          fileModels.push(await importFile(file))
        } catch (error) {
          throw new FileImportError(error.message, file)
        }
      }

      if (this.state.cancelled) {
        return
      }

      this.setState({
        canCancel: false,
      })

      for (const [index, models] of fileModels.entries()) {
        this.setState({
          status: `Saving manuscript${progressText(index, data.length)}…`,
        })

        const isLastItem = index === fileModels.length - 1
        await this.props.importManuscript(models, isLastItem)
      }

      this.setState({
        status: undefined,
      })

      trackEvent({
        category: 'Manuscripts',
        action: 'Import',
        label: `file=${data[0].name}`,
      })

      this.props.handleComplete()
    } catch (error) {
      console.error(error)

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
          {error.failures.map((failure) => (
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
          {error.acceptedExtensions.map((extension) => (
            <li key={extension}>{extension}</li>
          ))}
        </ul>
      </div>
    )
  }

  if (error instanceof FileImportError) {
    return (
      <div>
        <p>There was an error importing {error.file.name}</p>

        <div>{error.message}</div>
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

export const importManuscript = async (
  models: Model[],
  projectID: string,
  bulkCreate: bulkCreate,
  history: History,
  manuscripts: Manuscript[],
  redirect: boolean
) => {
  const manuscript = models.find(isManuscript)

  if (!manuscript) {
    throw new Error('No manuscript found')
  }

  // TODO: try to share this code with createManuscript

  manuscript.priority = await nextManuscriptPriority(manuscripts)

  // TODO: use the imported filename?
  if (!manuscript.pageLayout) {
    if (!models.find((model) => model._id === manuscript.bundle)) {
      const [bundle, parentBundle] = await loadBundle(manuscript.bundle)
      manuscript.bundle = bundle._id
      models.push(bundle)

      if (parentBundle) {
        models.push(parentBundle)
      }
    }

    const dependencies = await loadBundledDependencies()
    const prototypedDependencies = dependencies.map(fromPrototype)
    models.push(...prototypedDependencies)

    const styleMap = new Map(
      prototypedDependencies.map((style) => [style._id, style])
    )
    const pageLayout = updatedPageLayout(
      styleMap as Map<string, StyleObject>,
      DEFAULT_PAGE_LAYOUT
    )
    manuscript.pageLayout = pageLayout._id
    models.push(pageLayout)

    // TODO: apply a template?
  }

  // TODO: save dependencies first, then the manuscript
  // TODO: handle multiple manuscripts in a project bundle

  const items = models.map((model) => ({
    ...model,
    containerID: projectID,
    manuscriptID: isManuscriptModel(model) ? manuscript._id : undefined,
  }))

  await bulkCreate(items)

  if (redirect) {
    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)
  } else if (config.environment === 'development') {
    alert(`projectID: ${projectID}; manuscriptID: ${manuscript._id}`)
  }
}
