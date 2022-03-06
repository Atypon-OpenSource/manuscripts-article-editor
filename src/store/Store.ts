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

import { Build, ManuscriptNode } from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Model,
  ManuscriptNote,
  Project,
  Snapshot,
  Tag,
  UserCollaborator,
  UserProfile,
  CommentAnnotation,
} from '@manuscripts/manuscripts-json-schema'

import { BiblioTools } from '../couch-data/Bibilo'
import { TokenData } from '../couch-data/TokenData'
import { buildStateFromSources, StoreDataSourceStrategy } from '.'

export type action = { action?: string; [key: string]: any }
export type state = {
  [key: string]: any
  project: Project
  manuscript: Manuscript
  doc?: ManuscriptNode
  ancestorDoc?: ManuscriptNode
  user?: UserProfile
  tokenData: TokenData
  projectID?: string
  userID?: string | undefined
  userProfileID?: string | undefined
  manuscriptID: string
  containerID?: string
  biblio?: BiblioTools

  getModel: <T extends Model>(id: string) => T | undefined
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  deleteModel: (id: string) => Promise<string>
  modelMap: Map<string, Model>
  snapshotID: string
  snapshots?: Snapshot[]
  comments?: CommentAnnotation[]
  notes?: ManuscriptNote[]
  tag?: Tag[]
  collaborators?: UserCollaborator[]
  collaboratorsProfiles?: Map<string, UserProfile>
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
  beforeAction?(
    action: string,
    payload: any,
    store: state,
    setState: (state: state) => void
  ): void | action
  unmountHandler?(state: state): void
  subscribe(fn: () => void): () => void
  queue: Set<(state: state) => void>
  unmount(): void
  setState(state: state): void
  getState(): state
  dispatchQueue(): void
}

export class GenericStore implements Store {
  reducer
  unmountHandler
  state: state | null
  private sources: StoreDataSourceStrategy[]
  beforeAction?: (
    action: string,
    payload: any,
    store: state,
    setState: (state: state) => void
  ) => void | action
  constructor(
    reducer = defaultReducer,
    unmountHandler?: (state: state) => void
  ) {
    this.reducer = reducer

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
  queue: Set<(state: state) => void> = new Set()
  getState() {
    return this.state
  }
  setState(state: state | ((state: state) => state)) {
    if (typeof state === 'function') {
      this.state = state(this.state)
    } else {
      this.state = { ...this.state, ...state }
    }
    this.dispatchQueue()
  }
  init = async (sources: StoreDataSourceStrategy[]) => {
    this.sources = sources

    const state = await buildStateFromSources(...sources)
    this.setState(state)
    // listening to changes before state applied
    this.beforeAction = (...args) => {
      this.sources.map(
        (source) => source.beforeAction && source.beforeAction(...args)
      )
    }
    this.sources.map(
      (source) => source.updateStore && source.updateStore(this.setState)
    )
    // listening to changes after state applied
    this.sources.map((source) => {
      if (source.afterAction) {
        const unsubscribe = this.subscribe(
          () =>
            source.afterAction && source.afterAction(this.state, this.setState)
        )
      }
    })
  }
  dispatchQueue() {
    this.queue.forEach((fn) => fn(this.state))
  }
  subscribe(fn: (state: state) => void) {
    const queue = this.queue
    queue.add(fn)
    return function unsubscribe() {
      queue.delete(fn)
    }
  }
  dispatchAction({ action = DEFAULT_ACTION, ...payload }) {
    if (this.beforeAction) {
      const beforeActionFilter = this.beforeAction(
        action,
        payload,
        this.state,
        this.setState
      )
      if (beforeActionFilter) {
        this.setState(
          this.reducer(
            beforeActionFilter.payload,
            this.state,
            beforeActionFilter.action || ''
          )
        )
      }
    } else {
      this.setState(this.reducer(payload, this.state, action))
    }
  }
  unmount() {
    if (this.unmountHandler) {
      this.unmountHandler(this.state)
    }
    this.state = {}
    this.queue = new Set()
  }
}
