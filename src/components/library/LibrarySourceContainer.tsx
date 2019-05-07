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

import SearchIcon from '@manuscripts/assets/react/SearchIcon'
import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import config from '../../config'
import { estimateID } from '../../lib/library'
import { LibrarySource } from '../../lib/sources'
import { styled } from '../../theme/styled-components'
import { LibrarySearchSection } from './LibrarySearchSection'

interface State {
  items: Array<Partial<BibliographyItem>>
  query: string
  isSearching: boolean
  selectedSource: string | null
  fetching: Set<string>
  selected: Map<string, Build<BibliographyItem>>
  shouldSearch: boolean
}

const Container = styled.div`
  font-family: ${props => props.theme.fontFamily};
  flex: 1;
`
const Search = styled.input`
  margin: 4px;
  padding: 8px;
  flex: 1;
  font-size: 1em;
  border: none;
  width: 500px;
  -webkit-appearance: none;
  outline: none;
`

const Results = styled.div`
  overflow-y: auto;
`

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`

interface Props {
  source: LibrarySource
  handleAdd: (item: BibliographyItem) => void
  hasItem: (item: BibliographyItem) => boolean
}

class LibrarySourceContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    fetching: new Set<string>(),
    selected: new Map(),
    selectedSource: '',
    items: [],
    query: '',
    isSearching: false,
    shouldSearch: false,
  }

  public render() {
    const { query, fetching, selected, shouldSearch } = this.state
    const { source, hasItem } = this.props
    return (
      <Container>
        <SearchContainer>
          <SearchIcon />
          <Search
            autoComplete={'off'}
            autoFocus={true}
            onChange={this.handleQuery}
            placeholder={'Search external sources'}
            type={'search'}
            value={query || ''}
          />
        </SearchContainer>
        <Results>
          <LibrarySearchSection
            key={source.id}
            source={source}
            addToLibrary={this.handleAdd}
            selectSource={() => this.setState({ selectedSource: source.id })}
            query={query}
            rows={25}
            fetching={fetching}
            hasItem={hasItem}
            selected={selected}
            shouldSearch={shouldSearch}
          />
        </Results>
      </Container>
    )
  }

  private handleAdd = (id: string, item: BibliographyItem) => {
    const { source, hasItem } = this.props
    const { fetching, selected } = this.state

    if (hasItem(item)) {
      alert('Already added')
      return
    }

    if (!item.DOI) {
      throw new Error('No DOI available')
    }

    if (!source.fetch) {
      throw new Error('No fetch function defined')
    }

    fetching.add(estimateID(item))
    this.setState({ fetching })
    source
      .fetch(item.DOI, config.support.email)
      .then(this.props.handleAdd)
      .then(() => {
        if (item.DOI) {
          fetching.delete(estimateID(item))
          selected.set(estimateID(item), item)
          this.setState({ fetching, selected })
        }
      })
      .then(() => {
        // TODO: 'adding' state
        console.log('added') // tslint:disable-line:no-console
      })
      .catch((error: Error) => {
        // TODO: 'failed' state
        console.error('failed to add', error) // tslint:disable-line:no-console
      })
  }

  private handleQuery: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const query = event.target.value
    if (query && query !== '') {
      this.setState({ query })
    }
  }
}

export default LibrarySourceContainer
