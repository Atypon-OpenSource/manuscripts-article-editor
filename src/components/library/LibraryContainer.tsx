import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteProps } from 'react-router'
import { filterLibrary } from '../../lib/library'
import { Main } from '../Page'
import Panel from '../Panel'
import LibraryForm from './LibraryForm'
import { LibraryItems } from './LibraryItems'

interface Props {
  library: Map<string, BibliographyItem>
  handleDelete: (item: BibliographyItem) => Promise<string>
  handleSave: (item: BibliographyItem) => Promise<BibliographyItem>
  projectID: string
}

interface State {
  item: BibliographyItem | null
  items: Map<string, BibliographyItem>
  query: string
}

class LibraryContainer extends React.Component<Props & RouteProps, State> {
  public state: Readonly<State> = {
    item: null,
    items: new Map(),
    query: '',
  }

  public render() {
    const { library, projectID } = this.props
    const { item, query } = this.state

    const items: BibliographyItem[] = filterLibrary(library, query)

    return (
      <React.Fragment>
        <Main>
          <LibraryItems
            query={query}
            handleQuery={this.handleQuery}
            handleSelect={this.handleSelect}
            hasItem={() => true}
            items={items}
          />
        </Main>

        <Panel
          name={'libraryItem'}
          side={'start'}
          direction={'row'}
          minSize={300}
        >
          {item && (
            <LibraryForm
              item={item}
              handleSave={this.handleSave}
              handleDelete={this.handleDelete}
              projectID={projectID}
            />
          )}
        </Panel>
      </React.Fragment>
    )
  }

  private handleQuery = (query: string) => {
    this.setState({
      query: query === this.state.query ? '' : query,
    })
  }

  private handleSelect = (item: BibliographyItem) => {
    this.setState({ item })
  }

  private handleSave = async (item: BibliographyItem) => {
    await this.props.handleSave(item)
    this.setState({ item: null })
  }

  private handleDelete = async (item: BibliographyItem) => {
    await this.props.handleDelete(item)
    this.setState({ item: null })
  }
}

export default LibraryContainer
