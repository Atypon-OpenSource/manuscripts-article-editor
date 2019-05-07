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

import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import config from '../../config'
import { estimateID } from '../../lib/library'
import { LibrarySource } from '../../lib/sources'
import { styled } from '../../theme/styled-components'
import { SearchResults } from './SearchResults'

const ResultsSection = styled.div`
  margin: 8px 16px;
`

interface Props {
  query: string | null
  source: LibrarySource
  addToLibrary: (id: string, item: Build<BibliographyItem>) => void
  selectSource: (id: string) => void
  fetching: Set<string>
  selected: Map<string, Build<BibliographyItem>>
  rows: number
  hasItem: (item: BibliographyItem) => boolean
  shouldSearch: boolean
}

interface State {
  error: string | null
  results: {
    items: Array<Build<BibliographyItem>>
    total: number
  } | null
  searching: boolean
}

export class LibrarySearchSection extends React.Component<Props, State> {
  public state: Readonly<State> = {
    error: null,
    results: null,
    searching: false,
  }

  private searchTimeout: number

  public async componentDidMount() {
    const { query, rows, hasItem, selected } = this.props
    await this.runSearch(query || '', rows, hasItem, selected)
  }

  public async componentWillReceiveProps(nextProps: Props) {
    const { query, rows, hasItem, selected } = nextProps

    if (query !== this.props.query || rows !== this.props.rows) {
      await this.runSearch(query || '', rows, hasItem, selected)
    }
  }

  public render() {
    const { error, results, searching } = this.state
    const { addToLibrary, selected, fetching } = this.props

    return (
      <ResultsSection>
        <SearchResults
          error={error}
          results={results}
          searching={searching}
          addToSelection={addToLibrary}
          selected={selected}
          fetching={fetching}
          whiteSpace={'normal'}
        />
      </ResultsSection>
    )
  }

  private runSearch = async (
    query: string,
    rows: number,
    hasItem: (item: BibliographyItem) => boolean,
    selected: Map<string, Build<BibliographyItem>>
  ) => {
    if (!query || query === '') {
      this.setState({
        error: null,
        searching: false,
        results: {
          items: [],
          total: 0,
        },
      })
      return
    }

    this.setState({
      error: null,
      results: null,
      searching: true,
    })

    const { source } = this.props

    const searchHandler = async () => {
      if (!source.search) {
        return
      }

      try {
        const results = await source.search(query, rows, config.support.email)

        results &&
          results.items &&
          results.items.forEach(item => {
            if (hasItem(item as BibliographyItem)) {
              selected.set(estimateID(item), item)
            }
          })

        if (query === this.props.query) {
          this.setState({
            error: null,
            searching: false,
            results,
          })
        }
      } catch (error) {
        this.setState({
          error: error.message,
          searching: false,
        })
      }
    }

    if (source.id === 'library') {
      await searchHandler()
    } else {
      if (this.searchTimeout) {
        window.clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = window.setTimeout(searchHandler, 500)
    }
  }
}
