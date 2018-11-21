import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme'
import { CitationSearch } from './CitationSearch'
import { LibraryItem } from './LibraryItem'

const Actions = styled.div`
  display: flex;
  padding: 8px;
  justify-content: space-between;
`

interface Props {
  filterLibraryItems: (query: string) => BibliographyItem[]
  items: Array<BibliographyItem | undefined>
  handleRemove: (id: string) => void
  handleSelect: (item: BibliographyItem, source?: string) => Promise<void>
  projectID: string
  selectedText: string
}

export type CitationEditorProps = Props

interface State {
  selected: number
}

class CitationEditor extends React.Component<Props, State> {
  public state = {
    selected: 0,
  }

  public render() {
    const { filterLibraryItems, items, handleSelect, selectedText } = this.props
    const { selected } = this.state

    const item = items[selected]

    return (
      <div>
        {item ? (
          <LibraryItem
            item={item}
            handleSelect={() => {
              if (item.DOI) {
                window.open(`https://doi.org/${item.DOI}`)
              }
            }}
            hasItem={() => true}
          />
        ) : (
          <CitationSearch
            filterLibraryItems={filterLibraryItems}
            query={selectedText}
            handleSelect={handleSelect}
          />
        )}

        <Actions>
          {selected > 0 ? (
            <button onClick={this.selectPrevious}>&lt;</button>
          ) : (
            <span />
          )}

          {item ? (
            <span>
              <button onClick={this.handleRemove}>-</button>
              <button onClick={this.handleAdd}>+</button>
            </span>
          ) : (
            <span />
          )}

          {selected < items.length - 1 ? (
            <button onClick={this.selectNext}>&gt;</button>
          ) : (
            <span />
          )}
        </Actions>
      </div>
    )
  }

  private handleAdd = () => {
    this.setState({
      selected: this.props.items.length,
    })
  }

  private handleRemove = () => {
    const item = this.props.items[this.state.selected]

    this.props.handleRemove(item!._id)

    this.setState({
      selected: this.state.selected - 1,
    })
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
