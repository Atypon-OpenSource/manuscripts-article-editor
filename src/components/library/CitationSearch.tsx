import {
  Build,
  buildBibliographyItem,
  crossref,
} from '@manuscripts/manuscript-editor'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { debounce } from 'lodash-es'
import React from 'react'
import { manuscriptsBlue } from '../../colors'
import { styled } from '../../theme'
import { LibraryItem } from './LibraryItem'

const Search = styled.input`
  margin: 4px;
  padding: 8px;
  flex: 1;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 3px;
  -webkit-appearance: none;
`

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`

const SearchSource = styled.div`
  color: ${manuscriptsBlue};
  font-weight: 300;
  font-size: 140%;
  margin-bottom: 8px;
  border-bottom: 1px solid ${manuscriptsBlue};
`

const ResultsSection = styled.div`
  margin: 8px 16px;
`

const Results = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

export interface SearchValues {
  query: string
}

interface Props {
  filterLibraryItems: (query: string) => BibliographyItem[]
  handleSelect: (
    data: BibliographyItem | Build<BibliographyItem>,
    source?: string
  ) => Promise<void>
  query: string
}

interface State {
  error: Error | null
  query: string
  results: BibliographyItem[] | null
  searching: boolean
  searchResults: BibliographyItem[] | null
}

export class CitationSearch extends React.Component<Props, State> {
  private debouncedSearch: () => void

  public constructor(props: Props) {
    super(props)

    this.state = {
      error: null,
      query: props.query || '',
      results: null,
      searching: false,
      searchResults: null,
    }
  }

  public componentDidMount() {
    this.debouncedSearch = debounce(this.runSearch, 1000)

    this.runSearch().catch(error => {
      this.setState({ error })
    })

    this.filterLibrary(this.state.query)
  }

  public render() {
    const { query, results } = this.state

    return (
      <div>
        <SearchContainer>
          <Search
            autoComplete={'off'}
            autoFocus={true}
            onChange={e => this.handleQuery(e.target.value)}
            placeholder={'Search terms…'}
            type={'search'}
            value={query || ''}
          />
        </SearchContainer>

        <Results>
          {this.renderSearchResults()}

          {results &&
            !!results.length && (
              <ResultsSection>
                <SearchSource>Library</SearchSource>

                {results.map(item => (
                  <LibraryItem
                    key={`library-${item.DOI}`}
                    item={item}
                    handleSelect={this.props.handleSelect}
                    hasItem={() => true}
                  />
                ))}
              </ResultsSection>
            )}
        </Results>
      </div>
    )
  }

  private renderSearchResults = () => {
    const { error, searching, searchResults } = this.state

    if (error) {
      return <div>{error.message}</div>
    }

    if (searching) {
      return (
        <ResultsSection>
          <SearchSource>Crossref</SearchSource>
          <div>Searching…</div>
        </ResultsSection>
      )
    }

    if (!searchResults) {
      return null
    }

    if (!searchResults.length) {
      return (
        <ResultsSection>
          <SearchSource>Crossref</SearchSource>
          <div>No results</div>
        </ResultsSection>
      )
    }

    return (
      <ResultsSection>
        <SearchSource>Crossref</SearchSource>
        {searchResults.map(item => (
          <LibraryItem
            key={`crossref-${item.DOI}`}
            item={item}
            handleSelect={this.handleAdd}
            hasItem={this.hasItem}
          />
        ))}
      </ResultsSection>
    )
  }

  private handleAdd = async (data: Partial<BibliographyItem>) => {
    // TODO: pick the exact fields
    if (Array.isArray(data.title)) {
      data.title = data.title[0]
    }

    const item = buildBibliographyItem(data)

    await this.props.handleSelect(item, 'crossref')
  }

  private handleQuery = (query: string) => {
    this.setState({ query })

    this.setState({
      results: null,
      searchResults: null,
    })

    this.filterLibrary(query)

    this.debouncedSearch()
  }

  private filterLibrary = (query: string) => {
    this.setState({
      results: this.props.filterLibraryItems(query),
    })
  }

  private runSearch = async () => {
    const { query } = this.state

    if (!query) {
      this.setState({
        error: null,
        searching: false,
        searchResults: null,
      })

      return
    }

    this.setState({
      searching: true,
    })

    const searchResults = await crossref.search(query, 3)

    if (query === this.state.query) {
      this.setState({
        searching: false,
        searchResults,
      })
    }
  }

  private hasItem = (item: BibliographyItem) => {
    return false // TODO
  }
}
