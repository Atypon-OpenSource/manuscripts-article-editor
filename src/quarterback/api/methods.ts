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

import config from '../../config'

type Ok<T> = {
  data: T
}
type Error = {
  err: string
  code: number
}
type Maybe<T> = Ok<T> | Error

type FetchOptions = {
  method: string
  headers: Record<string, string>
  body?: string
}

export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

//const debouncedAuth = false

export function getAuthHeader(authToken: string) {
  return authToken && { Authorization: `Bearer ${authToken}` }
}

export async function wrappedFetch<T>(
  path: string,
  options: FetchOptions,
  defaultError = 'Request failed'
): Promise<Maybe<T>> {
  let resp
  try {
    resp = await fetch(`${config.api.url}/${path}`, options)
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
//host to your websocket server locally, we'll use the orginal wrapped fetch

export async function wrappedFetchTwo<T>(
  path: string,
  options: FetchOptions,
  defaultError = 'Request failed'
): Promise<Maybe<T>> {
  let resp
  try {
    resp = await fetch(`http://localhost:35553/api/v2/${path}`, options)
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
  authToken: string,
  defaultError?: string,
  headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...getAuthHeader(authToken),
  }
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
  authToken: string,
  payload: any,
  defaultError?: string,
  headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...getAuthHeader(authToken),
  }
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
export function postTwo<T>(
  path: string,
  authToken: string,
  payload: any,
  defaultError?: string,
  headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...getAuthHeader(authToken),
  }
): Promise<Maybe<T>> {
  return wrappedFetchTwo(
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
  authToken: string,
  payload: any,
  defaultError?: string,
  headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...getAuthHeader(authToken),
  }
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
  authToken: string,
  defaultError?: string,
  headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...getAuthHeader(authToken),
  }
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

export async function listen<T>(
  url: string,
  listener: (event: MessageEvent) => void,
  authToken: string,
  projectID: string,
  manuscriptID: string
) {
  let socket: WebSocket | null
  const connect = () => {
    if (socket) {
      socket.close()
    }
    socket = new WebSocket(url)
    socket.onopen = function () {
      console.log('WebSocket Connection Opened Ok')
      socket?.send(JSON.stringify({ authToken, projectID, manuscriptID }))
    }
    socket.onmessage = function (event) {
      listener(event)
    }
    socket.onerror = function (error) {
      console.log('WebSocket connection error: ' + error)
    }

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log('WebSocket connection closed')
      } else {
        console.log(
          'WebSocket connection closed with exit code ' +
            event.code +
            ' due to ' +
            event.reason
        )
        setTimeout(connect, 1000)
      }
    }
  }
  connect()
}
