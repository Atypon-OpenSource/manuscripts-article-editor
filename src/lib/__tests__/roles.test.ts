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

import { Project } from '@manuscripts/transform'

import { getUserRole, isOwner, isViewer, isWriter, ProjectRole } from '../roles'

describe('roles', () => {
  const project: Project = {
    owners: ['User_A'],
    viewers: ['User_B'],
    writers: ['User_C'],
  } as Project

  it('isOwner must return true if the user is an owner', () =>
    expect(isOwner(project, 'User_A')).toBeTruthy())

  it('isOwner must return false if the user is not an owner', () =>
    expect(isOwner(project, 'User_D')).toBeFalsy())

  it('isWriter must return true if the user is a writer', () =>
    expect(isWriter(project, 'User_C')).toBeTruthy())

  it('isWriter must return false if the user is not a writer', () =>
    expect(isWriter(project, 'User_D')).toBeFalsy())

  it('isViewer must return true if the user is a viewer', () =>
    expect(isViewer(project, 'User_B')).toBeTruthy())

  it('isViewer must return false if the user is not a viewer', () =>
    expect(isViewer(project, 'User_D')).toBeFalsy())

  it('getRole must return owner if the user is an owner', () =>
    expect(getUserRole(project, 'User_A')).toBe(ProjectRole.owner))

  it('getRole must return writer if the user is a writer', () =>
    expect(getUserRole(project, 'User_C')).toBe(ProjectRole.writer))

  it('getRole must return viewer if the user is a viewer', () =>
    expect(getUserRole(project, 'User_B')).toBe(ProjectRole.viewer))

  it('getRole must return null if the user not in the project', () =>
    expect(getUserRole(project, 'User_D')).toBeNull())
})
