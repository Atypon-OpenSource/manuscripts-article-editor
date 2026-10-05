/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */

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
