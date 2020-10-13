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

import { ObjectTypes, Submission } from '@manuscripts/manuscripts-json-schema'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { SubmissionItem } from '../src/components/inspector/SubmissionItem'

const submitting: Submission = {
  _id: 'MPSubmission:1',
  objectType: ObjectTypes.Submission,
  journalTitle: 'Example Journal',
  journalCode: 'example',
  status: undefined,
  submittedAt: undefined,
  manuscriptID: 'MPManuscript:1',
  containerID: 'MPPRoject:1',
  sessionID: 'storybook',
  createdAt: 0,
  updatedAt: 0,
}

const success: Submission = {
  _id: 'MPSubmission:1',
  objectType: ObjectTypes.Submission,
  journalTitle: 'Example Journal',
  journalCode: 'example',
  status: 'SUCCESS',
  submittedAt: Date.now() / 1000 - 60,
  manuscriptID: 'MPManuscript:1',
  containerID: 'MPPRoject:1',
  sessionID: 'storybook',
  createdAt: 0,
  updatedAt: 0,
}

const failure: Submission = {
  _id: 'MPSubmission:1',
  objectType: ObjectTypes.Submission,
  journalTitle: 'Example Journal',
  journalCode: 'example',
  status: 'FAILURE',
  manuscriptID: 'MPManuscript:1',
  containerID: 'MPPRoject:1',
  sessionID: 'storybook',
  createdAt: 0,
  updatedAt: 0,
}

storiesOf('SubmissionItem', module)
  .add('Submitting', () => <SubmissionItem submission={submitting} />)
  .add('Success', () => <SubmissionItem submission={success} />)
  .add('Failure', () => <SubmissionItem submission={failure} />)
