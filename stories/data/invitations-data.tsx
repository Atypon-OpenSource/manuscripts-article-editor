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

import { timestamp } from '@manuscripts/manuscript-transform'
import { ContainerInvitation } from '@manuscripts/manuscripts-json-schema'

export const invitations: ContainerInvitation[] = [
  {
    _id: 'ContainerInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
    invitedUserEmail: 'lmessi@atypon.com',
    invitedUserName: 'Lionel Messi',
    invitingUserID: 'User|pcoutinho@atypon.com',
    invitingUserProfile: {
      _id: 'MPUserProfile:1',
      objectType: 'MPUserProfile',
      userID: 'User_pcoutinho@atypon.com',
      bibliographicName: {
        _id: 'MPBibliographicName:1',
        objectType: 'MPBibliographicName',
        given: 'Lionel',
        family: 'Messi',
      },
      createdAt: timestamp(),
      updatedAt: timestamp(),
    },
    containerID: 'MPProject:2D9BC3CE-D75D-429F-AE8B-3459269785D5',
    containerTitle: 'Breadth First Search Algorithm',
    message: 'message',
    role: 'Writer',
    objectType: 'MPContainerInvitation',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
  {
    _id: 'ContainerInvitation|2da9a8bc004083daea2b2746a5414b18f318f547',
    invitedUserEmail: 'lmessi@atypon.com',
    invitingUserID: 'User|pcoutinho@atypon.com',
    invitingUserProfile: {
      _id: 'MPUserProfile:2',
      objectType: 'MPUserProfile',
      userID: 'User_pcoutinho@atypon.com',
      bibliographicName: {
        _id: 'MPBibliographicName:1',
        objectType: 'MPBibliographicName',
        given: 'Philippe',
        family: 'Coutinho',
      },
      createdAt: timestamp(),
      updatedAt: timestamp(),
    },
    containerID: 'MPProject:C8C7A84A-0927-4240-B83E-F5290C829BDB',
    message: 'message',
    role: 'Writer',
    objectType: 'MPContainerInvitation',
    createdAt: timestamp(),
    updatedAt: timestamp(),
  },
]
