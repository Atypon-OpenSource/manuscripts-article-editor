import {
  BibliographyItem,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (
    data: Map<string, BibliographyItem>,
    collection: Collection<BibliographyItem>
  ) => React.ReactNode
  projectID: string
}

interface State {
  data?: Map<string, BibliographyItem>
}

class ProjectLibraryData extends DataComponent<BibliographyItem, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<BibliographyItem>(
      `project-${props.projectID}`
    )
  }

  public componentDidMount() {
    const { projectID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe(projectID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { projectID } = nextProps

    if (projectID !== this.props.projectID) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      this.collection.addEventListener('complete', this.handleComplete)

      this.collection = CollectionManager.getCollection<BibliographyItem>(
        `project-${projectID}`
      )

      this.collection.removeEventListener('complete', this.handleComplete)

      this.sub = this.subscribe(projectID)
    }
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)

    this.sub.unsubscribe()
  }

  private subscribe = (containerID: string) =>
    this.collection
      .find({
        containerID,
        objectType: ObjectTypes.BibliographyItem,
      })
      .$.subscribe(docs => {
        if (docs) {
          const data: Map<string, BibliographyItem> = new Map()

          for (const doc of docs) {
            data.set(doc._id, doc.toJSON())
          }

          this.setState({ data })
        }
      })
}

export default ProjectLibraryData
