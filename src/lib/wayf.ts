import { Token } from './token'

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
  private readonly wayfCloudAuthHeaderKey: string
  private readonly wayfCloudAuthorizationHeaderValue: string
  private readonly wayfCloudBaseUrl: string

  constructor() {
    this.wayfCloudAuthHeaderKey = process.env
      .WAYF_CLOUD_AUTH_HEADER_KEY as string

    this.wayfCloudAuthorizationHeaderValue = process.env
      .WAYF_CLOUD_AUTHORIZATION_HEADER_VALUE as string

    this.wayfCloudBaseUrl = process.env.WAYF_BASE_URL as string
  }

  public async registerLocalId(localId: string | null) {
    const url = this.buildRegisterDeviceURL(localId)
    const request = new XMLHttpRequest()

    request.open('PATCH', url, true)

    request.setRequestHeader(
      this.wayfCloudAuthHeaderKey,
      this.wayfCloudAuthorizationHeaderValue
    )
    request.withCredentials = true
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        const event = new Event('wayf-done')
        document.dispatchEvent(event)
        if (request.status > 299) {
          throw new Error('Could not register local ID with WAYF')
        }
      }
    }
    request.send(null)
  }

  public buildRegisterDeviceURL(localId: string | null) {
    const REGISTER_DEVICE_URL_PREFIX = '/1/device/'

    return this.wayfCloudBaseUrl + REGISTER_DEVICE_URL_PREFIX + localId
  }

  public readLocalId(token: Token | null) {
    return token && token.access_token
      ? this.getWayfLocalFromJWT(token.access_token)
      : null
  }

  private getWayfLocalFromJWT = (jwt: string): string =>
    JSON.parse(atob(jwt.split('.')[1])).wayfLocal
}

export { WAYFCloudClientService }
