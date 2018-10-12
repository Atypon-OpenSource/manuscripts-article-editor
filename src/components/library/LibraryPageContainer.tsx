import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { buildBibliographyItem } from '../../lib/commands'
import { sources } from '../../lib/sources'
import { ComponentsProps, withComponents } from '../../store/ComponentsProvider'
import { BIBLIOGRAPHY_ITEM } from '../../transformer/object-types'
import { BibliographyItem, Project } from '../../types/components'
import { LibraryDocument } from '../../types/library'
import { Page } from '../Page'
import LibraryContainer from './LibraryContainer'
import LibrarySidebar from './LibrarySidebar'
import LibrarySourceContainer from './LibrarySourceContainer'

interface State {
  item: BibliographyItem | null
  items: BibliographyItem[] | null
  library: LibraryDocument[]
  query: string | null
  source: string
  project: Project | null
}

interface RouteParams {
  projectID: string
}

type Props = RouteComponentProps<RouteParams> & ComponentsProps

class LibraryPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    item: null,
    items: null,
    library: [],
    query: null,
    source: 'library',
    project: null,
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    this.prepare(this.props)
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.prepare(nextProps)
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { library, project, source } = this.state

    if (!source || !project) return null

    const librarySource = sources.find(item => item.id === source)

    if (!librarySource) return null

    return (
      <Page project={project}>
        <LibrarySidebar projectID={project.id} sources={sources} />

        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            projectID={project.id}
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

  private prepare = (props: Props) => {
    this.setSource(props)

    const { projectID } = props.match.params

    this.subs.push(
      this.getCollection()
        .findOne(projectID)
        .$.subscribe((doc: RxDocument<Project> | null) => {
          if (doc) {
            this.setState({
              project: doc.toJSON(),
            })
          }
        })
    )

    this.subs.push(
      this.getCollection()
        .find({
          objectType: BIBLIOGRAPHY_ITEM,
          containerID: projectID,
        })
        .sort({
          updatedAt: 'desc',
        })
        .$.subscribe((library: Array<RxDocument<BibliographyItem>>) => {
          this.setState({ library })
        })
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
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
