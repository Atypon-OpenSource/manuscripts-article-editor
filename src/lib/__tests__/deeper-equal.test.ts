/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

import deeperEqual from '../deeper-equal'

describe('deeperEqual', () => {
  describe('unchanged selections', () => {
    it.each([undefined, null, false, 0, ''])(
      'must be true when the selection stays %p',
      (value) => expect(deeperEqual(value, value)).toBe(true)
    )

    it('must be true when the selection stays the same truthy primitive', () => {
      expect(deeperEqual('title', 'title')).toBe(true)
      expect(deeperEqual(1, 1)).toBe(true)
      expect(deeperEqual(true, true)).toBe(true)
    })

    it('must be true when the selection is the same reference', () => {
      const object = { view: {} }
      const map = new Map([['a', 1]])
      const array = [1, 2]

      expect(deeperEqual(object, object)).toBe(true)
      expect(deeperEqual(map, map)).toBe(true)
      expect(deeperEqual(array, array)).toBe(true)
    })
  })

  describe('changed selections', () => {
    it('must be false when a falsy selection becomes truthy', () => {
      expect(deeperEqual(undefined, 'title')).toBe(false)
      expect(deeperEqual(false, true)).toBe(false)
      expect(deeperEqual(0, 1)).toBe(false)
    })

    it('must be false when a truthy selection becomes falsy', () => {
      expect(deeperEqual('title', undefined)).toBe(false)
      expect(deeperEqual(true, false)).toBe(false)
      expect(deeperEqual(1, 0)).toBe(false)
    })

    it('must be false when one falsy value replaces another', () => {
      expect(deeperEqual(undefined, null)).toBe(false)
      expect(deeperEqual(false, 0)).toBe(false)
    })

    it('must not throw when an object or map selection becomes nullish', () => {
      expect(deeperEqual({ id: 'a' }, null)).toBe(false)
      expect(deeperEqual(null, { id: 'a' })).toBe(false)
      expect(deeperEqual(new Map([['a', 1]]), null)).toBe(false)
      expect(deeperEqual(new Map([['a', 1]]), undefined)).toBe(false)
    })
  })

  describe('one level deeper', () => {
    it('must compare object values one level deep', () => {
      expect(deeperEqual({ id: 'a' }, { id: 'a' })).toBe(true)
      expect(deeperEqual({ id: 'a' }, { id: 'b' })).toBe(false)
      expect(deeperEqual({ id: { a: 1 } }, { id: { a: 1 } })).toBe(false)
    })

    it('must compare map entries one level deep', () => {
      expect(deeperEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true)
      expect(deeperEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false)
      expect(deeperEqual(new Map([['a', 1]]), new Map())).toBe(false)
    })

    it('must compare array items one level deep', () => {
      expect(deeperEqual([1, 2], [1, 2])).toBe(true)
      expect(deeperEqual([1, 2], [1, 3])).toBe(false)
      expect(deeperEqual([1, 2], [1])).toBe(false)
    })
  })
})
