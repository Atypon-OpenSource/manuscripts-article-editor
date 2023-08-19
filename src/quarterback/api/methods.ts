/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import type { Maybe } from '@manuscripts/quarterback-types'

import config from '../../config'
import { useAuthStore } from '../useAuthStore'

const {
  quarterback: { url: QUARTERBACK_URL },
} = config

type FetchOptions = {
  method: string
  headers: Record<string, string>
  body?: string
}

export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

let debouncedAuth = false

export function getAuthHeader() {
  const jwt = useAuthStore.getState().jwt
  if (!jwt && !debouncedAuth) {
    // To ensure that user stays authenticated incase the token expires or something weird like
    // https://jira.atypon.com/browse/LEAN-1619 happens, we'll run authenticate again each time
    // quarterback-api is called (basically doc PUTs)
    debouncedAuth = true
    useAuthStore.getState().authenticate()
    setTimeout(() => {
      debouncedAuth = false
    }, 5000)
  }
  // @TODO use non-standard authorization header while istio is enabled but not in use.
  // This means it parses all Authorization headers and fails since the quarterback API issuer
  // has not been configured with istio.
  // https://jira.atypon.com/browse/LEAN-1274
  return jwt && { 'X-Authorization': `Bearer ${jwt.token}` }
}

export async function wrappedFetch<T>(
  path: string,
  options: FetchOptions,
  defaultError = 'Request failed'
): Promise<Maybe<T>> {
  let resp
  try {
    resp = await fetch(`${QUARTERBACK_URL}/${path}`, options)
  } catch (err) {
    // Must be a connection error (?)
    console.error(err)
    return { err: 'Connection error', code: 550 }
  }
  let data
  const contentType = resp.headers.get('Content-Type')
  if (!contentType || contentType.includes('application/json')) {
    data = await resp.json()
  } else if (contentType.includes('application/octet-stream')) {
    data = await resp.arrayBuffer()
  }
  if (!resp.ok) {
    console.error(data?.message || defaultError)
    return {
      err: data?.message || defaultError,
      code: resp.status,
    }
  }
  return { data }
}

export function get<T>(
  path: string,
  defaultError?: string,
  headers: Record<string, string> = { ...DEFAULT_HEADERS, ...getAuthHeader() }
): Promise<Maybe<T>> {
  return wrappedFetch(
    path,
    {
      method: 'GET',
      headers,
    },
    defaultError
  )
}

export function post<T>(
  path: string,
  payload: any,
  defaultError?: string,
  headers: Record<string, string> = { ...DEFAULT_HEADERS, ...getAuthHeader() }
): Promise<Maybe<T>> {
  return wrappedFetch(
    path,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    },
    defaultError
  )
}

export function put<T>(
  path: string,
  payload: any,
  defaultError?: string,
  headers: Record<string, string> = { ...DEFAULT_HEADERS, ...getAuthHeader() }
): Promise<Maybe<T>> {
  return wrappedFetch(
    path,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    },
    defaultError
  )
}

export function del<T>(
  path: string,
  defaultError?: string,
  headers: Record<string, string> = { ...DEFAULT_HEADERS, ...getAuthHeader() }
): Promise<Maybe<T>> {
  return wrappedFetch(
    path,
    {
      method: 'DELETE',
      headers,
    },
    defaultError
  )
}

export function listen<T>(
  path: string,
  event: string,
  listener: (event: MessageEvent<T>) => void,
  defaultError?: string,
  headers: Record<string, string> = { ...DEFAULT_HEADERS, ...getAuthHeader() }
) {
  const evtSource = new EventSource(`${QUARTERBACK_URL}/${path}`, {
    withCredentials: true,
  })

  evtSource.addEventListener(event, listener)
}
