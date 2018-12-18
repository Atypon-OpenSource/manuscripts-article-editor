import { buildBibliographyItem } from '@manuscripts/manuscript-editor'
import {
  BibliographyItem,
  ObjectTypes,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import { sources } from '../../lib/sources'
import { ModelsProps, withModels } from '../../store/ModelsProvider'

import { Page } from '../Page'
import LibraryContainer from './LibraryContainer'
import LibrarySidebar from './LibrarySidebar'
import LibrarySourceContainer from './LibrarySourceContainer'

interface State {
  item: BibliographyItem | null
  items: BibliographyItem[] | null
  library: Map<string, BibliographyItem>
  query: string | null
  source: string
  project: Project | null
}

interface RouteParams {
  projectID: string
}

type Props = RouteComponentProps<RouteParams> & ModelsProps

class LibraryPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    item: null,
    items: null,
    library: new Map(),
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
        <LibrarySidebar projectID={project._id} sources={sources} />

        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            projectID={project._id}
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
          objectType: ObjectTypes.BibliographyItem,
          containerID: projectID,
        })
        .sort({
          updatedAt: 'desc',
        })
        .$.subscribe((docs: Array<RxDocument<BibliographyItem>>) => {
          const library = new Map()

          docs.forEach(doc => {
            library.set(doc._id, doc.toJSON())
          })

          this.setState({ library })
        })
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
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

    await this.props.models.saveModel(item, {
      projectID,
    })
  }

  private handleSave = (item: BibliographyItem) => {
    const { projectID } = this.props.match.params

    return this.props.models.saveModel<BibliographyItem>(item, {
      projectID,
    })
  }

  private handleDelete = async (item: BibliographyItem): Promise<string> => {
    await this.props.models.deleteModel(item._id)

    this.setState({
      item: null,
    })

    return item._id
  }

  // TODO: move this to source definition
  private hasItem = (item: BibliographyItem): boolean => {
    const items = Array.from(this.state.library.values())

    return items.some(
      (libraryItem: RxDocument<BibliographyItem>) =>
        libraryItem.DOI === item.DOI
    )
  }
}

export default withModels(LibraryPageContainer)
