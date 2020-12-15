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

import axios from 'axios'

import config from '../config'
import { importProjectArchive, ProjectDump } from '../pressroom/importers'
import { fetchProjectScopedToken } from './api'

const client = axios.create({
  baseURL: config.shackles.url,
  timeout: 30000,
})

export const takeSnapshot = async (
  projectID: string,
  blob: Blob
): Promise<{ creator: string; key: string; proof: string[] }> => {
  const { data: jwk } = await fetchProjectScopedToken(projectID, 'shackles')

  const form = new FormData()
  form.append('file', blob, 'snapshot.manuproj')

  const res = await client.post(`/snapshot`, form, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${jwk}`,
    },
  })

  return {
    ...res.data,
    proof: [],
  }
}

export const takeKeyframe = (
  json: ProjectDump
): Promise<{ creator: string; key: string }> => {
  return client.post('/keyframe', json)
}

export const getSnapshot = async (projectID: string, key: string) => {
  const { data: jwk } = await fetchProjectScopedToken(projectID, 'shackles')

  const res = await client.get(`/snapshot/${key}`, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${jwk}`,
    },
  })
  return importProjectArchive(res.data)
}
