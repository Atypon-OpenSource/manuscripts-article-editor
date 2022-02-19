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
  Model,
  ObjectTypes,
  Tag,
  Commit as CommitJson,
  UserProfile,
  Snapshot,
} from '@manuscripts/manuscripts-json-schema'
import { RxDocument, RxDatabase } from '@manuscripts/rxdb'

import { buildUser } from '../lib/data'
import { buildCollaboratorProfiles } from '../lib/collaborators'
import CollectionManager from '../sync/CollectionManager'
import { databaseCreator } from '../lib/db'
import { TokenData } from './TokenData'
import { Subscription } from 'rxjs'

import { buildInvitations } from '../lib/invitation'

import { buildModelMap, schema } from '@manuscripts/manuscript-transform'

import { commitFromJSON } from '@manuscripts/track-changes' // This type dependency seems to be out of order. That should be refactored
import ModelManager from './ModelManager'

interface Props {
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
  modelManager: ModelManager

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
    await CollectionManager.createCollection({
      collection,
      channels,
      db: this.db,
    })
  }

  public async init() {
    // create needed collections
    // @TODO getback try and catch

    try {
      const db = await databaseCreator
      /*      
        1. ✅  Establish DB connection
        2. ✅  Retrieve user data
        3. ✅  Create collections connections
        4. ✅  Create collections connections that depend on other collections info
        5. ✅  Apply builders. Should builder be applied here? 
        6. ✅  Signal readiness to the listening interfaces
      */

      this.setDB(db)
      await this.initCollection(`project-${this.projectID}`, [
        `${this.projectID}-read`,
        `${this.projectID}-readwrite`,
      ])

      // what to do when no user?
      // need to return an explicit warning about no user
      // maybe return an empty object so it will later fail on user presence check
      if (this.userID) {
        await this.initCollection('user', [
          this.userID, // invitations
          `${this.userID}-readwrite`, // profile
          `${this.userProfileID}-readwrite`, // profile
          `${this.userID}-projects`, // projects
          `${this.userID}-libraries`, // libraries
          `${this.userID}-library-collections`, // library collections
        ])
      }

      await this.initCollection(`collaborators`, [
        `${this.projectID}-read`,
        `${this.projectID}-readwrite`,
      ])

      this.sub = this.subscribe(this.manuscriptID, this.projectID, this.userID)

      this.modelManager = new ModelManager(
        this.state.modelMap,
        (modelMap) => {
          this.setState({ modelMap })
        },
        this.manuscriptID,
        this.projectID,
        this.cc()
      )

      return Promise.resolve(this)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  public getData = () => {
    return Object.freeze({ ...this.state, ...this.modelManager.getTools() }) // hmmm....
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
    CollectionManager.getCollection<Model>(collectionName)

  private dependsOnStateCondition = (
    asyncConidition: (state: State) => Promise<boolean>,
    dependant: (state: State) => Subscription | void
  ) => {
    const unsubscribe = this.onUpdate(async (state) => {
      const satisfied = await asyncConidition(state)
      if (satisfied) {
        const maybeSubscription = dependant(state)
        if (maybeSubscription) {
          this.rxSubscriptions.push(maybeSubscription)
        }
        unsubscribe() // this maybe a problem as some of the data may not be update
        // probably needs also to implement - dependsOnStateConditionOnce for once usage
      }
    })
  }

  private subscribe = (
    manuscriptID: string,
    containerID: string,
    userID?: string
  ) => {
    // @TODO move subs into a separate data class sort of thing
    this.rxSubscriptions = [
      // collect all of them and expose single unsubscribe facade
      this.cc()
        .findOne(manuscriptID)
        .$.subscribe(this.omniHandler('manuscript')),

      this.cc().findOne(containerID).$.subscribe(this.omniHandler('project')),

      this.cc()
        .find({
          containerID,
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
          containerID,
        })
        .$.subscribe(this.omniHandler('projectModels')), // for diagnostics

      this.cc()
        .find({
          objectType: ObjectTypes.Library,
        })
        .$.subscribe(this.omniMapHandler('library')),

      this.cc()
        .find({
          containerID,
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
            containerID,
          })
          .$.subscribe(this.omniMapHandler('globalLibraryItems')),

      this.cc()
        .find({
          containerID,
          manuscriptID,
          objectType: ObjectTypes.CommentAnnotation,
        })
        .$.subscribe(this.omniArrayHandler('comments')),

      this.cc()
        .find({
          containerID,
          manuscriptID,
          objectType: ObjectTypes.ManuscriptNote,
        })
        .$.subscribe(this.omniArrayHandler('notes')),

      this.cc()
        .find({
          containerID,
          objectType: ObjectTypes.ProjectInvitation,
        })
        .$.subscribe(this.omniArrayHandler('invitations')),

      this.cc()
        .find({
          containerID,
          objectType: ObjectTypes.Keyword,
        })
        .$.subscribe(this.omniMapHandler('keywords')),

      this.cc()
        .find({
          containerID,
          objectType: ObjectTypes.LibraryCollection,
        })
        .$.subscribe(this.omniMapHandler('projectLibraryCollections')),

      this.cc()
        .find({
          containerID,
          objectType: ObjectTypes.BibliographyItem,
        })
        .$.subscribe(this.omniMapHandler('library')),

      this.cc()
        .find({
          containerID,
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

    // subscribing for modelsMap
    this.cc()
      .find({
        $and: [
          { containerID },
          {
            $or: [{ manuscriptID }, { manuscriptID: { $exists: false } }],
          },
        ],
      })
      .$.subscribe(async (models: Array<RxDocument<Model>>) => {
        const modelsMap = buildModelMap(models)
        this.setState((state) => ({
          ...state,
          modelsMap,
        }))
      })

    // subscribing for commits
    this.cc()
      .find({
        $and: [{ containerID }, { objectType: ObjectTypes.Commit }],
      })
      .$.subscribe((docs: RxDocument<Model>[]) => {
        return docs.map((doc) => {
          const json = (doc.toJSON() as unknown) as CommitJson
          return commitFromJSON(json, schema)
        })
      })
      .catch(() => {
        throw new Error('Unable to query commits')
      })

    // getting snapshots
    this.cc()
      .find({
        objectType: ObjectTypes.Snapshot, // @TODO apply somewhere buildCollaboratorProfiles
      })
      .$.subscribe((snapshots: RxDocument<Model>[]) => {
        this.setState({
          snapshots: snapshots
            .map((doc) => doc.toJSON() as RxDocument<Snapshot>)
            .sort((a, b) => b.createdAt - a.createdAt),
        })
      })

    this.dependsOnStateCondition(
      async (state) => {
        if (state.user && state.collaborators) {
          return true
        }
        return false
      },
      (state) => {
        this.setState({
          collaborators: buildCollaboratorProfiles(
            state.collaborators,
            state.user
          ),
        })
      }
    )

    this.dependsOnStateCondition(
      async (state) => {
        if (state.invitations && state.containerInvitations) {
          return true
        }
        return false
      },
      (state) => {
        this.setState({
          invitations: buildInvitations(
            state.invitations,
            state.containerInvitations
          ),
        })
      }
    )

    this.dependsOnStateCondition(
      async (state) => {
        if (state.globalLibraries && state.globalLibraryCollections) {
          const channels = [
            ...[
              ...state.globalLibraries.keys(),
              ...state.globalLibraryCollections.keys(),
            ].map((id) => `${id}-read`),
            `${containerID}-bibitems`,
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
