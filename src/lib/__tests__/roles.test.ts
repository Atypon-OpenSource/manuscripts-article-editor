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

import { Project } from '@manuscripts/manuscripts-json-schema'
import { getUserRole, isOwner, isViewer, isWriter, ProjectRole } from '../roles'

describe('roles', () => {
  // tslint:disable-next-line:no-object-literal-type-assertion
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
