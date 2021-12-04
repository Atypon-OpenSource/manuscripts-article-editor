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
import { insertSectionLabel } from '@manuscripts/manuscript-editor'
import {
  Build,
  generateID,
  isSectionLabelNode,
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
import { TextField } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import { EditorState, Transaction } from 'prosemirror-state'
import React, { useCallback, useState } from 'react'
import useInterval from 'react-useinterval'
import styled from 'styled-components'

import { SectionCountRequirementMaps } from '../../lib/requirements'
import {
  chooseSectionCategory,
  findFirstParagraph,
  isEditableSectionCategoryID,
} from '../../lib/section-categories'
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
import { PageBreakInput } from '../projects/PageBreakInput'

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

type Buildable<T> = T | Build<T>

export interface SectionCountRequirements {
  minWordCount: Buildable<MinimumSectionWordCountRequirement>
  maxWordCount: Buildable<MaximumSectionWordCountRequirement>
  minCharCount: Buildable<MinimumSectionCharacterCountRequirement>
  maxCharacterCount: Buildable<MaximumSectionCharacterCountRequirement>
}

const buildCountRequirement = <T extends CountRequirement>(
  objectType: ObjectTypes,
  count?: number,
  ignored?: boolean,
  severity = 0
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
  dispatchNodeAttrs: (
    id: string,
    attrs: Record<string, unknown>,
    nodispatch?: boolean
  ) => Transaction | undefined
  section: Section
  sectionNode?: SectionNode
  modelMap: Map<string, Model>
  saveModel: SaveModel
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
  getSectionCountRequirements: (
    templateID: string
  ) => SectionCountRequirementMaps
}> = ({
  dispatchNodeAttrs,
  section,
  sectionNode,
  modelMap,
  saveModel,
  state,
  dispatch,
  getSectionCountRequirements,
}) => {
  const firstParagraph = findFirstParagraph(section, modelMap)

  const [placeholder, setPlaceholder] = useState<string | undefined>(
    firstParagraph ? firstParagraph.placeholderInnerHTML : undefined
  )

  useInterval(() => {
    if (firstParagraph && placeholder !== firstParagraph.placeholderInnerHTML) {
      dispatchNodeAttrs(firstParagraph._id, {
        placeholder,
      })
    }
  }, 500)

  const [titleSuppressed, setTitleSuppressed] = useState<boolean>(
    !!section.titleSuppressed
  )

  const updateTitleSuppressed = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const nextTitleSuppressed = !e.target.checked
      setTitleSuppressed(nextTitleSuppressed)
      dispatchNodeAttrs(section._id, { titleSuppressed: nextTitleSuppressed })
    },
    [section, dispatchNodeAttrs]
  )

  const updateGeneratedLabel = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const isGenerated = !e.target.checked
      // setGeneratedLabel(isGenerated)

      const tr = dispatchNodeAttrs(
        section._id,
        {
          generatedLabel: isGenerated,
        },
        !isGenerated
      )
      if (!isGenerated) {
        let existingLabel = null
        sectionNode?.descendants((node) => {
          if (isSectionLabelNode(node)) {
            existingLabel = node
          }
        })
        if (!existingLabel) {
          insertSectionLabel(state, dispatch, tr)
        } else if (tr) {
          dispatch(tr)
        }
      }
    },
    [section, dispatchNodeAttrs, state, dispatch, sectionNode]
  )

  // requirements

  const getOrBuildRequirement = <T extends CountRequirement>(
    objectType: ObjectTypes,
    manuscriptID: string,
    category?: string,
    id?: string
  ): T | Build<T> => {
    if (id && modelMap.has(id)) {
      return modelMap.get(id) as T
    }

    // infer requirement from the manuscript prototype
    let count = undefined
    if (manuscriptID && category) {
      const manuscript = modelMap.get(manuscriptID)
      count = manuscript?.prototype
        ? getSectionCountRequirements(manuscript?.prototype)[category]?.get(
            objectType
          )
        : undefined
    }

    return buildCountRequirement<T>(objectType, count, count ? false : true)
  }

  const requirements: SectionCountRequirements = {
    minWordCount: getOrBuildRequirement<MinimumSectionWordCountRequirement>(
      ObjectTypes.MinimumSectionWordCountRequirement,
      section.manuscriptID,
      section.category,
      section.minWordCountRequirement
    ),
    maxWordCount: getOrBuildRequirement<MaximumSectionWordCountRequirement>(
      ObjectTypes.MaximumSectionWordCountRequirement,
      section.manuscriptID,
      section.category,
      section.maxWordCountRequirement
    ),
    minCharCount: getOrBuildRequirement<MinimumSectionCharacterCountRequirement>(
      ObjectTypes.MinimumSectionCharacterCountRequirement,
      section.manuscriptID,
      section.category,
      section.minCharacterCountRequirement
    ),
    maxCharacterCount: getOrBuildRequirement<MaximumSectionCharacterCountRequirement>(
      ObjectTypes.MaximumSectionCharacterCountRequirement,
      section.manuscriptID,
      section.category,
      section.maxCharacterCountRequirement
    ),
  }

  const currentSectionCategory = chooseSectionCategory(section)
  return (
    <InspectorSection title={'Section'}>
      {section.title && <StyledTitle value={section.title} />}

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
                    checked={!titleSuppressed}
                    onChange={updateTitleSuppressed}
                  />{' '}
                  Title is shown
                </label>
              </div>
            )}
            {sectionNode && 'generatedLabel' in sectionNode.attrs && (
              <div>
                <label>
                  <input
                    type={'checkbox'}
                    checked={sectionNode.attrs.generatedLabel === false}
                    onChange={updateGeneratedLabel}
                  />{' '}
                  Use custom label
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

            <Subheading>Placeholder</Subheading>

            <PlaceholderInput
              value={placeholder}
              onChange={(event) => {
                setPlaceholder(event.target.value)
              }}
            />

            <Subheading>Page Break</Subheading>

            <PageBreakInput
              value={section.pageBreakStyle}
              handleChange={(pageBreakStyle: number) => {
                dispatchNodeAttrs(section._id, { pageBreakStyle })
              }}
            />
          </InspectorTabPanel>

          <InspectorTabPanel>
            <CountInput
              label={'Min word count'}
              placeholder={'Minimum'}
              value={requirements.minWordCount}
              handleChange={async (
                requirement: Buildable<MinimumSectionWordCountRequirement>
              ) => {
                await saveModel<MinimumSectionWordCountRequirement>(
                  requirement as MinimumSectionWordCountRequirement
                )

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
                await saveModel<MaximumSectionWordCountRequirement>(
                  requirement as MaximumSectionWordCountRequirement
                )

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
              value={requirements.minCharCount}
              handleChange={async (
                requirement: Buildable<MinimumSectionCharacterCountRequirement>
              ) => {
                await saveModel<MinimumSectionCharacterCountRequirement>(
                  requirement as MinimumSectionCharacterCountRequirement
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
                  requirement as MaximumSectionCharacterCountRequirement
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
  color: ${(props) => props.theme.colors.text.primary};
  margin: 4px 0;
`

export const PlaceholderInput = styled(TextField)`
  width: 100%;
  padding: 4px 8px;
  font-size: 1em;
`
