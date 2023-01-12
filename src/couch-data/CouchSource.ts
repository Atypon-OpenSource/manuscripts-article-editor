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
import { builderFn, stateSetter } from '../store'
import { StoreDataSourceStrategy } from '../store/DataSourceStrategy'
import RxDBDataBridge from './AllData'
import { databaseCreator } from './db'
import Utilities from './Utilities'

export default class CouchSource implements StoreDataSourceStrategy {
  rxDBDataBridge: RxDBDataBridge
  ready: boolean
  unsubscribeFromData: () => void
  storeUnsubscribe: () => void
  utilities: Utilities
  build: builderFn = async (state, next) => {
    const db = await databaseCreator

    this.utilities = new Utilities(db)
    await this.utilities.init(state.userID || '')

    if (state.manuscriptID && state.projectID) {
      this.rxDBDataBridge = new RxDBDataBridge({
        projectID: state.projectID,
        manuscriptID: state.manuscriptID,
        userID: state.userID || '',
        db,
      })
      await this.rxDBDataBridge.init()
    }
    this.ready = true
    const data = this.rxDBDataBridge ? await this.rxDBDataBridge.getData() : {}
    const tools = this.utilities.getTools()
    next({ ...data, ...tools })
  }
  afterAction: StoreDataSourceStrategy['afterAction'] = (state, setState) => {
    if (
      state.manuscriptID !== this.rxDBDataBridge.manuscriptID ||
      state.projectID !== this.rxDBDataBridge.projectID ||
      state.userID !== this.rxDBDataBridge.userID
    ) {
      if (state.userID) {
        this.rxDBDataBridge
          .reload(state.manuscriptID, state.projectID, state.userID)
          ?.then(() => {
            setState((state) => {
              return { ...state, ...this.rxDBDataBridge.getData() }
            })
          })
      } else {
        // ...
      }
    }
  }
  updateStore = (setState: stateSetter) => {
    if (this.rxDBDataBridge) {
      this.unsubscribeFromData = this.rxDBDataBridge.onUpdate(
        (couchDataState) => {
          setState((state) => {
            return {
              ...state,
              ...couchDataState,
            }
          })
        }
      )
    }
  }

  // This all is soon to be removed. No need to care for types
  // @ts-ignore
  constructor(getAttachments: any) {
    // Only added for compliance. Not supported ATM
    console.log('Contructing pouch source.')
  }

  // unmount = () => {}
  // listen = (unsubscribe: () => void) => {
  //   this.storeUnsubscribe = unsubscribe
  //   // feed updates from the store
  //   return (setState: stateSetter) => {}
  // }
}
