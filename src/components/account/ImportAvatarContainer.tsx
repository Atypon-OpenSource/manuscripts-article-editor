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
