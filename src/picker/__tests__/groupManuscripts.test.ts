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

import { Manuscript, Project } from '@manuscripts/manuscripts-json-schema'

import { groupManuscripts } from '../Picker'

const manuscript: Manuscript = {
  _id: 'example-1',
  containerID: 'project-1',
  objectType: 'MPManuscript',
  title:
    'Landscape genomic prediction for restoration of a <em>Eucalyptus</em> foundation species under climate change',
  createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
  updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
  bundle: 'MPBundle:www-zotero-org-styles-apa-5th-edition',
  primaryLanguageCode: 'en-GB',
}

const project: Project = {
  _id: 'project-1',
  objectType: 'MPProject',
  title: 'An example project',
  createdAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
  updatedAt: Math.floor(new Date('2018-01-22T08:00:00Z').getTime() / 1000),
  owners: ['user_1'],
  writers: [],
  viewers: [],
}

// @TODO make test more explanatory to the purpose of the function - test if the first element is a string
describe('Picker', () => {
  test('groupManuscripts', () => {
    const manuscripts = [manuscript]
    const projects = [project]
    const expectedArray = [project.title, manuscript]
    expect(groupManuscripts(manuscripts, projects)).toEqual(
      expect.arrayContaining(expectedArray)
    )
  })

  test('groupManuscripts empty data', () => {
    expect(groupManuscripts([], [])).toEqual(expect.arrayContaining([]))
  })
})
