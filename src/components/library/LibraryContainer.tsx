import React from 'react'
import { RouteProps } from 'react-router'
import { BibliographyItem } from '../../types/components'
import { LibraryDocument } from '../../types/library'
import { Main } from '../Page'
import Panel from '../Panel'
import LibraryForm from './LibraryForm'
import { LibraryItems } from './LibraryItems'

const buildKeywordMatches = (keyword: string, library: LibraryDocument[]) => {
  const output: LibraryDocument[] = []

  for (const item of library) {
    const ids = item.get('keywordIDs') as string[] | null

    if (ids && ids.includes(keyword)) {
      output.push(item)
    }
  }

  return output
}

const buildTextMatches = (match: string, library: LibraryDocument[]) => {
  const output: LibraryDocument[] = []

  for (const item of library) {
    const title = item.get('title').toLowerCase()

    if (title && title.indexOf(match) !== -1) {
      output.push(item)
    }
  }

  return output
}

export const filterLibrary = (library: LibraryDocument[], query: string) => {
  if (!query) return library

  if (!library) return []

  const matches = query.match(/^keyword:(.+)/)

  if (matches) {
    return buildKeywordMatches(matches[1], library)
  }

  return buildTextMatches(query.toLowerCase(), library)
}

interface Props {
  library: LibraryDocument[]
  handleDelete: (item: BibliographyItem) => Promise<string>
  handleSave: (item: BibliographyItem) => Promise<BibliographyItem>
  projectID: string
}

interface State {
  item: BibliographyItem | null
  items: LibraryDocument[]
  query: string
}

class LibraryContainer extends React.Component<Props & RouteProps, State> {
  public state = {
    item: null,
    items: [],
    query: '',
  }

  public render() {
    const { library, projectID } = this.props
    const { item, query } = this.state

    const items = filterLibrary(library, query)

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
