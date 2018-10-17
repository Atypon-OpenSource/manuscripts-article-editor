import * as React from 'react'
import { importFile, openFilePicker } from '../../lib/importers'
import { styled } from '../../theme'
import { Model } from '../../types/models'

export interface ImportProps {
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
  importManuscript: (models: Model[]) => Promise<void>
  render: (props: ImportProps) => React.ReactNode
}

interface State {
  isImporting: boolean
  isOver: boolean
}

class ImportContainer extends React.Component<Props, State> {
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

    await openFilePicker().then(this.importFile)
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

  private handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const dataTransfer = event.dataTransfer

    if (dataTransfer.files) {
      await this.importFile(dataTransfer.files[0])
    }
  }

  private importFile = async (file: File) => {
    this.setState({ isImporting: true })

    await importFile(file).then(this.props.importManuscript)

    this.setState({ isImporting: false })
  }
}

export default ImportContainer
