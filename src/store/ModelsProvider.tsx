import {
  Build,
  ContainedModel,
  ContainedProps,
  isManuscriptModel,
  timestamp,
} from '@manuscripts/manuscript-editor'
import { Model } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import {
  RxAttachment,
  RxAttachmentCreator,
  RxCollection,
  RxCollectionCreator,
} from 'rxdb'
import config from '../config'
import Spinner from '../icons/spinner'
import sessionID from '../lib/sessionID'
import { atomicUpdate } from '../lib/store'
import * as schema from '../schema'
import DataProvider, { DataProviderContext } from './DataProvider'

export interface ModelIDs {
  projectID: string
  manuscriptID?: string
}

export interface ModelsProviderContext extends DataProviderContext {
  getModel: <T extends Model>(id: string) => Promise<T | null>
  saveModel: <T extends Model>(model: Build<T>, ids: ModelIDs) => Promise<T>
  deleteModel: (id: string) => Promise<string>
  putAttachment: <T extends Model & ContainedProps>(
    id: string,
    attachment: RxAttachmentCreator
  ) => Promise<RxAttachment<T>>
}

export interface ModelsProps {
  models: ModelsProviderContext
}

export const ModelsContext = React.createContext<ModelsProviderContext | null>(
  null
)

export const withModels = <T extends {}>(
  Component: React.ComponentType<ModelsProps>
): React.ComponentType<T> => (props: object) => (
  <ModelsContext.Consumer>
    {value => <Component {...props} models={value as ModelsProviderContext} />}
  </ModelsContext.Consumer>
)

class ModelsProvider extends DataProvider {
  protected options: RxCollectionCreator = {
    name: 'projects',
    schema: schema.projects,
    migrationStrategies: {
      // tslint:disable-next-line:no-any
      1: (doc: any) => {
        doc._id = doc.id
        delete doc.id
        return doc
      },
    },
  }

  protected path = config.buckets.projects

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
      getModel: this.getModel,
      saveModel: this.saveModel,
      deleteModel: this.deleteModel,
      putAttachment: this.putAttachment,
    }

    return (
      <ModelsContext.Provider value={value}>
        {this.props.children}
      </ModelsContext.Provider>
    )
  }

  private getCollection = <T extends Model>() => {
    return this.state.collection as RxCollection<T>
  }

  private getModel = async <T extends Model>(id: string): Promise<T | null> => {
    const result = await this.getCollection<T>()
      .findOne(id)
      .exec()

    return result ? result.toJSON() : null
  }

  private saveModel = async <T extends Model>(
    model: Build<T>,
    ids: ModelIDs
  ): Promise<T> => {
    const collection = this.getCollection<T>()

    const now = timestamp()

    const prev = await collection.findOne(model._id).exec()

    if (prev) {
      const result = await atomicUpdate<T>(prev, model as Partial<T>)

      return result.toJSON()
    }

    const containedModel = model as T & ContainedProps

    // TODO: don't add this for shared components or projects
    containedModel.containerID = ids.projectID

    if (isManuscriptModel(containedModel)) {
      if (!ids.manuscriptID) {
        throw new Error('Manuscript ID needed for ' + model.objectType)
      }

      containedModel.manuscriptID = ids.manuscriptID
    }

    const newModel = {
      ...(containedModel as ContainedModel),
      createdAt: now,
      updatedAt: now,
      sessionID,
    }

    const result = await collection.insert(newModel as T & ContainedProps)

    return result.toJSON()
  }

  // NOTE: marking the document as "deleted" instead of removing it
  // https://github.com/pouchdb/pouchdb/issues/4628#issuecomment-164210176

  private deleteModel = async (id: string) => {
    const collection = this.state.collection as RxCollection<ContainedModel>

    const doc = await collection.findOne(id).exec()

    if (!doc) {
      throw new Error('Not found')
    }

    return doc.remove().then(() => doc._id)

    // return doc
    //   .atomicUpdate((doc: ComponentDocument) => {
    //     doc._data._deleted = true
    //   })
    //   .then(doc => {
    //     return doc._id
    //   })
  }

  private putAttachment = async <T extends ContainedModel>(
    id: string,
    attachment: RxAttachmentCreator
  ) => {
    const collection = this.state.collection as RxCollection<T>

    const doc = await collection.findOne(id).exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    return doc.putAttachment(attachment)
  }
}

export default ModelsProvider
