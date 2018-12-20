import { Build } from '@manuscripts/manuscript-editor'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { manuscriptsBlue } from '../../colors'
import { styled } from '../../theme'
import { Button } from '../Button'
import { CitationSearchResults } from './CitationSearchResults'

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
  color: ${manuscriptsBlue};
`

interface Props {
  query: string | null
  source: {
    id: string
    search: (
      query: string | null,
      params: { rows: number; sort?: string }
    ) => Promise<{ items: BibliographyItem[]; total: number }>
    title: string
  }
  addToSelection: (id: string, item: Build<BibliographyItem>) => void
  selectSource: (id: string) => void
  rows: number
  selected: Map<string, Build<BibliographyItem>>
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
    const { source, addToSelection, selectSource, selected, rows } = this.props

    if (!expanded) {
      return (
        <ResultsSection>
          <SearchSource onClick={() => this.setState({ expanded: true })}>
            {'▶ ' + source.title}
          </SearchSource>
        </ResultsSection>
      )
    }

    return (
      <ResultsSection>
        <SearchSource onClick={() => this.setState({ expanded: false })}>
          {'▼ ' + source.title}
        </SearchSource>

        <CitationSearchResults
          error={error}
          results={results}
          searching={searching}
          addToSelection={addToSelection}
          selected={selected}
        />

        {results &&
          results.total > rows && (
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

    try {
      const results = await source.search(query, { rows })

      if (query === this.props.query) {
        this.setState({
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
}
