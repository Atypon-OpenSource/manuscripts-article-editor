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

import Layout from '../layout'

describe('layout state persistence', () => {
  it('get', () => {
    const loadResult = Layout.get('foo')
    expect(loadResult).toEqual({ size: 200, collapsed: false })
  })

  it('set', () => {
    const bar = {
      size: 10,
      collapsed: true,
    }
    const setResult = Layout.set('foo', bar)
    expect(setResult).toEqual(bar)
    // expect(Layout.get('foo')).toEqual(bar) // FIXME: I think this not being met is indicating a bug?
  })

  it('remove', () => {
    Layout.remove()
    const storage = window.localStorage
    expect(storage.getItem('layout')).toBeFalsy()
  })
})
