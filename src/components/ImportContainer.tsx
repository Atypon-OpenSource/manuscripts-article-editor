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
import * as React from 'react'
import Dropzone, { DropFilesEventHandler } from 'react-dropzone'
import { accept } from '../pressroom/importers'
import { styled } from '../theme/styled-components'
import { ModalProps, withModal } from './ModalProvider'
import { Importer } from './projects/Importer'

const StyledDropArea = styled.div`
  flex: 1;
  display: flex;
`

export interface ImportProps {
  handleClick: (event: React.MouseEvent<HTMLDivElement>) => Promise<void>
  isDragActive: boolean
}

interface Props {
  importManuscript: (models: Model[]) => Promise<void>
  render: (props: ImportProps) => JSX.Element
}

class ImportContainer extends React.Component<Props & ModalProps> {
  public render() {
    return (
      <Dropzone
        onDrop={this.handleDrop}
        accept={accept}
        disableClick={true}
        multiple={false}
      >
        {({ isDragActive, getRootProps }) => (
          <StyledDropArea {...getRootProps()}>
            {this.props.render({
              handleClick: this.handleClick,
              isDragActive,
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

  private handleDrop: DropFilesEventHandler = (
    acceptedFiles,
    rejectedFiles
  ) => {
    if (acceptedFiles) {
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

export default withModal<Props>(ImportContainer)
