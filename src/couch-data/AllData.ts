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
  Affiliation,
  Contributor,
} from '@manuscripts/manuscripts-json-schema'
import { RxDocument, RxDatabase } from '@manuscripts/rxdb'

import { buildUser } from '../lib/data'
import { buildCollaboratorProfiles } from '../lib/collaborators'
import CollectionManager from '../sync/CollectionManager'
import { databaseCreator } from '../lib/db'
import { buildAuthorsAndAffiliations } from '../lib/authors'
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

const SUBSCRIPTION_TIMEOUT = 20000

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
  private expectedState: string[] = []

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
    const createdCollection = await CollectionManager.createCollection({
      collection,
      channels,
      db: this.db,
    })
    return createdCollection
  }

  /*      
        1. Establish DB connection
        2. Retrieve user data
        3. Create collections connections
        4. Create collections connections that depend on other collections info
        5. Apply builders. Should builder be applied here? 
        6. Signal readiness to the listening interfaces
      */

  public async init() {
    try {
      const db = await databaseCreator

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
      // need to init if received update at least once from all the collections

      this.modelManager = new ModelManager(
        this.state.modelMap,
        (modelMap) => {
          this.setState({ modelMap })
        },
        this.manuscriptID,
        this.projectID,
        this.cc()
      )

      return new Promise((resolve) => {
        let resolved = false
        const unsubscribe = this.onUpdate(() => {
          if (!this.expectedState.length) {
            /*
              this is an optimisation
              to wait for each subscription to kick in at least once,
              so we won't give the main store an empty state and then cause
              a lot of updates on the store by feeding in initial state piece by piece
             */
            unsubscribe()
            resolve(this)
            resolved = true
          }
        })
        // resolve anyway if takes too long
        setTimeout(() => {
          if (!resolved) {
            console.warn('Not all couch subscriptions responded')
            resolve(this)
          }
        }, SUBSCRIPTION_TIMEOUT)
      })
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

    const currentKeys = Object.keys(this.state)
    this.expectedState = this.expectedState.filter(
      (key) => !currentKeys.includes(key)
    )

    Object.keys(this.state).forEach((stateKey) => {
      const inExpectedIndex = this.expectedState.indexOf(stateKey)
      if (inExpectedIndex >= 0) {
        this.expectedState.splice(inExpectedIndex)
      }
    })
    this.dispatch()
  }

  dispatch = () => {
    this.listeners.forEach((fn) => fn(this.state))
  }

  onUpdate = (fn: (data: State) => void) => {
    this.listeners.add(fn)

    return () => this.listeners.delete(fn)
  }

  omniHandler = (type: string) => {
    this.expect(type)

    return async (doc: any) => {
      if (doc) {
        this.setState((state) => {
          return { ...state, [type]: doc.toJSON() }
        })
      }
    }
  }

  omniMapHandler = (type: string) => {
    this.expect(type)

    return async (docs: any) => {
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
  }

  private expect = (key: string) => {
    this.expectedState.push(key) // kinda relies on the state to be flat
  }

  omniArrayHandler = (type: string) => {
    this.expect(type)

    return async (docs: any[]) => {
      if (docs) {
        this.setState((state) => ({
          ...state,
          [type]: docs.map((doc) => doc.toJSON()),
        }))
      }
    }
  }

  cc = (collectionName = `project-${this.projectID}`) =>
    CollectionManager.getCollection<Model>(collectionName)

  private dependsOnStateConditionOnce = (
    condition: (state: State) => boolean,
    dependant: (state: State) => Subscription | void
  ) => {
    const unsubscribe = this.onUpdate((state) => {
      const satisfied = condition(state)
      if (satisfied) {
        unsubscribe()
        const maybeSubscription = dependant(state)
        if (maybeSubscription) {
          this.rxSubscriptions.push(maybeSubscription)
        }
        // this maybe a problem as some of the data may not be updated on changes in the store
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

      this.cc('user')
        .findOne(containerID)
        .$.subscribe(this.omniHandler('project')),

      this.cc()
        .find({
          containerID,
          objectType: ObjectTypes.Tag,
        })
        .$.subscribe(this.omniArrayHandler('tags')),

      this.cc('collaborators')
        .find({
          objectType: ObjectTypes.UserCollaborator,
        })
        .$.subscribe(this.omniMapHandler('collaborators')),

      this.cc()
        .find({
          containerID,
        })
        .$.subscribe(this.omniMapHandler('projectModels')), // for diagnostics

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

      this.cc()
        .find({
          manuscriptID,
          objectType: ObjectTypes.ContributorRole,
        })
        .$.subscribe(this.omniArrayHandler('contributorRoles')),

      this.cc()
        .find({
          manuscriptID,
          $or: [
            { objectType: ObjectTypes.Contributor },
            { objectType: ObjectTypes.Affiliation },
          ],
        })
        .$.subscribe((docs) => {
          if (!docs) {
            return
          }
          const models = docs.map((doc) => doc.toJSON()) as Array<
            Contributor | Affiliation
          >
          this.setState({
            authorsAndAffiliations: buildAuthorsAndAffiliations(models),
          })
        }),

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

      this.cc('user')
        .find({
          objectType: ObjectTypes.Project,
        })
        .$.subscribe(this.omniArrayHandler('projects')),

      this.cc()
        .find({
          manuscriptID,
          objectType: { $eq: ObjectTypes.StatusLabel },
        })
        .$.subscribe(this.omniArrayHandler('statusLabels')),
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
        const modelsMap = await buildModelMap(models)
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

    // getting snapshots
    this.cc()
      .find({
        objectType: ObjectTypes.Snapshot,
      })
      .$.subscribe((snapshots: RxDocument<Model>[]) => {
        this.setState({
          snapshots: snapshots
            .map((doc) => doc.toJSON() as RxDocument<Snapshot>)
            .sort((a, b) => b.createdAt - a.createdAt),
        })
      })

    this.dependsOnStateConditionOnce(
      (state) => state.user && state.collaborators,
      (state) => {
        this.setState({
          collaboratorsProfiles: buildCollaboratorProfiles(
            state.collaborators,
            state.user
          ),
        })
      }
    )

    this.dependsOnStateConditionOnce(
      (state) => state.invitations && state.containerInvitations,
      (state) => {
        this.setState({
          invitations: buildInvitations(
            state.invitations,
            state.containerInvitations
          ),
        })
      }
    )

    this.dependsOnStateConditionOnce(
      (state) => state.globalLibraries && state.globalLibraryCollections,
      (state) => {
        const channels = [
          ...[
            ...state.globalLibraries.keys(),
            ...state.globalLibraryCollections.keys(),
          ].map((id) => `${id}-read`),
          `${containerID}-bibitems`,
        ]
        this.initCollection('libraryitems', channels)
          .then((r) => {
            this.cc('libraryitems')
              .find({
                objectType: ObjectTypes.UserProject,
              })
              .$.subscribe(this.omniArrayHandler('userProjects'))
          })
          .catch((e) => {
            console.log(e)
            return false
          })
      }
    )
    return {
      unsubscribe: () =>
        this.rxSubscriptions.forEach((sub) => sub.unsubscribe()),
    }
  }
}

export default RxDBDataBridge
