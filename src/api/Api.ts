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
  Model,
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/json-schema'
import { ManuscriptTemplate } from '@manuscripts/transform'
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { createContext, useContext } from 'react'

import { getConfig } from '../config'
import { ManuscriptDoc, ManuscriptSnapshot } from '../lib/doc'
import {
  CreateSnapshotResponse,
  Language,
  SendStepsPayload,
  SendStepsResponse,
  StepsListener,
  StepsSinceResponse,
  TransformVersionResponse,
} from './types'

export class Api {
  instance: AxiosInstance

  constructor(getAuthToken: () => Promise<string | undefined>) {
    const config = getConfig()
    this.instance = axios.create({
      baseURL: config.api.url,
      headers: { ...config.api.headers },
    })
    this.instance.interceptors.request.use((config) =>
      this.authInterceptor(config, getAuthToken)
    )
  }

  authInterceptor = async (
    config: InternalAxiosRequestConfig,
    getToken: () => Promise<string | undefined>
  ) => {
    const token = await getToken()
    config.headers.Authorization = 'Bearer ' + token
    return config
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

  getCSLLocale = (lang: string) =>
    lang ? this.get<string>(`/csl/locales?id=${lang}`) : undefined

  getTemplate = (id?: string) =>
    id ? this.get<ManuscriptTemplate>(`/templates?id=${id}`) : undefined

  getBundle = (template: ManuscriptTemplate) =>
    template?.bundle
      ? this.get<Bundle>(`/bundles?id=${template.bundle}`)
      : undefined

  getCSLStyle = (bundle: Bundle) =>
    bundle?.csl?._id
      ? this.get<string>(`/csl/styles?id=${bundle.csl._id}`)
      : undefined

  getLanguages = () => this.get<Language[]>('/languages')

  getUserProfiles = (containerID: string) =>
    this.get<UserProfile[]>(`/project/${containerID}/userProfiles`)

  getProject = async (projectID: string) => {
    const models = await this.get<Model[]>(`project/${projectID}`)
    if (!models) {
      throw new Error('Models are wrong.')
    }
    for (const model of models) {
      if (model.objectType === ObjectTypes.Project) {
        return model as Project
      }
    }
  }

  saveProject = (projectId: string, models: Model[]) => {
    return this.put(`project/${projectId}`, { data: models })
  }

  createProject = (projectId: string, title: string) =>
    this.post<Project>(`project/${projectId}`, { title })

  getSnapshot = (snapshotID: string) =>
    this.get<ManuscriptSnapshot>(`snapshot/${snapshotID}`)

  createSnapshot = (projectID: string, manuscriptID: string, name: string) =>
    this.post<CreateSnapshotResponse>(
      `snapshot/${projectID}/manuscript/${manuscriptID}`,
      {
        docID: manuscriptID,
        name,
      }
    )

  getDocument = (projectID: string, manuscriptID: string) =>
    this.get<ManuscriptDoc>(`doc/${projectID}/manuscript/${manuscriptID}`)

  sendSteps = async (
    projectID: string,
    manuscriptID: string,
    data: SendStepsPayload,
    signal?: AbortSignal
  ) => {
    try {
      const result = await this.instance.post<SendStepsResponse>(
        `doc/${projectID}/manuscript/${manuscriptID}/steps`,
        {
          ...data,
          steps: data.steps.map((s) => s.toJSON()),
        },
        { signal }
      )
      return result.data
    } catch (e) {
      const axiosError = e as AxiosError
      if (
        axiosError.name === 'AbortError' ||
        axiosError.code === 'ERR_CANCELED' ||
        axiosError.message === 'canceled'
      ) {
        console.log('Request was aborted')
        return {
          error: 'aborted',
        }
      }
      const error =
        axiosError.response?.status === 409 ? 'conflict' : axiosError.message
      return {
        error: error,
      }
    }
  }

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
    return close
  }
}

export const ApiContext = createContext<Api | undefined>(undefined)

export const useApi = (): Api => {
  const api = useContext(ApiContext)
  if (!api) {
    throw new Error('Api not initialized')
  }
  return api
}
