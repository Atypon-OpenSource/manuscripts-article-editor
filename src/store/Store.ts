/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import {
  CommentKey,
  FileAttachment,
  FileManagement,
  Inconsistency,
} from '@manuscripts/body-editor'
import { Project, UserProfile } from '@manuscripts/json-schema'
import { TrackChangesState } from '@manuscripts/track-changes-plugin'
import {
  ManuscriptEditorView,
  ManuscriptNode,
  ManuscriptNodeType,
  SectionCategory,
} from '@manuscripts/transform'

import { PluginInspectorTab } from '../components/projects/Inspector'
import { useCreateEditor } from '../hooks/use-create-editor'
import { InspectorAction } from '../hooks/use-inspector-tabs-context'
import { ManuscriptSnapshot, SnapshotLabel } from '../lib/doc'
import { ProjectRole } from '../lib/roles'
import { buildStateFromSources, StoreDataSourceStrategy } from '.'

export type action = { action?: string; [key: string]: any }

export type PMEditor = ReturnType<typeof useCreateEditor>

// @NOTE: some of the state properties may be consumed by parent app and may appear unused
export type state = {
  manuscriptID: string
  projectID: string
  userID?: string

  project: Project
  refreshProject: () => Promise<void>
  user: UserProfile // probably should be optional

  editor: PMEditor
  doc: ManuscriptNode
  initialDocVersion: number
  trackState?: TrackChangesState
  isViewingMode?: boolean
  isComparingMode?: boolean
  view?: ManuscriptEditorView
  titleText: string

  fileManagement: FileManagement
  files: FileAttachment[]
  collaborators: Map<string, UserProfile>
  collaboratorsById: Map<string, UserProfile>

  snapshots: SnapshotLabel[]
  createSnapshot: (name: string) => Promise<void>
  getSnapshot: (id: string) => Promise<ManuscriptSnapshot | undefined>

  permittedActions: string[]

  selectedCommentKey?: CommentKey
  newCommentID?: string

  selectedSuggestionID?: string
  selectedAttrsChange?: string

  savingProcess?: 'saved' | 'saving' | 'offline' | 'failed'
  preventUnload?: boolean
  beforeUnload?: () => void
  userRole: ProjectRole | null

  handleSnapshot: (name: string) => Promise<void>

  cslLocale?: string
  cslStyle?: string
  hasPendingSuggestions?: boolean
  inconsistencies?: Inconsistency[]
  sectionCategories: Map<string, SectionCategory>
  originalPmDoc?: JSON
  inspectorOpenTabs?: { primaryTab: number | null; secondaryTab: number | null }
  doInspectorTab?: (action: InspectorAction) => void
  hiddenNodeTypes?: ManuscriptNodeType[]

  pluginInspectorTab?: PluginInspectorTab // an inspector tab injected (plugged in) from the parent app
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
    this.setState({
      ...this.state,
      ...(state as state),
      isViewingMode: false,
      isComparingMode: false,
    })
    // listening to changes before state applied
    this.beforeAction = (action, payload, store, setState) => {
      // provide a way for the data sources to cancel the action optionally
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
