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

import * as React from 'react'
import styled from 'styled-components'
import { openImagePicker } from '../../lib/images'

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
