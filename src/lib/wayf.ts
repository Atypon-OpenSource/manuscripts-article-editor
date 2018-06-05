import axios from 'axios'
import token from './token'

/*
 * Copyright 2017 Atypon Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class WAYFCloudClientService {
  private readonly wayfCloudAuthorizationHeaderValue: string
  private readonly wayfCloudBaseUrl: string

  constructor(
    wayfCloudAuthorizationHeaderValue: string,
    wayfCloudBaseUrl: string
  ) {
    this.wayfCloudAuthorizationHeaderValue = wayfCloudAuthorizationHeaderValue
    this.wayfCloudBaseUrl = wayfCloudBaseUrl
  }

  public async registerLocalId() {
    const localId = this.parseIdFromToken()
    if (localId) {
      return axios.patch(this.wayfCloudBaseUrl + localId, null, {
        headers: {
          Authorization: this.wayfCloudAuthorizationHeaderValue,
        },
      })
    }
  }

  private parseIdFromToken() {
    const data = token.get()

    return data && data.access_token
      ? JSON.parse(atob(data.access_token.split('.')[1])).wayfLocal
      : null
  }
}

export { WAYFCloudClientService }
