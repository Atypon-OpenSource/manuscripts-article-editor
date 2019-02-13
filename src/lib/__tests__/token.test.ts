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

import TokenStore from '../token'

describe('token', () => {
  // all of get, set, remove all in one test call
  // such as to make test ordering not be a factor in success.
  it('get and set', () => {
    expect(TokenStore.get()).toBeFalsy()

    const token = 'bar'
    expect(TokenStore.set(token)).toEqual(token)
    expect(TokenStore.get()).toEqual(token)

    TokenStore.remove()
    expect(TokenStore.get()).toBe(null)
  })
})
