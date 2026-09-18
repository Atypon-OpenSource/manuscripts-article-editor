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
  Project,
  UserProfile,
} from '@manuscripts/transform'
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
  private getAuthToken: () => Promise<string | undefined>

  constructor(getAuthToken: () => Promise<string | undefined>) {
    const config = getConfig()
    this.getAuthToken = getAuthToken
    this.instance = axios.create({
      baseURL: config.api.url,
      headers: { ...config.api.headers },
    })
    this.instance.interceptors.request.use((config) =>
      this.authInterceptor(config, getAuthToken)
    )
  }

  private docPath = (docID: string) => `/v3/doc/${docID}`

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

  // manuscripts-cf-worker has no /user endpoint — the current user's
  // profile is static for now rather than fetched.
  getUser = async (): Promise<UserProfile> => ({
    _id: 'static-user-profile-id',
    userID: 'static-user-id',
    connectID: 'static-connect-id',
  })

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

  getOEmbedHtml = async (
    mediaUrl: string,
    maxWidth: number,
    maxHeight: number
  ) => {
    const params = new URLSearchParams({
      url: mediaUrl,
      maxwidth: String(maxWidth),
      maxheight: String(maxHeight),
    })
    return this.get<{ html: string | null }>(`oembed/html?${params.toString()}`)
  }

  getUserProfiles = (docID: string) =>
    this.get<UserProfile[]>(`/project/${docID}/userProfiles`)

  getProject = async (docID: string) => {
    const response = await this.get<Project>(`project/${docID}`)
    if (!response) {
      throw new Error('Project not found.')
    }
    //old API versions return an array
    if (Array.isArray(response)) {
      return response[0]
    }
    return response
  }

  getSnapshot = (snapshotID: string) =>
    this.get<ManuscriptSnapshot>(`snapshot/${snapshotID}`)

  createSnapshot = (docID: string, name: string) =>
    this.post<CreateSnapshotResponse>(`snapshot/${docID}`, {
      docID,
      name,
    })

  getDocument = async (docID: string) => {
    const doc = await this.get<ManuscriptDoc>(this.docPath(docID))
    // manuscripts-cf-worker doesn't support snapshots yet, so its response
    // has no "snapshots" field at all — default it rather than leave it
    // undefined, since ManuscriptDoc declares it as always present.
    return doc ? { ...doc, snapshots: doc.snapshots ?? [] } : doc
  }

  sendSteps = async (
    docID: string,
    data: SendStepsPayload,
    signal?: AbortSignal
  ) => {
    try {
      const result = await this.instance.post<SendStepsResponse>(
        `${this.docPath(docID)}/steps`,
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

  getStepsSince = (docID: string, version: number) =>
    this.get<StepsSinceResponse>(
      `${this.docPath(docID)}/steps?since=${version}`
    )

  listenToSteps = (docID: string, listener: StepsListener) => {
    const config = getConfig()
    const base = new URL(config.api.url, window.location.origin)
    base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:'
    const path = `${this.docPath(docID)}/steps`

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

    // A WebSocket upgrade can't carry the Authorization header the axios
    // interceptor attaches to normal requests, so the token travels as a
    // query param instead — fetched fresh on every (re)join, since a token
    // can expire between connections.
    const join = async () => {
      try {
        const token = await this.getAuthToken()
        const url = `${base.href}${path}?token=${encodeURIComponent(token ?? '')}`
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
