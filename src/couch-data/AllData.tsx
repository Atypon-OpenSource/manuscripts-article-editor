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
  Manuscript,
  ObjectTypes,
  Tag,
  UserCollaborator,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RxDocument, RxDatabase } from '@manuscripts/rxdb'

import { buildUser } from '../lib/data'
import CollectionManager from '../sync/CollectionManager'
import { databaseCreator } from '../lib/db'
import { TokenData } from './TokenData'
import { Subscription } from 'rxjs'

interface Props {
  children: (data: Manuscript) => React.ReactNode
  manuscriptID: string
  projectID: string
  userID: string
}

interface State {
  [key: string]: any
}

class RxDBDataBridge {
  listeners = new Set<(data: State) => void>()
  state: State
  tokenData: TokenData
  projectID: string
  userID: string | undefined
  userProfileID: string | undefined
  manuscriptID: string
  db: RxDatabase<any>
  sub: { unsubscribe: () => void }
  rxSubscriptions: Subscription[]

  public constructor(props: Props) {
    this.tokenData = new TokenData()
    const userData = this.tokenData.getTokenActions()
    this.state = {}
    this.projectID = props.projectID
    this.userID = props.userID || userData?.userID // needs to be acquired from the token if no token - get user id provided from props (maybe)
    this.userProfileID = userData?.userProfileID // needs to be acquired from the token if no token - get user id provided from props (maybe)
    this.manuscriptID = props.manuscriptID
  }

  setDB(db: RxDatabase<any>) {
    this.db = db
  }

  async initCollection(collection: string, channels?: string[]) {
    await CollectionManager.createCollection<T>({
      collection,
      channels,
      db: this.db,
    })
  }

  public async init() {
    // create needed collections
    // @TODO getback try and catch
    const db = databaseCreator
    /*      
      1. ✅  Establish DB connection
      2. ✅  Retrieve user data
      3. ✅  Create collections connections
      4. ✅  Create collections connections that depend on other collections info
      5. ✅  Subscribe to the rest of collections
      6. Signal readiness to the listening interfaces

    */

    this.setDB(db)
    this.initCollection(`project-${this.projectID}`, [
      `${this.projectID}-read`,
      `${this.projectID}-readwrite`,
    ])

    // what to do when no user?
    // need to return an explicit warning about no user
    // maybe return an empty object so it will later fail on user presence check
    if (this.userID) {
      this.initCollection('user', [
        this.userID, // invitations
        `${this.userID}-readwrite`, // profile
        `${this.userProfileID}-readwrite`, // profile
        `${this.userID}-projects`, // projects
        `${this.userID}-libraries`, // libraries
        `${this.userID}-library-collections`, // library collections
      ])
    }

    this.initCollection(`collaborators`, [
      `${this.projectID}-read`,
      `${this.projectID}-readwrite`,
    ])

    this.sub = this.subscribe(this.manuscriptID, this.projectID, this.userID)

    return new Promise((resolve, reject) => {})
  }

  public reload(manuscriptID: string, projectID: string, userID: string) {
    if (manuscriptID !== this.manuscriptID || projectID !== this.projectID) {
      this.sub.unsubscribe()

      this.state = {}
      this.projectID = projectID
      this.manuscriptID = manuscriptID
      this.userID = userID // not sure
      return this.init()

      // if (projectID !== this.projectID) {
      //   this.collection = CollectionManager.getCollection<Manuscript>(
      //     `project-${projectID}`
      //   )
      // }
    }
  }

  public destroy() {
    this.sub.unsubscribe()
  }

  setState = (arg: ((data: State) => State) | State) => {
    this.state =
      typeof arg === 'function' ? arg(this.state) : { ...this.state, ...arg }
    this.dispatch()
  }

  dispatch = () => {
    this.listeners.forEach((fn) => fn(this.state))
  }

  onUpdate = (fn: (data: State) => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  omniHandler = (type: string) => async (doc: any) => {
    if (doc) {
      this.setState((state) => {
        return { ...state, [type]: doc.toJSON() }
      })
    }
  }

  omniMapHandler = (type: string) => async (docs: any) => {
    if (docs) {
      const docsMap = new Map<string, any>()

      for (const doc of docs) {
        docsMap.set(doc._id, doc.toJSON())
      }

      this.setState((state) => {
        return { ...state, [type]: docsMap }
      })
    }
  }

  omniArrayHandler = (type: string) => async (docs: any[]) => {
    if (docs) {
      this.setState((state) => ({
        ...state,
        [type]: docs.map((doc) => doc.toJSON()),
      }))
    }
  }

  cc = (collectionName = `project-${this.projectID}`) =>
    CollectionManager.getCollection<any>(collectionName)

  private dependsOnStateCondition = (
    asyncConidition: (state: State) => Promise<boolean>,
    dependant: () => Subscription
  ) => {
    const unsubscribe = this.onUpdate(async (state) => {
      const satisfied = await asyncConidition(state)
      if (satisfied) {
        this.rxSubscriptions.push(dependant())
        unsubscribe()
      }
    })
  }

  private subscribe = (
    manuscriptID: string,
    projectID: string,
    userID?: string
  ) => {
    this.rxSubscriptions = [
      // collect all of them and expose single unsubscribe facade
      this.cc()
        .findOne(manuscriptID)
        .$.subscribe(this.omniHandler('manuscript')),

      this.cc().findOne(projectID).$.subscribe(this.omniHandler('project')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.Tag,
        })
        .$.subscribe(this.omniHandler('tags')),

      this.cc()
        .find({
          objectType: ObjectTypes.UserCollaborator,
        })
        .$.subscribe(this.omniMapHandler('collaborators')),

      this.cc()
        .find({
          projectID,
        })
        .$.subscribe(this.omniHandler('projectModels')), // for diagnostics

      this.cc()
        .find({
          objectType: ObjectTypes.Library,
        })
        .$.subscribe(this.omniMapHandler('library')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.ContainerInvitation,
        })
        .$.subscribe(this.omniArrayHandler('containerInvitations')),

      this.cc()
        .find({
          objectType: ObjectTypes.Library,
        })
        .$.subscribe(this.omniMapHandler('globalLibraries')), // @TODO create channels on update and create a new db

      userID &&
        this.cc('user')
          .find({
            objectType: ObjectTypes.LibraryCollection,
          })
          .$.subscribe(this.omniMapHandler('globalLibraryCollections')), // @TODO create channels on update and create a new db

      userID &&
        this.cc('user')
          .findOne({
            userID, // NOTE: finding by `userID` not `_id`
            objectType: ObjectTypes.UserProfile,
          })
          .$.subscribe(async (doc: RxDocument<UserProfile>) => {
            if (doc) {
              const user = await buildUser(doc)
              this.setState((state) => {
                return {
                  ...state,
                  user,
                }
              })
            }
          }),

      // @DEPENDENT ON ====>
      // 1. Create collection after globalLibraries.keys()

      userID &&
        this.cc('user')
          .find({
            objectType: ObjectTypes.BibliographyItem,
            containerID: projectID,
          })
          .$.subscribe(this.omniMapHandler('globalLibraryItems')),

      this.cc()
        .find({
          projectID,
          manuscriptID,
          objectType: ObjectTypes.CommentAnnotation,
        })
        .$.subscribe(this.omniArrayHandler('comments')),

      this.cc()
        .find({
          projectID,
          manuscriptID,
          objectType: ObjectTypes.ManuscriptNote,
        })
        .$.subscribe(this.omniArrayHandler('notes')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.ProjectInvitation,
        })
        .$.subscribe(this.omniArrayHandler('invitations')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.Keyword,
        })
        .$.subscribe(this.omniMapHandler('keywords')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.LibraryCollection,
        })
        .$.subscribe(this.omniMapHandler('projectLibraryCollections')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.BibliographyItem,
        })
        .$.subscribe(this.omniMapHandler('library')),

      this.cc()
        .find({
          projectID,
          objectType: ObjectTypes.Manuscript,
        })
        .$.subscribe((docs: any[]) => {
          if (docs) {
            this.setState((state) => ({
              ...state,
              manuscripts: docs.map((doc) => doc.toJSON()),
            }))
          } else {
            this.setState({ manuscripts: [] })
          }
        }),

      this.cc()
        .find({
          objectType: ObjectTypes.Project,
        })
        .$.subscribe(this.omniArrayHandler('projects')),
    ]

    this.dependsOnStateCondition(
      async (state) => {
        if (state.globalLibraries && state.globalLibraryCollections) {
          const channels = [
            ...[
              ...state.globalLibraries.keys(),
              ...state.globalLibraryCollections.keys(),
            ].map((id) => `${id}-read`),
            `${projectID}-bibitems`,
          ]
          return this.initCollection(`libraryitems`, channels)
            .then(() => {
              return true
            })
            .catch((e) => {
              console.log(e)
              return false
            })
        }
        return false
      },
      () =>
        this.cc('libraryitems')
          .find({
            objectType: ObjectTypes.UserProject,
          })
          .$.subscribe(this.omniArrayHandler('userProjects'))
    )
    return {
      unsubscribe: () =>
        this.rxSubscriptions.forEach((sub) => sub.unsubscribe()),
    }
  }
}

export default RxDBDataBridge
