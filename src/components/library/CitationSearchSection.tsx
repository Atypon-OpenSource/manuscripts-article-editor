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

import ArrowDownBlack from '@manuscripts/assets/react/ArrowDownBlack'
import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { Button } from '@manuscripts/style-guide'
import React from 'react'
import config from '../../config'
import { styled } from '../../theme/styled-components'
import { SearchResults } from './SearchResults'

const ResultsSection = styled.div`
  margin: 8px 16px;
`

const SearchSource = styled.div`
  margin-bottom: 8px;
  color: #777;
  cursor: pointer;

  &:hover {
    color: #777;
  }
`

const MoreButton = styled(Button)`
  font-size: inherit;
  text-transform: none;
  text-decoration: underline;
  margin-left: 28px;
  color: ${props => props.theme.colors.citationSearch.more};
`

const DropdownChevron = styled(ArrowDownBlack)<{ expanded?: boolean }>`
  margin-right: 16px;
  ${props => !props.expanded && 'transform:rotate(-90deg)'};
  width: 24px;
`

interface Props {
  query: string | null
  source: {
    id: string
    search: (
      query: string | null,
      params: { rows: number; sort?: string },
      mailto: string
    ) => Promise<{ items: BibliographyItem[]; total: number }>
    title: string
  }
  addToSelection: (id: string, item: Build<BibliographyItem>) => void
  selectSource: (id: string) => void
  rows: number
  selected: Map<string, Build<BibliographyItem>>
  fetching: Set<string>
}

interface State {
  error: string | null
  expanded: boolean
  results: {
    items: Array<Build<BibliographyItem>>
    total: number
  } | null
  searching: boolean
}

export class CitationSearchSection extends React.Component<Props, State> {
  public state: Readonly<State> = {
    error: null,
    expanded: true,
    results: null,
    searching: false,
  }

  private searchTimeout: number

  public async componentDidMount() {
    const { query, rows } = this.props

    await this.runSearch(query, rows)
  }

  public async componentWillReceiveProps(nextProps: Props) {
    const { query, rows } = nextProps

    if (query !== this.props.query || rows !== this.props.rows) {
      await this.runSearch(query, rows)
    }
  }

  public render() {
    const { error, expanded, results, searching } = this.state
    const {
      source,
      addToSelection,
      selectSource,
      selected,
      fetching,
      rows,
    } = this.props

    if (!expanded) {
      return (
        <ResultsSection>
          <SearchSource onClick={() => this.setState({ expanded: true })}>
            <DropdownChevron />
            {source.title}
          </SearchSource>
        </ResultsSection>
      )
    }

    return (
      <ResultsSection>
        <SearchSource onClick={() => this.setState({ expanded: false })}>
          <DropdownChevron expanded={true} />
          {source.title}
        </SearchSource>

        <SearchResults
          error={error}
          results={results}
          searching={searching}
          addToSelection={addToSelection}
          selected={selected}
          fetching={fetching}
        />

        {results && results.total > rows && (
          <MoreButton
            onClick={() => selectSource(source.id)}
            data-cy={'more-button'}
          >
            Show more
          </MoreButton>
        )}
      </ResultsSection>
    )
  }

  private runSearch = async (query: string | null, rows: number) => {
    if (!this.state.expanded) {
      return
    }

    this.setState({
      error: null,
      results: null,
      searching: true,
    })

    const { source } = this.props

    const searchHandler = async () => {
      try {
        const results = await source.search(
          query,
          { rows },
          config.support.email
        )

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
