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

import * as React from 'react'
import { openImagePicker } from '../../lib/images'
import { styled } from '../../theme/styled-components'

export interface ImportAvatarProps {
  isImporting: boolean
  isOver: boolean
}

const Container = styled.div`
  cursor: pointer;

  & * {
    pointer-events: none;
  }
`

interface Props {
  importAvatar: (avatar: File) => void
  render: (props: ImportAvatarProps) => React.ReactNode
}

interface State {
  isImporting: boolean
  isOver: boolean
}

class ImportAvatarContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    isImporting: false,
    isOver: false,
  }

  public render() {
    const { isImporting, isOver } = this.state

    return (
      <Container
        onClick={this.handleClick}
        onDragOver={this.handleDragOver}
        onDragEnter={this.onMouseEnter}
        onDragLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onDrop={this.handleDrop}
      >
        {this.props.render({ isImporting, isOver })}
      </Container>
    )
  }

  private handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    await openImagePicker().then(this.importImage)
  }

  private handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  private onMouseEnter = () => {
    this.setState({ isOver: true })
  }

  private onMouseLeave = () => {
    this.setState({ isOver: false })
  }

  private handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const dataTransfer = event.dataTransfer

    if (dataTransfer.files) {
      this.importImage(dataTransfer.files[0])
    }
  }

  private importImage = (file: File) => {
    this.setState({ isImporting: true })

    this.props.importAvatar(file)

    this.setState({ isImporting: false })
  }
}

export default ImportAvatarContainer
