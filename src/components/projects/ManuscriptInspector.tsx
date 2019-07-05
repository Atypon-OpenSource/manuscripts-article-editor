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

import { Build, generateID } from '@manuscripts/manuscript-transform'
import {
  CountRequirement,
  Manuscript,
  MaximumManuscriptCharacterCountRequirement,
  MaximumManuscriptWordCountRequirement,
  MinimumManuscriptCharacterCountRequirement,
  MinimumManuscriptWordCountRequirement,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { InspectorSection, Subheading } from '../InspectorSection'
import { CountInput } from './CountInput'

export type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

type Buildable<T> = T | Build<T>

interface Props {
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveModel: SaveModel
}

export interface ManuscriptCountRequirements {
  minWordCount: Buildable<MinimumManuscriptWordCountRequirement>
  maxWordCount: Buildable<MaximumManuscriptWordCountRequirement>
  minCharacterCount: Buildable<MinimumManuscriptCharacterCountRequirement>
  maxCharacterCount: Buildable<MaximumManuscriptCharacterCountRequirement>
}

const buildCountRequirement = <T extends CountRequirement>(
  objectType: ObjectTypes,
  count?: number,
  ignored?: boolean,
  severity: number = 0
): Build<T> => {
  const item = {
    _id: generateID(objectType),
    objectType,
    count,
    ignored,
    severity,
  }

  return item as Build<T>
}

export const ManuscriptInspector: React.FC<Props> = ({
  manuscript,
  modelMap,
  saveModel,
  // pageLayout,
}) => {
  const getOrBuildRequirement = <T extends CountRequirement>(
    objectType: ObjectTypes,
    id?: string
  ): T | Build<T> => {
    if (id && modelMap.has(id)) {
      return modelMap.get(id) as T
    }

    return buildCountRequirement<T>(objectType)
  }

  const requirements: ManuscriptCountRequirements = {
    minWordCount: getOrBuildRequirement<MinimumManuscriptWordCountRequirement>(
      ObjectTypes.MinimumManuscriptWordCountRequirement,
      manuscript.minWordCountRequirement
    ),
    maxWordCount: getOrBuildRequirement<MaximumManuscriptWordCountRequirement>(
      ObjectTypes.MaximumManuscriptWordCountRequirement,
      manuscript.maxWordCountRequirement
    ),
    minCharacterCount: getOrBuildRequirement<
      MinimumManuscriptCharacterCountRequirement
    >(
      ObjectTypes.MinimumManuscriptCharacterCountRequirement,
      manuscript.minCharacterCountRequirement
    ),
    maxCharacterCount: getOrBuildRequirement<
      MaximumManuscriptCharacterCountRequirement
    >(
      ObjectTypes.MaximumManuscriptCharacterCountRequirement,
      manuscript.maxCharacterCountRequirement
    ),
  }

  return (
    <InspectorSection title={'Manuscript'}>
      <Subheading>Requirements</Subheading>

      <CountInput
        label={'Min word count'}
        placeholder={'Minimum'}
        value={requirements.minWordCount}
        handleChange={async (
          requirement: Buildable<MinimumManuscriptWordCountRequirement>
        ) => {
          await saveModel<MinimumManuscriptWordCountRequirement>(requirement)

          if (requirement._id !== manuscript.minWordCountRequirement) {
            await saveModel<Manuscript>({
              ...manuscript,
              minWordCountRequirement: requirement._id,
            })
          }
        }}
      />

      <CountInput
        label={'Max word count'}
        placeholder={'Maximum'}
        value={requirements.maxWordCount}
        handleChange={async (
          requirement: Buildable<MaximumManuscriptWordCountRequirement>
        ) => {
          await saveModel<MaximumManuscriptWordCountRequirement>(requirement)

          if (requirement._id !== manuscript.maxWordCountRequirement) {
            await saveModel<Manuscript>({
              ...manuscript,
              maxWordCountRequirement: requirement._id,
            })
          }
        }}
      />

      <CountInput
        label={'Min character count'}
        placeholder={'Minimum'}
        value={requirements.minCharacterCount}
        handleChange={async (
          requirement: Buildable<MinimumManuscriptCharacterCountRequirement>
        ) => {
          await saveModel<MinimumManuscriptCharacterCountRequirement>(
            requirement
          )

          if (requirement._id !== manuscript.minCharacterCountRequirement) {
            await saveModel<Manuscript>({
              ...manuscript,
              minCharacterCountRequirement: requirement._id,
            })
          }
        }}
      />

      <CountInput
        label={'Max character count'}
        placeholder={'Maximum'}
        value={requirements.maxCharacterCount}
        handleChange={async (
          requirement: Buildable<MaximumManuscriptCharacterCountRequirement>
        ) => {
          await saveModel<MaximumManuscriptCharacterCountRequirement>(
            requirement
          )

          if (requirement._id !== manuscript.maxCharacterCountRequirement) {
            await saveModel<Manuscript>({
              ...manuscript,
              maxCharacterCountRequirement: requirement._id,
            })
          }
        }}
      />
    </InspectorSection>
  )
}
