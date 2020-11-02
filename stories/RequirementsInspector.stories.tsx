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

import { RequirementsProvider } from '@manuscripts/manuscript-editor'
import {
  ContainedModel,
  hasObjectType,
} from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  MaximumManuscriptCharacterCountRequirement,
  MaximumManuscriptWordCountRequirement,
  MaximumSectionCharacterCountRequirement,
  MaximumSectionWordCountRequirement,
  MinimumManuscriptCharacterCountRequirement,
  MinimumManuscriptWordCountRequirement,
  MinimumSectionCharacterCountRequirement,
  MinimumSectionWordCountRequirement,
  Model,
  ObjectTypes,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { RequirementsInspector } from '../src/components/requirements/RequirementsInspector'
import { modelMap } from './data/doc'

const maximumManuscriptWordCountRequirement: MaximumManuscriptWordCountRequirement = {
  _id: 'MaximumManuscriptWordCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMaximumManuscriptWordCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 1000,
}
modelMap.set(
  maximumManuscriptWordCountRequirement._id,
  maximumManuscriptWordCountRequirement
)

const minimumManuscriptWordCountRequirement: MinimumManuscriptWordCountRequirement = {
  _id: 'MinimumManuscriptWordCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMinimumManuscriptWordCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 100,
}
modelMap.set(
  minimumManuscriptWordCountRequirement._id,
  minimumManuscriptWordCountRequirement
)

const maximumManuscriptCharacterCountRequirement: MaximumManuscriptCharacterCountRequirement = {
  _id: 'MaximumManuscriptCharacterCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMaximumManuscriptCharacterCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 10000,
}
modelMap.set(
  maximumManuscriptCharacterCountRequirement._id,
  maximumManuscriptCharacterCountRequirement
)

const minimumManuscriptCharacterCountRequirement: MinimumManuscriptCharacterCountRequirement = {
  _id: 'MinimumManuscriptCharacterCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMinimumManuscriptCharacterCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 1000,
}
modelMap.set(
  minimumManuscriptCharacterCountRequirement._id,
  minimumManuscriptCharacterCountRequirement
)

const maximumSectionWordCountRequirement: MaximumSectionWordCountRequirement = {
  _id: 'MaximumSectionWordCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMaximumSectionWordCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 1000,
}
modelMap.set(
  maximumSectionWordCountRequirement._id,
  maximumSectionWordCountRequirement
)

const minimumSectionWordCountRequirement: MinimumSectionWordCountRequirement = {
  _id: 'MinimumSectionWordCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMinimumSectionWordCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 100,
}
modelMap.set(
  minimumSectionWordCountRequirement._id,
  minimumSectionWordCountRequirement
)

const maximumSectionCharacterCountRequirement: MaximumSectionCharacterCountRequirement = {
  _id: 'MaximumSectionCharacterCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMaximumSectionCharacterCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 10000,
}
modelMap.set(
  maximumSectionCharacterCountRequirement._id,
  maximumSectionCharacterCountRequirement
)

const minimumSectionCharacterCountRequirement: MinimumSectionCharacterCountRequirement = {
  _id: 'MinimumSectionCharacterCountRequirement:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPMinimumSectionCharacterCountRequirement',
  createdAt: 0,
  updatedAt: 0,
  sessionID: 'foo',
  severity: 0,
  count: 1000,
}
modelMap.set(
  minimumSectionCharacterCountRequirement._id,
  minimumSectionCharacterCountRequirement
)

const isSection = (model: Model): model is Section =>
  model.objectType === ObjectTypes.Section

for (const model of modelMap.values()) {
  if (isSection(model)) {
    // model.maxWordCountRequirement = maximumSectionWordCountRequirement._id
    model.minWordCountRequirement = minimumSectionWordCountRequirement._id
    model.maxCharacterCountRequirement =
      maximumSectionCharacterCountRequirement._id
    // model.minCharacterCountRequirement =
    //   minimumSectionCharacterCountRequirement._id
  }
}

const isManuscript = hasObjectType<Manuscript>(ObjectTypes.Manuscript)

const manuscript = [...modelMap.values()].find(isManuscript) as Manuscript

manuscript.maxWordCountRequirement = maximumManuscriptWordCountRequirement._id
// manuscript.minWordCountRequirement = minimumManuscriptWordCountRequirement._id
// manuscript.maxCharacterCountRequirement =
//   maximumManuscriptCharacterCountRequirement._id
// manuscript.minCharacterCountRequirement =
//   minimumManuscriptCharacterCountRequirement._id

// const prototypeId =
//   'MPManuscriptTemplate:www-zotero-org-styles-bmc-cell-biology-BMC-Cell-Biology-Journal-Publication'

modelMap.set(manuscript._id, manuscript)

const bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    resolve()
  })
}

storiesOf('Inspector/Requirements', module).add('validations', () => (
  <RequirementsProvider modelMap={modelMap}>
    <RequirementsInspector
      modelMap={modelMap}
      manuscriptID={manuscript._id}
      prototypeId={manuscript.prototype}
      bulkUpdate={bulkUpdate}
    />
  </RequirementsProvider>
))
