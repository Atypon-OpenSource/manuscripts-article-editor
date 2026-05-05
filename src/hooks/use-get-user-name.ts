/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */
import { Project, UserProfile } from '@manuscripts/transform'
import { HostUser } from 'src/store'
import { getUserRole } from '../lib/roles'

export const useGetUserName = () => {
    
}

const buildAuthorName = (user: UserProfile | undefined, project: Project, hostUsers: HostUser[], collaboratorsById: Map<string, UserProfile>, full = false) => {
  if (!user) {
    return ''
  }
  const hostUser = hostUsers.find(u => u.connectID === user.connectID)
  const role = getUserRole(project, user.userID) || 'User'
  return [GetName(hostUser, role, full), GetSurname(user, hostUser, collaboratorsById, full)]
    .filter(Boolean)
    .join(' ')
}

function GetName(user: HostUser | undefined, role: string, full = false) {
  const name = user?.firstName
  if (!name) {
    return full ? role : (role as string)[0] 
  }
  return full ? name : name[0]
}
function GetSurname(
  user: UserProfile,
  hostUser: HostUser | undefined,
  collaboratorsById: Map<string, UserProfile>,
  full = false
) {
  const familyName = hostUser?.lastName
  return familyName ? (full ? familyName : familyName[0]) : [...collaboratorsById.keys()].indexOf(user._id)  // index throughout the project is normally stable

}