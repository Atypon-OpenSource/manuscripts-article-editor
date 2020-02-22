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
import JSZip from 'jszip'
import { extname } from 'path'
import * as React from 'react'
import Dropzone from 'react-dropzone'
import {
  acceptedFileDescription,
  acceptedFileExtensions,
  acceptedMimeTypes,
  openFilePicker,
} from '../pressroom/importers'
import { styled } from '../theme/styled-components'
import { ModalProps, withModal } from './ModalProvider'
import { Importer } from './projects/Importer'

const StyledDropArea = styled.div`
  flex: 1;
  display: flex;

  &:focus {
    outline: none;
  }
`

export interface ImportProps {
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>
  isDragActive: boolean
  isDragAccept: boolean
}

interface Props {
  importManuscript: (models: Model[]) => Promise<void>
  render: (props: ImportProps) => JSX.Element
}

interface State {
  rejected: File | null
}

class ImportContainer extends React.Component<Props & ModalProps, State> {
  public state: Readonly<State> = {
    rejected: null,
  }

  public render() {
    const rejected = this.state.rejected

    if (rejected) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Import error'}
          message={
            <div>
              <div>
                Files you dropped in could not be imported.
                {<ul>{<li key={rejected.name}>{rejected.name}</li>}</ul>}
              </div>
              <div>
                The following file formats are supported:
                {
                  <ul>
                    {acceptedFileDescription().map(description => (
                      <li key={description}>{description}</li>
                    ))}
                  </ul>
                }
              </div>
            </div>
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
    return (
      <Dropzone
        onDrop={this.handleDrop}
        accept={[
          acceptedMimeTypes().join(','),
          acceptedFileExtensions().join(','),
        ].join(',')}
        noClick={true}
        multiple={false}
      >
        {({ isDragActive, isDragAccept, getRootProps }) => (
          <StyledDropArea {...getRootProps()}>
            {this.props.render({
              handleClick: this.handleClick,
              isDragActive,
              isDragAccept,
            })}
          </StyledDropArea>
        )}
      </Dropzone>
    )
  }

  private handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const file = await openFilePicker()

    if (file) {
      this.props.addModal('importer', ({ handleClose }) => (
        <Importer
          handleComplete={handleClose}
          importManuscript={this.props.importManuscript}
          file={file}
        />
      ))
    }
  }

  private handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const [acceptedFile] = acceptedFiles

      if (acceptedFile.name.endsWith('.zip')) {
        await this.handleZipFile(acceptedFile)
      }

      if (!this.state.rejected) {
        this.props.addModal('importer', ({ handleClose }) => (
          <Importer
            handleComplete={handleClose}
            importManuscript={this.props.importManuscript}
            file={acceptedFile}
          />
        ))
      }
    }
  }

  private handleCancel = () => {
    this.setState({ rejected: null })
  }

  private handleZipFile = async (file: File) => {
    const zip = await new JSZip().loadAsync(file)

    // file extensions to look for in a ZIP archive
    const extensions = ['.md', '.tex', '.latex'] // TODO: .xml, .html

    const isAccepted = Object.keys(zip.files).some(name =>
      extensions.includes(extname(name))
    )

    if (!isAccepted) {
      this.setState({ rejected: file })
    }
  }
}

export default withModal(ImportContainer)
