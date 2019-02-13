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

import { newestFirst, oldestFirst } from '../sort'

describe('sorting', () => {
  it('newestFirst', () => {
    // tslint:disable-next-line:no-any
    const x = { createdAt: 0 } as any
    // tslint:disable-next-line:no-any
    const y = { createdAt: 1 } as any
    // tslint:disable-next-line:no-any
    const z = { createdAt: 2 } as any
    expect(newestFirst(x, y)).toBeGreaterThan(0)
    expect(newestFirst(y, x)).toBeLessThan(0)
    expect([x, z, y].sort(newestFirst)).toMatchObject([z, y, x])
    expect([z, y, x].sort(newestFirst)).toMatchObject([z, y, x])
  })

  it('oldestFirst', () => {
    // tslint:disable-next-line:no-any
    const x = { createdAt: 0 } as any
    // tslint:disable-next-line:no-any
    const y = { createdAt: 1 } as any
    // tslint:disable-next-line:no-any
    const z = { createdAt: 2 } as any
    expect(oldestFirst(x, y)).toBeLessThan(0)
    expect(oldestFirst(y, x)).toBeGreaterThan(0)
    expect([x, z, y].sort(oldestFirst)).toMatchObject([x, y, z])
    expect([z, y, x].sort(oldestFirst)).toMatchObject([x, y, z])
  })
})
