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

import {
  Build,
  generateID,
  SectionNode,
} from '@manuscripts/manuscript-transform'
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
import { Title } from '@manuscripts/title-editor'
import React, { useCallback } from 'react'
import {
  chooseSectionCategory,
  isEditableSectionCategoryID,
} from '../../lib/section-categories'
import { styled } from '../../theme/styled-components'
import {
  InspectorPanelTabList,
  InspectorTab,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import { InspectorSection, Subheading } from '../InspectorSection'
import { CategoryInput } from '../projects/CategoryInput'
import { CountInput } from '../projects/CountInput'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

type Buildable<T> = T | Build<T>

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

export const SectionInspector: React.FC<{
  dispatchNodeAttrs: (id: string, attrs: object) => void
  section: Section
  sectionNode?: SectionNode
  modelMap: Map<string, Model>
  saveModel: SaveModel
}> = ({ dispatchNodeAttrs, section, sectionNode, modelMap, saveModel }) => {
  const setTitleSuppressed = useCallback(
    (titleSuppressed: boolean) => {
      dispatchNodeAttrs(section._id, { titleSuppressed })
    },
    [section, dispatchNodeAttrs]
  )

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

  const currentSectionCategory = chooseSectionCategory(section)

  return (
    <InspectorSection title={'Section'}>
      <StyledTitle value={section.title} />

      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>General</InspectorTab>
          <InspectorTab>Requirements</InspectorTab>
        </InspectorPanelTabList>

        <InspectorTabPanels>
          <InspectorTabPanel>
            {sectionNode && 'titleSuppressed' in sectionNode.attrs && (
              <div>
                <label>
                  <input
                    type={'checkbox'}
                    checked={!section.titleSuppressed}
                    onChange={event => {
                      setTitleSuppressed(!event.target.checked)
                    }}
                  />{' '}
                  Title is shown
                </label>
              </div>
            )}

            {isEditableSectionCategoryID(currentSectionCategory) && (
              <>
                <Subheading>Category</Subheading>

                <CategoryInput
                  value={currentSectionCategory}
                  handleChange={(category: string) => {
                    dispatchNodeAttrs(section._id, { category })
                  }}
                />
              </>
            )}
          </InspectorTabPanel>

          <InspectorTabPanel>
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
                await saveModel<MinimumSectionCharacterCountRequirement>(
                  requirement
                )

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
                await saveModel<MaximumSectionCharacterCountRequirement>(
                  requirement
                )

                if (requirement._id !== section.maxCharacterCountRequirement) {
                  await saveModel<Section>({
                    ...section,
                    maxCharacterCountRequirement: requirement._id,
                  })
                }
              }}
            />
          </InspectorTabPanel>
        </InspectorTabPanels>
      </InspectorTabs>
    </InspectorSection>
  )
}

const StyledTitle = styled(Title)`
  font-size: ${props => props.theme.font.size.medium};
  margin: 4px 0;
`
