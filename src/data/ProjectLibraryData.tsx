import {
  BibliographyItem,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs'
import { Spinner } from '../components/Spinner'
import { ModelsProps, withModels } from '../store/ModelsProvider'

interface Props {
  children: (items: Map<string, BibliographyItem>) => React.ReactNode
  projectID: string
}

interface State {
  items?: Map<string, BibliographyItem>
}

class ProjectLibraryData extends React.Component<ModelsProps & Props, State> {
  public state: Readonly<State> = {}

  private sub: Subscription

  public componentDidMount() {
    const { projectID } = this.props

    this.sub = this.loadItems(projectID)
  }

  public componentWillReceiveProps(nextProps: Props & ModelsProps) {
    const { projectID } = nextProps

    if (projectID !== this.props.projectID) {
      this.sub.unsubscribe()
      this.setState({ items: undefined })
      this.sub = this.loadItems(projectID)
    }
  }

  public componentWillUnmount() {
    this.sub.unsubscribe()
  }

  public render() {
    const { items } = this.state

    if (!items) {
      return <Spinner />
    }

    return this.props.children(items)
  }

  private loadItems = (containerID: string) => {
    const collection = this.props.models.collection as RxCollection<
      BibliographyItem
    >

    return collection
      .find({
        containerID,
        objectType: ObjectTypes.BibliographyItem,
      })
      .$.subscribe(docs => {
        if (docs) {
          const items: Map<string, BibliographyItem> = new Map()

          for (const doc of docs) {
            items.set(doc._id, doc.toJSON())
          }

          this.setState({ items })
        }
      })
  }
}

export default withModels<Props>(ProjectLibraryData)
