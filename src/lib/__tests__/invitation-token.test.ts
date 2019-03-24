/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import InvitationTokenStore from '../invitation-token'

describe('token', () => {
  // all of get, set, remove all in one test call
  // such as to make test ordering not be a factor in success.
  it('get and set', () => {
    expect(InvitationTokenStore.get()).toBeFalsy()

    const token = 'bar'
    expect(InvitationTokenStore.set(token)).toEqual(token)
    expect(InvitationTokenStore.get()).toEqual(token)

    InvitationTokenStore.remove()
    expect(InvitationTokenStore.get()).toBe(null)
  })
})
