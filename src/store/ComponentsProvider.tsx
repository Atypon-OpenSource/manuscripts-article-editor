import React from 'react'
import {
  RxAttachment,
  RxAttachmentCreator,
  RxCollection,
  RxDocument,
} from 'rxdb'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import { atomicUpdate } from '../lib/store'
import timestamp from '../lib/timestamp'
import * as schema from '../schema'
import { isManuscriptComponent } from '../transformer/object-types'
import {
  AnyContainedComponent,
  Attachments,
  ComponentAttachment,
} from '../types/components'
import DataProvider, { DataProviderContext } from './DataProvider'

export interface ComponentIDs {
  projectID: string
  manuscriptID?: string
}

export interface ComponentsProviderContext extends DataProviderContext {
  getComponent: <T extends AnyContainedComponent>(
    id: string
  ) => Promise<(T & Attachments) | null>
  saveComponent: <T extends AnyContainedComponent>(
    component: (T & ComponentAttachment) | Partial<T>,
    ids: ComponentIDs
  ) => Promise<T & Attachments>
  deleteComponent: (id: string) => Promise<string>
  putAttachment: <T extends AnyContainedComponent>(
    id: string,
    attachment: RxAttachmentCreator
  ) => Promise<RxAttachment<T>>
}

export interface ComponentsProps {
  components: ComponentsProviderContext
}

export const ComponentsContext = React.createContext<ComponentsProviderContext | null>(
  null
)

export const withComponents = <T extends {}>(
  Component: React.ComponentType<ComponentsProps>
): React.ComponentType<T> => (props: object) => (
  <ComponentsContext.Consumer>
    {value => (
      <Component {...props} components={value as ComponentsProviderContext} />
    )}
  </ComponentsContext.Consumer>
)

class ComponentsProvider extends DataProvider {
  protected options = {
    name: 'projects',
    schema: schema.projects,
  }

  protected path = 'manuscript_data' // TODO: 'projects' once renamed

  public render() {
    // if (!this.state.replication) {
    //   return <Spinner />
    // }

    if (!this.state.pull.completed) {
      return <Spinner color={'green'} />
    }

    const value = {
      ...this.state,
      sync: this.sync,
      getComponent: this.getComponent,
      saveComponent: this.saveComponent,
      deleteComponent: this.deleteComponent,
      putAttachment: this.putAttachment,
    }

    return (
      <ComponentsContext.Provider value={value}>
        {this.props.children}
      </ComponentsContext.Provider>
    )
  }

  private getCollection = <T extends AnyContainedComponent>() => {
    return this.state.collection as RxCollection<T>
  }

  private getComponent = async <T extends AnyContainedComponent>(
    id: string
  ): Promise<T | null> => {
    const result = await this.getCollection<T>()
      .findOne(id)
      .exec()

    return result ? result.toJSON() : null
  }

  private saveComponent = async <T extends AnyContainedComponent>(
    component: Partial<T>,
    ids: ComponentIDs
  ): Promise<T & Attachments> => {
    const collection = this.getCollection()

    const now = timestamp()

    const prev = await collection.findOne({ id: component.id }).exec()

    if (prev) {
      const result = await atomicUpdate<T>(prev as RxDocument<T>, component)

      return result.toJSON() as T & Attachments
    }

    // TODO: don't add this for shared components or projects
    component.containerID = ids.projectID

    if (isManuscriptComponent(component)) {
      if (!ids.manuscriptID) {
        throw new Error('Manuscript ID needed for ' + component.objectType)
      }

      component.manuscriptID = ids.manuscriptID
    }

    const newComponent: AnyContainedComponent = {
      ...(component as AnyContainedComponent),
      createdAt: now,
      updatedAt: now,
      sessionID,
    }

    const result = await collection.insert(newComponent as T)

    return result.toJSON() as T & Attachments
  }

  // NOTE: marking the document as "deleted" instead of removing it
  // https://github.com/pouchdb/pouchdb/issues/4628#issuecomment-164210176

  private deleteComponent = async (id: string) => {
    const collection = this.state.collection as RxCollection<
      AnyContainedComponent
    >

    const doc = await collection.findOne(id).exec()

    if (!doc) {
      throw new Error('Not found')
    }

    return doc.remove().then(() => doc.id)

    // return doc
    //   .atomicUpdate((doc: ComponentDocument) => {
    //     doc._data._deleted = true
    //   })
    //   .then(doc => {
    //     return doc.id
    //   })
  }

  private putAttachment = async <T extends AnyContainedComponent>(
    id: string,
    attachment: RxAttachmentCreator
  ): Promise<RxAttachment<T>> => {
    const collection = this.state.collection as RxCollection<
      AnyContainedComponent
    >

    const doc = await collection.findOne(id).exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    return doc.putAttachment(attachment) as Promise<RxAttachment<T>>
  }
}

export default ComponentsProvider
