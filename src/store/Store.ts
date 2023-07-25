/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  BibliographyItem,
  CommentAnnotation,
  ContainerInvitation,
  Library,
  LibraryCollection,
  Manuscript,
  ManuscriptNote,
  ManuscriptTemplate,
  Model,
  Project,
  ProjectInvitation,
  Tag,
  UserProfile,
} from '@manuscripts/json-schema'
import { FileAttachment, FileManagement } from '@manuscripts/style-guide'
import {
  Attachment,
  Build,
  ContainedModel,
  ManuscriptModel,
  ManuscriptNode,
  ModelAttachment,
} from '@manuscripts/transform'

import { ProjectRole } from '../lib/roles'
import { buildStateFromSources, StoreDataSourceStrategy } from '.'
import { BiblioTools } from './BiblioTools'
import { TokenData } from './TokenData'

export interface TokenActions {
  delete: () => void
  update: (token: string) => void
}

export type action = { action?: string; [key: string]: any }
export type ImportError = { error: boolean; message: string }
export type ImportOk = { ok: boolean }
export type bulkCreate = <T>(
  models: Array<Build<T> & ContainerIDs & ModelAttachment>
) => Promise<Array<ImportError | ImportOk>>
export interface ContainerIDs {
  containerID?: string
  manuscriptID?: string
  templateID?: string
}

export interface ContainedIDs {
  containerID: string
  manuscriptID?: string
}

export type state = {
  [key: string]: any
  project: Project
  manuscript: Manuscript
  manuscripts?: Manuscript[]
  doc: ManuscriptNode
  ancestorDoc: ManuscriptNode
  user: UserProfile // probably should be optional
  userRole: ProjectRole
  tokenData: TokenData
  projectID: string
  fileManagement: FileManagement
  userID?: string | undefined
  userProfileID?: string | undefined
  manuscriptID: string
  containerID: string // @TODO it's the same as projectID - has to be cleaned up
  invitations?: ContainerInvitation[]
  projectInvitations?: ProjectInvitation[]
  containerInvitations?: ContainerInvitation[]
  projects: Project[]
  modelMap: Map<string, Model>
  snapshotID: string | null
  handleSnapshot?: () => Promise<void>
  comments?: CommentAnnotation[]
  newComments: Map<string, CommentAnnotation>
  notes?: ManuscriptNote[]
  tags?: Tag[]
  collaborators?: Map<string, UserProfile>
  collaboratorsProfiles?: Map<string, UserProfile>
  collaboratorsById?: Map<string, UserProfile>
  attachments: FileAttachment[]
  permittedActions: string[]
  getModel: <T extends Model>(id: string) => T | undefined
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  deleteModel: (id: string) => Promise<string>
  bulkUpdate: (items: Array<ContainedModel>) => Promise<void>
  deleteProject: (projectID: string) => Promise<string>
  updateProject: (projectID: string, data: Partial<Project>) => Promise<Project>

  // track changes doc state changes
  saveTrackModel: <T extends Model>(
    model: T | Build<T> | Partial<T>
  ) => Promise<T>
  getTrackModel: <T extends Model>(id: string) => T | undefined
  trackModelMap: Map<string, Model>
  deleteTrackModel: (id: string) => Promise<string>

  savingProcess?: 'saved' | 'saving' | 'offline' | 'failed'
  saveNewManuscript: (
    dependencies: Array<Build<ContainedModel> & ContainedIDs>,
    containerID: string,
    manuscript: Build<Manuscript>,
    newProject?: Build<Project>
  ) => Promise<Build<Manuscript>>
  updateManuscriptTemplate?: (
    dependencies: Array<Build<ContainedModel> & ContainedIDs>,
    containerID: string,
    manuscript: Manuscript,
    updatedModels: ManuscriptModel[]
  ) => Promise<Manuscript>
  getInvitation?: (
    invitingUserID: string,
    invitedEmail: string
  ) => Promise<ContainerInvitation>
  getAttachment?: (
    id: string,
    attachmentID: string
  ) => Promise<Blob | undefined>
  putAttachment?: (id: string, attachment: Attachment) => Promise<void>
  getUserTemplates?: () => Promise<{
    userTemplates: ManuscriptTemplate[]
    userTemplateModels: ManuscriptModel[]
  }>
  createUser: (profile: Build<UserProfile>) => Promise<void>
  updateBiblioItem: (item: BibliographyItem) => Promise<any>
  deleteBiblioItem: (item: BibliographyItem) => Promise<any>
  biblio: BiblioTools
  createProjectLibraryCollection: (
    collection: Build<LibraryCollection>,
    projectID: string
  ) => Promise<void>
  saveBiblioItem: (
    item: Build<BibliographyItem>,
    projectID: string
  ) => Promise<BibliographyItem>
  projectLibraryCollections: Map<string, LibraryCollection>
  globalLibraries?: Map<string, Library> // From the user
  globalLibraryCollections?: Map<string, LibraryCollection> // From the user
  globalLibraryItems?: Map<string, BibliographyItem> // From the user
  library: Map<string, BibliographyItem>
}
export type reducer = (payload: any, store: state, action?: string) => state
export type dispatch = (action: action) => void

const DEFAULT_ACTION = '_' // making actions optional

const defaultReducer = (payload: any, store: state, action?: string) => {
  return { ...store, ...payload }
}

export interface Store {
  state: state | null
  dispatchAction(action: action): void
  reducer?: reducer
  beforeAction(
    action: string,
    payload: any,
    store: state,
    setState: (state: state) => void
  ): void | action
  unmountHandler?(state: state): void
  subscribe(fn: () => void): () => void
  queue: Set<(state: state, prev?: state) => void>
  unmount(): void
  setState(state: state): void
  getState(): state
  dispatchQueue(prev: state | null): void
}

export class GenericStore implements Store {
  reducer
  unmountHandler
  state: state | null
  private sources: StoreDataSourceStrategy[]
  beforeAction: (
    action: string,
    payload: any,
    store: state,
    setState: (state: state) => void
  ) => void | action
  constructor(
    reducer = defaultReducer,
    unmountHandler?: (state: state) => void,
    state = {}
  ) {
    this.reducer = reducer

    if (state) {
      this.state = state as state
    }

    if (unmountHandler) {
      this.unmountHandler = unmountHandler
    }
    this.dispatchQueue = this.dispatchQueue.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.dispatchAction = this.dispatchAction.bind(this)
    this.setState = this.setState.bind(this)
    this.getState = this.getState.bind(this)

    // this.state = buildStateFromSources(source)
  }
  queue: Set<(state: state, prev: state) => void> = new Set()
  getState() {
    return this.state!
  }
  setState(state: state | ((state: state) => state)) {
    const prevState = { ...this.state! }
    if (typeof state === 'function') {
      this.state = state(this.state!)
    } else {
      this.state = { ...this.state, ...state }
    }
    this.dispatchQueue(prevState)
  }
  init = async (sources: StoreDataSourceStrategy[]) => {
    this.sources = sources

    const state = await buildStateFromSources(sources, this.setState)
    this.setState({ ...this.state, ...(state as state) })
    // listening to changes before state applied
    this.beforeAction = (action, payload, store, setState) => {
      // @TODO provide the chance for the data sources to cancel the action optionally
      // by default the actions are not supposed to be cancelled
      this.sources.map(
        (source) =>
          source.beforeAction &&
          source.beforeAction(action, payload, store, setState)
      )
      return { action, payload }
    }
    this.sources.forEach(
      // update store is needed to pass setState function to a registered DataSource strategy. The naming is not very forunate
      // if you are looking for a way to listen to the data changes in the store from inside data source, use beforeAction
      (source) => source.updateStore && source.updateStore(this.setState)
    )
    // listening to changes after state applied
    this.sources.map((source) => {
      if (source.afterAction) {
        this.subscribe(
          (state, prevState) =>
            source.afterAction &&
            source.afterAction(state!, prevState, this.setState)
        )
      }
    })
  }
  dispatchQueue(prevState: state) {
    this.queue.forEach((fn) => fn(this.state!, prevState))
  }
  subscribe(fn: (state: state, prev: state) => void) {
    const queue = this.queue
    queue.add(fn)
    return function unsubscribe() {
      queue.delete(fn)
    }
  }
  dispatchAction({ action = DEFAULT_ACTION, ...payload }) {
    const beforeActionFilter = this.beforeAction(
      action,
      payload,
      this.state!,
      this.setState
    )
    if (beforeActionFilter) {
      this.setState(
        this.reducer(
          beforeActionFilter.payload,
          this.state!,
          beforeActionFilter.action || ''
        )
      )
    }
    // return new Promise((resolve: () => void, reject) => {
    //   setTimeout(() => {
    //     resolve()
    //   }, 5000)
    // })
  }
  unmount() {
    if (this.unmountHandler) {
      this.unmountHandler(this.state!)
    }
    if (this.sources) {
      this.sources.forEach((source) => source.unmount && source.unmount())
    }
    this.sources = []
    this.state = {} as state
    this.queue = new Set()
  }
}
