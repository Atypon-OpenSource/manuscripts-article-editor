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
import { Build, ContainedModel } from '@manuscripts/manuscript-transform'
import {
  Snapshot,
  Model,
  Project,
  UserCollaborator,
  UserProfile,
  Manuscript,
} from '@manuscripts/manuscripts-json-schema'
import axios, { AxiosInstance } from 'axios'
import { ContainedIDs } from '../store'
import config from '../config'

export default class Api {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: config.api.url,
      headers: config.api.headers,
    })
  }

  setToken = (token: string) => {
    this.instance = axios.create({
      baseURL: config.api.url,
      headers: { ...config.api.headers, Authorization: 'Bearer ' + token },
    })
  }

  get = async <T>(url: string) => {
    try {
      const result = await this.instance.get<T>(url, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {},
      })
      return result.data
    } catch (e) {
      console.log(e)
      return null
    }
  }

  post = async <T>(path: string, data: unknown) => {
    try {
      const result = await this.instance.post<T>(path, data)
      return result.data
    } catch (e) {
      console.log(e)
      return null
    }
  }

  delete = <T>(url: string) => {
    return this.instance.delete<T>(url)
  }

  options = <T>(url: string) => {
    return this.instance.options<T>(url)
  }

  put = <T>(path: string, data: unknown) => {
    return this.instance.put<T>(path, data)
  }

  getProject = (projectID: string) => {
    return this.post<Project>(`container/${projectID}/load`, { types: [] })
  }

  getProjectCollaborators = (projectID: string) => {
    return this.get(`project/${projectID}/collaborators`)
  }

  getUserProjects = () => {
    return this.get<Project[]>(`user/projects`)
  }

  getUser = () => {
    return this.get<UserProfile>(`user`)
  }

  getProjectModels = <T>(projectID: string, types: string[] = []) => {
    return this.post<T[]>(`container/${projectID}/load`, { types })
  }

  deleteProject = (projectID: string) => {
    return this.delete<boolean>(`project/${projectID}`) // not sure what exactly it sends over
  }
  addManuscript = (projectID: string, data: unknown) => {
    return this.post<Manuscript>(`project/${projectID}`, data) // will it really return manuscript?
  }

  getManuscript = (containerID: string, manuscriptID: string) =>
    this.post<Model[]>(`/container/${containerID}/${manuscriptID}/load`, {
      types: [],
    })

  getManuscriptModels = <T>(
    containerID: string,
    manuscriptID: string,
    types: string[]
  ) =>
    this.post<T[]>(`/container/${containerID}/${manuscriptID}/load`, {
      types,
    })

  getCollaborators = (containerID: string) =>
    this.get<UserCollaborator[]>(`/project/${containerID}/collaborators`)

  signUpAndGetToken = async (
    username: string,
    password: string,
    name: string
  ) => {
    await this.post('/registration/signup', {
      username,
      password,
      name,
    })
    const result = await this.get<{ token: string; recover: boolean }>('user')
    return result?.token
  }

  saveProject = (projectId: string, models: Model[]) => {
    return this.post(`project/${projectId}/save`, { data: models })
  }

  createProject = (title: string) => {
    return this.post<Project>('project', { title })
  }

  createNewManuscript = (
    projectID: string,
    manuscriptID: string,
    templateID = '' // not going to work for now. Needs to be allowed without templateID for dev purposes.
  ) => {
    if (!templateID) {
      templateID =
        'MPManuscriptTemplate:www-zotero-org-styles-plos-one-PLOS-ONE-Journal-Publication'
      console.log(
        "Applying development templateID as there was no real ID provided on new manuscript creation. This is because API doesn't allow no templateID but it used to be allowed on CouchDB"
      )
    }
    return this.post<Manuscript>(
      `container/projects/${projectID}/manuscript/${manuscriptID}`,
      {
        manuscriptID,
        templateID,
      }
    )
  }

  saveProjectData = async (
    projectID: string,
    data: Array<Build<ContainedModel> & ContainedIDs>
  ) => {
    await this.post(`project/${projectID}/save`, {
      data,
    })
    return data
  }

  saveManuscriptData = async (
    projectID: string,
    manuscriptID: string,
    models: Array<Build<ContainedModel>>
  ) => {
    await this.post(`project/${projectID}/manuscripts/${manuscriptID}/save`, {
      data: models,
    })
  }

  createUser = async (email: string, password: string) => {
    // this is fiction - no such thing in the api
    return this.post('/user', { email, password })
  }

  // upsertManuscript = (
  //   projectId: string,
  //   manuscriptId: string,
  //   models: Model[]
  // ) => {
  //   return this.post(`project/${projectId}/save/${manuscriptId}`, models) // currently not supported by the api
  // }

  createSnapshot = (containerID: string, snapshot: Snapshot) => {
    return this.post(`snapshot/${containerID}/create`, snapshot)
  }
}
