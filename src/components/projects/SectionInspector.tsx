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
  MaximumSectionCharacterCountRequirement,
  MaximumSectionWordCountRequirement,
  MinimumSectionCharacterCountRequirement,
  MinimumSectionWordCountRequirement,
  Model,
  ObjectTypes,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { InspectorSection, Subheading } from '../InspectorSection'
import { CountInput } from './CountInput'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

type Buildable<T> = T | Build<T>

interface Props {
  section: Section
  modelMap: Map<string, Model>
  saveModel: SaveModel
}

export interface SectionCountRequirements {
  minWordCount: Buildable<MinimumSectionWordCountRequirement>
  maxWordCount: Buildable<MaximumSectionWordCountRequirement>
  minCharacterCount: Buildable<MinimumSectionCharacterCountRequirement>
  maxCharacterCount: Buildable<MaximumSectionCharacterCountRequirement>
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

export const SectionInspector: React.FC<Props> = ({
  section,
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

  const requirements: SectionCountRequirements = {
    minWordCount: getOrBuildRequirement<MinimumSectionWordCountRequirement>(
      ObjectTypes.MinimumSectionWordCountRequirement,
      section.minWordCountRequirement
    ),
    maxWordCount: getOrBuildRequirement<MaximumSectionWordCountRequirement>(
      ObjectTypes.MaximumSectionWordCountRequirement,
      section.maxWordCountRequirement
    ),
    minCharacterCount: getOrBuildRequirement<
      MinimumSectionCharacterCountRequirement
    >(
      ObjectTypes.MinimumSectionCharacterCountRequirement,
      section.minCharacterCountRequirement
    ),
    maxCharacterCount: getOrBuildRequirement<
      MaximumSectionCharacterCountRequirement
    >(
      ObjectTypes.MaximumSectionCharacterCountRequirement,
      section.maxCharacterCountRequirement
    ),
  }

  return (
    <InspectorSection title={'Section'}>
      <Subheading>Requirements</Subheading>

      <CountInput
        label={'Min word count'}
        placeholder={'Minimum'}
        value={requirements.minWordCount}
        handleChange={async (
          requirement: Buildable<MinimumSectionWordCountRequirement>
        ) => {
          await saveModel<MinimumSectionWordCountRequirement>(requirement)

          if (requirement._id !== section.minWordCountRequirement) {
            await saveModel<Section>({
              ...section,
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
          requirement: Buildable<MaximumSectionWordCountRequirement>
        ) => {
          await saveModel<MaximumSectionWordCountRequirement>(requirement)

          if (requirement._id !== section.maxWordCountRequirement) {
            await saveModel<Section>({
              ...section,
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
          requirement: Buildable<MinimumSectionCharacterCountRequirement>
        ) => {
          await saveModel<MinimumSectionCharacterCountRequirement>(requirement)

          if (requirement._id !== section.minCharacterCountRequirement) {
            await saveModel<Section>({
              ...section,
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
          requirement: Buildable<MaximumSectionCharacterCountRequirement>
        ) => {
          await saveModel<MaximumSectionCharacterCountRequirement>(requirement)

          if (requirement._id !== section.maxCharacterCountRequirement) {
            await saveModel<Section>({
              ...section,
              maxCharacterCountRequirement: requirement._id,
            })
          }
        }}
      />
    </InspectorSection>
  )
}
