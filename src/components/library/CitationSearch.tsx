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
import { crossref } from '@manuscripts/manuscript-editor'
import { Build, buildBibliographyItem } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Button, PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import config from '../../config'
import { styled } from '../../theme/styled-components'
import { CitationSearchSection } from './CitationSearchSection'

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

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`

const Results = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
`

const Container = styled.div`
  font-family: ${props => props.theme.fontFamily};
  flex: 1;
`

export interface SearchValues {
  query: string
}

interface Props {
  filterLibraryItems: (query: string | null) => BibliographyItem[]
  handleCite: (
    items: Array<BibliographyItem | Build<BibliographyItem>>,
    query?: string
  ) => Promise<void>
  query: string
  handleCancel: () => void
  scheduleUpdate: () => void
}

interface State {
  selectedSource: string | null
  query: string
  selected: Map<string, Build<BibliographyItem>>
  fetching: Set<string>
}

export class CitationSearch extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      selectedSource: null,
      query: props.query || '',
      selected: new Map(),
      fetching: new Set(),
    }
  }

  public render() {
    const { query, fetching, selected, selectedSource } = this.state
    const sources = this.buildSources()

    return (
      <Container>
        <SearchContainer>
          <SearchIcon />

          <Search
            autoComplete={'off'}
            autoFocus={true}
            onChange={this.handleQuery}
            placeholder={'Search'}
            type={'search'}
            value={query || ''}
          />
        </SearchContainer>

        <Results>
          {sources
            .filter(source => source.always || query)
            .map(source => (
              <CitationSearchSection
                key={source.id}
                source={source}
                addToSelection={this.addToSelection}
                selectSource={() =>
                  this.setState({ selectedSource: source.id })
                }
                selected={selected}
                fetching={fetching}
                query={query}
                rows={selectedSource === source.id ? 25 : 3}
              />
            ))}
        </Results>

        <Actions>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
          <PrimaryButton
            onClick={this.handleCite}
            disabled={selected.size === 0}
          >
            Cite
          </PrimaryButton>
        </Actions>
      </Container>
    )
  }

  private buildSources = () => {
    return [
      {
        id: 'library',
        title: 'Library',
        search: this.filterLibraryItems,
        always: true,
      },
      {
        id: 'crossref',
        title: 'External sources',
        search: async (
          query: string | null,
          params: { rows: number; sort?: string }
        ) =>
          query
            ? crossref.search(query, params.rows, config.support.email)
            : {
                items: [],
                total: 0,
              },
      },
      // {
      //   id: 'datacite',
      //   title: 'DataCite',
      //   search: async (
      //     query: string | null,
      //     params: { rows: number; sort?: string }
      //   ) =>
      //     query
      //       ? datacite.search(query, params.rows)
      //       : {
      //           items: [],
      //           total: 0,
      //         },
      // },
    ]
  }

  private addToSelection = async (
    id: string,
    data: Build<BibliographyItem>
  ) => {
    const { selected, fetching } = this.state

    if (selected.has(id)) {
      selected.delete(id) // remove item
    } else if (data._id) {
      selected.set(id, data) // re-use existing data model
    } else {
      const { DOI } = data

      if (!DOI) {
        throw new Error('No DOI')
      }

      fetching.add(DOI)
      this.setState({ fetching })

      // fetch Citeproc JSON
      const result = await crossref.fetch(DOI, config.support.email)

      // remove DOI URLs
      if (result.URL && result.URL.match(/^https?:\/\/(dx\.)?doi\.org\//)) {
        delete result.URL
      }

      selected.set(id, buildBibliographyItem(result))

      fetching.delete(DOI)
      this.setState({ fetching })
    }

    this.setState({ selected })
  }

  private handleCite = async () => {
    const items = Array.from(this.state.selected.values())

    await this.props.handleCite(items)
  }

  private handleQuery: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const query = event.target.value

    this.setState({ query }, this.props.scheduleUpdate)
  }

  private filterLibraryItems = async (
    query: string | null,
    params: { rows: number; sort?: string }
  ) => {
    const items = this.props.filterLibraryItems(query)

    return {
      items: items.slice(0, params.rows - 1),
      total: items.length,
    }
  }
}
