import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Page } from '../components/Page'
import { buildBibliographyItem } from '../lib/commands'
import { sources } from '../lib/sources'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { BIBLIOGRAPHY_ITEM } from '../transformer/object-types'
import { BibliographyItem, ComponentCollection } from '../types/components'
import { LibraryDocument } from '../types/library'
import LibraryContainer from './LibraryContainer'
import LibrarySidebar from './LibrarySidebar'
import LibrarySourceContainer from './LibrarySourceContainer'

interface State {
  item: BibliographyItem | null
  items: BibliographyItem[] | null
  library: LibraryDocument[]
  query: string | null
  source: string
}

interface RouteParams {
  projectID: string
}

type Props = RouteComponentProps<RouteParams> & ComponentsProps

class LibraryPageContainer extends React.Component<Props, State> {
  public state = {
    item: null,
    items: null,
    library: [],
    query: null,
    source: 'library',
  }

  public componentDidMount() {
    this.setSource(this.props)

    this.getCollection()
      .find({
        objectType: BIBLIOGRAPHY_ITEM,
      })
      .sort({
        updatedAt: 'desc',
      })
      .$.subscribe((library: LibraryDocument[]) => {
        this.setState({ library })
      })
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setSource(nextProps)
  }

  public render() {
    const { projectID } = this.props.match.params
    const { library, source } = this.state

    if (!source) return null

    const librarySource = sources.find(item => item.id === source)

    if (!librarySource) return null

    return (
      <Page projectID={projectID}>
        <LibrarySidebar projectID={projectID} sources={sources} />

        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            projectID={projectID}
          />
        ) : (
          <LibrarySourceContainer
            library={library}
            source={librarySource}
            handleAdd={this.handleAdd}
            hasItem={this.hasItem}
          />
        )}
      </Page>
    )
  }

  private getCollection() {
    return this.props.components.collection as ComponentCollection
  }

  private setSource(props: Props) {
    const location = props.location
    const query = qs.parse(location.search.substr(1))
    this.setState({
      source: query.source || 'library',
    })
  }

  private handleAdd = async (data: Partial<BibliographyItem>) => {
    const { projectID } = this.props.match.params

    const item = buildBibliographyItem(data)

    await this.props.components.saveComponent(item, {
      projectID,
    })
  }

  private handleSave = (item: BibliographyItem) => {
    const { projectID } = this.props.match.params

    return this.props.components.saveComponent<BibliographyItem>(item, {
      projectID,
    })
  }

  private handleDelete = async (item: BibliographyItem) => {
    await this.props.components.deleteComponent(item.id)

    this.setState({
      item: null,
    })

    return item.id
  }

  // TODO: move this to source definition
  private hasItem = (item: BibliographyItem): boolean => {
    return this.state.library.some(
      (libraryItem: LibraryDocument) => libraryItem.get('DOI') === item.DOI
    )
  }
}

export default withComponents(LibraryPageContainer)
