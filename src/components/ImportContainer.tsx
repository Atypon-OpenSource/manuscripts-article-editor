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
import JSZip from 'jszip'
import { extname } from 'path'
import * as React from 'react'
import Dropzone, { DropFilesEventHandler } from 'react-dropzone'
import {
  acceptedFileDescription,
  acceptedFileExtensions,
  acceptedMimeTypes,
} from '../pressroom/importers'
import { styled } from '../theme/styled-components'
import { Category, Dialog } from './Dialog'
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

class ImportContainer extends React.Component<Props & ModalProps & State> {
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
        disableClick={true}
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

    this.props.addModal('importer', ({ handleClose }) => (
      <Importer
        handleComplete={handleClose}
        importManuscript={this.props.importManuscript}
      />
    ))
  }

  private handleDrop: DropFilesEventHandler = async (
    acceptedFiles,
    rejectedFiles
  ) => {
    if (acceptedFiles.length) {
      if (acceptedFiles[0].name.endsWith('.zip')) {
        await this.handleZipFile(acceptedFiles[0])
      }

      if (!this.state.rejected) {
        this.props.addModal('importer', ({ handleClose }) => (
          <Importer
            handleComplete={handleClose}
            importManuscript={this.props.importManuscript}
            file={acceptedFiles[0]}
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
    const extensions = ['.md', '.tex', '.latex']

    const isAccepted = Object.keys(zip.files).some(name =>
      extensions.includes(extname(name))
    )

    if (!isAccepted) {
      this.setState({ rejected: file })
    }
  }
}

export default withModal<Props>(ImportContainer)
