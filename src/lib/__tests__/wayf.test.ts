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

import { registerWayfId } from '../wayf'

jest.mock('axios', () => ({
  patch: jest.fn((url, _x, body) => Promise.resolve(body)),
}))

describe('wayf ID registration', () => {
  it('registerWayfId', async () => {
    await expect(
      registerWayfId('foo.eyJ3YXlmTG9jYWwiOiJ4In0=', {
        key: 'wayf-key-value',
        url: 'wayf:///',
      })
    ).resolves.toMatchObject({
      headers: {
        Authorization: 'Bearer wayf-key-value',
      },
    })
  })
})
