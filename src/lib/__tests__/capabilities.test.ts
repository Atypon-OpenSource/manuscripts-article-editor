/*!
 * © 2026 Atypon Systems LLC
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
import { describe, expect, test } from 'vitest'

import { getCapabilities } from '../capabilities'

describe('getCapabilities', () => {
  test('reads kebab-case action strings, not camelCase', () => {
    const can = getCapabilities([
      'edit-article',
      'handle-suggestion',
      'handle-others-comments',
    ])

    expect(can.editArticle).toBe(true)
    expect(can.handleSuggestion).toBe(true)
    expect(can.handleOthersComments).toBe(true)
  })

  test('does not match the old camelCase strings', () => {
    const can = getCapabilities(['editArticle', 'handleSuggestion'])

    expect(can.editArticle).toBe(false)
    expect(can.handleSuggestion).toBe(false)
  })

  test('unlisted actions default to false', () => {
    const can = getCapabilities(['edit-article'])

    expect(can.formatArticle).toBe(false)
    expect(can.resolveOthersComment).toBe(false)
  })
})
