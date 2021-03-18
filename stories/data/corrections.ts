/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2021 Atypon Systems LLC. All Rights Reserved.
 */

import { Correction } from '@manuscripts/manuscripts-json-schema'

export default [
  {
    objectType: 'MPCorrection',
    status: 'proposed',
    contributions: [
      {
        _id: 'MPContribution:B6AAAA05-C775-4E9A-BA47-89236CA330FB',
        objectType: 'MPContribution',
        profileID: 'MPUserProfile:9727207c4e8a3d406df49e9759f05d5ac84a9dcf',
        timestamp: 1612485246,
      },
    ],
    commitChangeID: '8ddb0728-09f8-4d5a-8c62-a64bcc83498e',
    containerID: 'MPProject:da2ca414-792c-4ad5-93c1-70ed9e3f217d',
    manuscriptID: 'MPManuscript:FE564D64-9120-4EE1-80E2-2938922E14BC',
    snapshotID: '41168b24-2db0-4e1b-80ee-d61be60bdd1f',
    _id: 'MPCorrection:31e60ed1-ab7a-4e35-bf67-8c0301ef109c',
    insertion: 'Lorum ipsum dolor sit amet',
  },
  {
    objectType: 'MPCorrection',
    status: 'rejected',
    contributions: [
      {
        _id: 'MPContribution:26B7E587-E201-46A0-ABE0-07F4628B3459',
        objectType: 'MPContribution',
        profileID: 'MPUserProfile:9727207c4e8a3d406df49e9759f05d5ac84a9dcf',
        timestamp: 1612485221,
      },
    ],
    commitChangeID: 'b6148a4f-e5c3-4f93-9fc1-61af0d800e43',
    containerID: 'MPProject:da2ca414-792c-4ad5-93c1-70ed9e3f217d',
    manuscriptID: 'MPManuscript:FE564D64-9120-4EE1-80E2-2938922E14BC',
    snapshotID: '41168b24-2db0-4e1b-80ee-d61be60bdd1f',
    _id: 'MPCorrection:3daea145-1111-49c6-a303-75b8a47a64b2',
    insertion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  {
    objectType: 'MPCorrection',
    contributions: [
      {
        _id: 'MPContribution:4A352B8D-996C-40F3-816B-FBC9DFC1F095',
        objectType: 'MPContribution',
        profileID: 'MPUserProfile:9727207c4e8a3d406df49e9759f05d5ac84a9dcf',
        timestamp: 1612483578,
      },
    ],
    commitChangeID: '6a7d977e-cdff-4c94-865a-6dc89a26a9bd',
    containerID: 'MPProject:da2ca414-792c-4ad5-93c1-70ed9e3f217d',
    manuscriptID: 'MPManuscript:FE564D64-9120-4EE1-80E2-2938922E14BC',
    snapshotID: '41168b24-2db0-4e1b-80ee-d61be60bdd1f',
    status: 'accepted',
    _id: 'MPCorrection:b010620d-3eb4-4bf5-87c2-4c73ca339b88',
    insertion:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
] as Correction[]
