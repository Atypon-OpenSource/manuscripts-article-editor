/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { ObjectTypes, Section } from '@manuscripts/manuscripts-json-schema'

import { chooseSectionCategory } from '../section-categories'

describe('section categories', () => {
  test('choose defined section category', () => {
    const section: Section = {
      _id: 'MPSection:1',
      objectType: ObjectTypes.Section,
      title: 'Introduction',
      category: 'MPSectionCategory:introduction',
      priority: 0,
      path: ['MPSection:1'],
      manuscriptID: 'MPManuscript:1',
      containerID: 'MPProject:1',
      sessionID: 'test',
      createdAt: 0,
      updatedAt: 0,
    }

    const result = chooseSectionCategory(section)

    expect(result).toBe('MPSectionCategory:introduction')
  })

  test('choose default section category', () => {
    const section: Section = {
      _id: 'MPSection:1',
      objectType: ObjectTypes.Section,
      title: 'Introduction',
      priority: 0,
      path: ['MPSection:1'],
      manuscriptID: 'MPManuscript:1',
      containerID: 'MPProject:1',
      sessionID: 'test',
      createdAt: 0,
      updatedAt: 0,
    }

    const result = chooseSectionCategory(section)

    expect(result).toBe('MPSectionCategory:section')
  })

  test('choose default subsection category', () => {
    const section: Section = {
      _id: 'MPSection:1A',
      objectType: ObjectTypes.Section,
      title: 'Introduction',
      priority: 0,
      path: ['MPSection:1', 'MPSection:1A'],
      manuscriptID: 'MPManuscript:1',
      containerID: 'MPProject:1',
      sessionID: 'test',
      createdAt: 0,
      updatedAt: 0,
    }

    const result = chooseSectionCategory(section)

    expect(result).toBe('MPSectionCategory:subsection')
  })
})
