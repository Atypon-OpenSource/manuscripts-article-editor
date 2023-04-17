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
import { SubmissionAttachment } from '@manuscripts/style-guide'

import deeperEqual from '../lib/deeper-equal'
import { builderFn, state, stateSetter } from '../store'
import { StoreDataSourceStrategy } from '../store/DataSourceStrategy'
import Api from './Api'
import buildData, { getDrivedData } from './buildData'
import buildUtilities from './buildUtilities'

export default class PsSource implements StoreDataSourceStrategy {
  api: Api
  data: Partial<state>
  utilities: ReturnType<typeof buildUtilities>
  attachments: SubmissionAttachment[]
  constructor(attachments: SubmissionAttachment[]) {
    this.api = new Api()
    this.attachments = attachments
    // import api
    // get user and all the data
    // build and provide methods such as saveModel, saveManuscript etc. (see ModelManager in couch-data)
    // conform with the store
  }

  updateState = (state: Partial<state>) => {
    console.error(new Error('Store not yet mounted').stack)
  }

  build: builderFn = async (state, next, setState) => {
    if (state.userID && state.authToken) {
      this.api.setToken(state.authToken)
    }
    if (state.manuscriptID && state.projectID) {
      this.data = await buildData(
        state.projectID,
        state.manuscriptID,
        this.api,
        this.attachments
      )
      this.utilities = buildUtilities(this.data, this.api, setState)
    }
    next({ ...state, ...this.data, ...this.utilities })
  }
  afterAction: StoreDataSourceStrategy['afterAction'] = (
    state,
    prev,
    setState
  ) => {
    if (!deeperEqual(state.modelMap, prev.modelMap)) {
      setState((state) => ({
        ...state,
        ...getDrivedData(state.projectID, state),
      }))
    }
    return
  }
  updateStore = (setState: stateSetter) => {
    this.updateState = setState
  }
}
