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

import { getVersion as getTransformVersion } from '@manuscripts/transform'

import { builderFn, state, stateSetter } from '../store'
import { StoreDataSourceStrategy } from '../store/DataSourceStrategy'
import { Api } from './Api'
import { buildData } from './buildData'
import { buildUtilities } from './buildUtilities'

export class ApiSource implements StoreDataSourceStrategy {
  api: Api
  data: Partial<state>
  utilities: Partial<state>

  constructor(api: Api) {
    this.api = api
  }

  updateState: stateSetter = (state: state) => {
    console.error(new Error('Store not yet mounted').stack)
  }

  build: builderFn = async (state, next, setState) => {
    const projectID = state.projectID
    const manuscriptID = state.manuscriptID
    if (manuscriptID && projectID) {
      await this.checkTransformVersion()
      this.data = await buildData(projectID, manuscriptID, this.api)
      this.utilities = buildUtilities(
        projectID,
        manuscriptID,
        () => this.data,
        setState,
        this.api
      )
    }
    next({ ...state, ...this.data, ...this.utilities })
  }
  afterAction = (state: state) => {
    this.data = state // keep up to date for utility function
  }
  updateStore = (setState: stateSetter) => {
    this.updateState = setState
  }
  checkTransformVersion = async () => {
    const fe = getTransformVersion()
    const api = await this.api.getTransformVersion()
    if (fe !== api) {
      console.warn(
        `manuscripts-transform version mismatch. FE: ${fe}, api: ${api}`
      )
    }
  }
}
