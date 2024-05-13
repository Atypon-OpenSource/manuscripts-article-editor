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
  Bundle,
  ManuscriptTemplate,
  Model,
  Project,
  SectionCategory,
  UserProfile,
} from '@manuscripts/json-schema'
import axios, { AxiosInstance } from 'axios'

import config from '../config'
import { ISaveSnapshotResponse } from '../quarterback/types'

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
      })
      return result.data
    } catch (e) {
      console.log(e)
      return undefined
    }
  }

  post = async <T>(path: string, data: unknown) => {
    return this.instance
      .post<T>(path, data)
      .then((result) => result.data)
      .catch((e) => {
        console.log(e)
        throw e.data?.error?.message || 'Request failed'
      })
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

  getUser = () => {
    return this.get<UserProfile>(`user`)
  }

  getManuscript = (containerID: string, manuscriptID: string) =>
    this.get<Model[]>(`project/${containerID}/manuscript/${manuscriptID}`)

  getSectionCategories = () =>
    this.get<SectionCategory[]>('/config?id=section-categories')

  getCSLLocale = (lang: string) =>
    lang !== 'en-US' ? this.get<string>(`/csl/locales?id=${lang}`) : undefined

  getTemplate = (id?: string) =>
    id ? this.get<ManuscriptTemplate>(`/templates?id=${id}`) : undefined

  getBundle = (template: ManuscriptTemplate | undefined) =>
    template?.bundle
      ? this.get<Bundle>(`/bundles?id=${template.bundle}`)
      : undefined

  getCSLStyle = (bundle: Bundle | undefined) =>
    bundle?.csl?._id
      ? this.get<string>(`/csl/styles?id=${bundle.csl._id}`)
      : undefined

  getUserProfiles = (containerID: string) =>
    this.get<UserProfile[]>(`/project/${containerID}/userProfiles`)

  saveProject = (projectId: string, models: Model[]) => {
    return this.put(`project/${projectId}`, { data: models })
  }

  createProject = (projectId: string, title: string) => {
    return this.post<Project>(`project/${projectId}`, { title })
  }

  createSnapshot = (projectID: string, manuscriptID: string) => {
    return this.post<ISaveSnapshotResponse>(
      `snapshot/${projectID}/manuscript/${manuscriptID}`,
      {
        docID: manuscriptID,
        name: new Date().toLocaleString('sv'),
      }
    )
  }
}
