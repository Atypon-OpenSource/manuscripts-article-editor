import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
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

class LibraryContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    item: null,
    items: new Map(),
    query: '',
  }

  public render() {
    const { library, projectID } = this.props
    const { item, query } = this.state

    return (
      <React.Fragment>
        <Main>
          <LibraryItems
            query={query}
            handleQuery={value => {
              this.setState({
                query: value === query ? '' : value,
              })
            }}
            handleSelect={item => {
              this.setState({ item })
            }}
            hasItem={() => true}
            items={filterLibrary(library, query)}
            projectID={projectID}
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
              handleSave={async item => {
                await this.props.handleSave(item)
                this.setState({ item: null })
              }}
              handleDelete={async item => {
                await this.props.handleDelete(item)
                this.setState({ item: null })
              }}
              projectID={projectID}
            />
          )}
        </Panel>
      </React.Fragment>
    )
  }
}

export default LibraryContainer
