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

import { ascendingPriority } from '../sort'

describe('sorting', () => {
  test('ascending priority', () => {
    const x = { priority: 0 } as any
    const y = { priority: 1 } as any
    const z = { priority: 2 } as any

    expect(ascendingPriority(y, x)).toBeGreaterThan(0)
    expect(ascendingPriority(x, y)).toBeLessThan(0)

    expect([x, z, y].sort(ascendingPriority)).toMatchObject([x, y, z])
    expect([z, y, x].sort(ascendingPriority)).toMatchObject([x, y, z])
  })
})
