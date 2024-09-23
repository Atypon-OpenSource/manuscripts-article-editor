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
import axios, { AxiosError, AxiosInstance } from 'axios'

import { getConfig } from '../config'
import { ManuscriptDoc, ManuscriptSnapshot } from '../lib/doc'
import {
  CreateSnapshotResponse,
  SendStepsPayload,
  SendStepsResponse,
  StepsListener,
  StepsSinceResponse,
  TransformVersionResponse,
} from './types'

export default class Api {
  instance: AxiosInstance

  constructor() {
    const config = getConfig()
    this.instance = axios.create({
      baseURL: config.api.url,
      headers: config.api.headers,
    })
  }

  setToken = (token: string) => {
    const config = getConfig()
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
      .catch((e: AxiosError) => {
        const status = e.response?.status
        if (!status || status >= 500) {
          console.log(e)
        }
        throw e
      })
  }

  delete = <T>(url: string) => this.instance.delete<T>(url)

  options = <T>(url: string) => this.instance.options<T>(url)

  put = <T>(path: string, data: unknown) => this.instance.put<T>(path, data)

  getTransformVersion = () =>
    this.get<TransformVersionResponse>('/doc/version').then(
      (d) => d?.transformVersion || ''
    )

  getUser = () => this.get<UserProfile>('user')

  getManuscript = (projectID: string, manuscriptID: string) =>
    this.get<Model[]>(`project/${projectID}/manuscript/${manuscriptID}`)

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

  createProject = (projectId: string, title: string) =>
    this.post<Project>(`project/${projectId}`, { title })

  getSnapshot = (snapshotID: string) =>
    this.get<ManuscriptSnapshot>(`snapshot/${snapshotID}`)

  createSnapshot = (projectID: string, manuscriptID: string) => {
    return this.post<CreateSnapshotResponse>(
      `snapshot/${projectID}/manuscript/${manuscriptID}`,
      {
        docID: manuscriptID,
        name: new Date().toLocaleString('sv'),
      }
    )
  }

  getDocument = (projectID: string, manuscriptID: string) =>
    this.get<ManuscriptDoc>(`doc/${projectID}/manuscript/${manuscriptID}`)

  sendSteps = (
    projectID: string,
    manuscriptID: string,
    data: SendStepsPayload
  ) =>
    this.post<SendStepsResponse>(
      `doc/${projectID}/manuscript/${manuscriptID}/steps`,
      {
        ...data,
        steps: data.steps.map((s) => s.toJSON()),
      }
    ).catch((e: AxiosError) => {
      const error = e.response?.status === 409 ? 'conflict' : e.message
      return {
        error: error,
      }
    })

  getStepsSince = (projectID: string, manuscriptID: string, version: number) =>
    this.get<StepsSinceResponse>(
      `doc/${projectID}/manuscript/${manuscriptID}/version/${version}`
    )

  listenToSteps = (
    projectID: string,
    manuscriptID: string,
    listener: StepsListener
  ) => {
    const config = getConfig()
    const base = config.api.url.replace('http', 'ws')
    const url = `${base}/doc/${projectID}/manuscript/${manuscriptID}/listen`

    let ws: WebSocket

    const onOpen = () => {
      console.log('Established WebSocket connection')
    }

    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (
        typeof data.version !== 'undefined' &&
        data.steps &&
        Array.isArray(data.steps) &&
        data.clientIDs
      ) {
        listener(data.version, data.steps, data.clientIDs)
      }
    }

    const onClose = (event: CloseEvent) => {
      console.warn(
        'WebSocket connection closed, reconnecting:',
        event.code,
        event.reason
      )
      rejoin()
    }

    const onError = (event: Event) => {
      console.error('WebSocket error, reconnecting:', event)
      rejoin()
    }

    const close = () => {
      if (!ws) {
        return
      }
      ws.removeEventListener('open', onOpen)
      ws.removeEventListener('message', onMessage)
      ws.removeEventListener('close', onClose)
      ws.removeEventListener('error', onError)
      ws.close()
    }

    const rejoin = () => {
      close()
      setTimeout(join, 1500)
    }

    const join = () => {
      try {
        ws = new WebSocket(url)
        ws.addEventListener('open', onOpen)
        ws.addEventListener('message', onMessage)
        ws.addEventListener('close', onClose)
        ws.addEventListener('error', onError)
      } catch (e) {
        console.log(e)
        rejoin()
      }
    }
    window.addEventListener('beforeunload', close)
    join()
  }
}
