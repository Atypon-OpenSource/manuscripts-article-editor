import React from 'react'
import { styled } from '../theme'
import { BibliographyItem } from '../types/components'
import LibraryForm from './LibraryForm'

const Actions = styled.div`
  display: flex;
  padding: 8px;
`

interface Props {
  items: BibliographyItem[]
  handleSave: (item: BibliographyItem) => void
  handleDelete?: (item: BibliographyItem) => void
}

interface State {
  selected: number
}

class CitationEditor extends React.Component<Props, State> {
  public state = {
    selected: 0,
  }

  public render() {
    const { items, handleSave, handleDelete } = this.props
    const { selected } = this.state

    const item = items[selected]

    return (
      <div>
        <LibraryForm
          item={item}
          handleSave={handleSave}
          handleDelete={handleDelete}
        />

        <Actions>
          {selected > 0 && <button onClick={this.selectPrevious}>&lt;</button>}

          {selected < items.length - 1 && (
            <button onClick={this.selectNext}>&gt;</button>
          )}
        </Actions>
      </div>
    )
  }

  private selectPrevious = () => {
    this.setState({
      selected: this.state.selected - 1,
    })
  }

  private selectNext = () => {
    this.setState({
      selected: this.state.selected + 1,
    })
  }
}

export default CitationEditor
