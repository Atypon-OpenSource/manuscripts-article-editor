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
  Snapshot,
  Model,
  Project,
  UserCollaborator,
} from '@manuscripts/manuscripts-json-schema'
import axios, { AxiosInstance } from 'axios'
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
      const result = await this.instance.get<T>(url)
      return result.data
    } catch (e) {
      console.log(e)
      return null
    }
  }

  post = <T>(path: string, data: unknown) => {
    return this.instance.post<T>(path, data)
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

  getProject = <T>(projectID: string) => {
    return this.get<T>(`project/${projectID}`)
  }

  getUserProjects = () => {
    return this.get<Project[]>(`user/projects`)
  }

  deleteProject = <T>(projectID: string) => {
    return this.delete<T>(`project/${projectID}`)
  }
  addManuscript = <T>(projectID: string, data: unknown) => {
    return this.post<T>(`project/${projectID}`, data)
  }

  getManuscript = (containerID: string, manuscriptID: string) =>
    this.get<Model[]>(`/projects/${containerID}/manuscript/${manuscriptID}`)

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
    return this.post(`project/${projectId}/save`, models)
  }

  upsertManuscript = (
    projectId: string,
    manuscriptId: string,
    models: Model[]
  ) => {
    return this.post(`project/${projectId}/save/${manuscriptId}`, models) // currently not supported by the api
  }

  createSnapshot = (containerID: string, snapshot: Snapshot) => {
    return this.post(`snapshot/${containerID}/create`, snapshot)
  }
}
