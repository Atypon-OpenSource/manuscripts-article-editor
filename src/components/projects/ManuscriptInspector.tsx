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
import { EditorState, Transaction } from 'prosemirror-state'
import React from 'react'

import config from '../../config'
import {
  InspectorPanelTabList,
  InspectorTab,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import { LabelField } from '../inspector/LabelField'
import { InspectorSection, Subheading } from '../InspectorSection'
import { CheckboxInput } from './CheckboxInput'
import { CountInput } from './CountInput'
import { DateTimeInput } from './DateTimeInput'
import { DescriptionInput } from './DescriptionInput'
import { DOIInput } from './DOIInput'
import { KeywordsInput } from './KeywordsInput'
import { RunningTitleField } from './RunningTitleField'
import { ThemeInput } from './ThemeInput'

export type SaveModel = <T extends Model>(
  model: Partial<T> | Build<T>
) => Promise<T>

type Buildable<T> = T | Build<T>

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

export const ManuscriptInspector: React.FC<{
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveManuscript: (data: Partial<Manuscript>) => Promise<void>
  saveModel: SaveModel
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
}> = ({
  manuscript,
  modelMap,
  saveManuscript,
  saveModel,
  state,
  dispatch,
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
    minCharacterCount: getOrBuildRequirement<MinimumManuscriptCharacterCountRequirement>(
      ObjectTypes.MinimumManuscriptCharacterCountRequirement,
      manuscript.minCharacterCountRequirement
    ),
    maxCharacterCount: getOrBuildRequirement<MaximumManuscriptCharacterCountRequirement>(
      ObjectTypes.MaximumManuscriptCharacterCountRequirement,
      manuscript.maxCharacterCountRequirement
    ),
  }

  return (
    <InspectorSection title={'Manuscript'}>
      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>Metadata</InspectorTab>
          <InspectorTab>Labels</InspectorTab>
          <InspectorTab>Requirements</InspectorTab>
        </InspectorPanelTabList>

        <InspectorTabPanels>
          <InspectorTabPanel>
            {config.export.literatum && (
              <>
                <Subheading>DOI</Subheading>

                <DOIInput
                  value={manuscript.DOI}
                  handleChange={async (DOI) => {
                    await saveManuscript({
                      DOI,
                    })
                  }}
                />

                <Subheading>Running title</Subheading>

                <RunningTitleField
                  placeholder={'Running title'}
                  value={manuscript.runningTitle || ''}
                  handleChange={async (runningTitle) => {
                    await saveManuscript({
                      runningTitle,
                    })
                  }}
                />

                <Subheading>Publication Date</Subheading>

                <DateTimeInput
                  value={manuscript.publicationDate}
                  handleChange={async (publicationDate) => {
                    await saveManuscript({
                      publicationDate,
                    })
                  }}
                />

                <Subheading>Paywall</Subheading>

                <CheckboxInput
                  value={manuscript.paywall}
                  handleChange={async (paywall) => {
                    await saveManuscript({ paywall })
                  }}
                  label={'Publish behind a paywall'}
                />

                <Subheading>Abstract</Subheading>

                <DescriptionInput
                  value={manuscript.desc}
                  handleChange={async (desc) => {
                    await saveManuscript({
                      desc,
                    })
                  }}
                />

                <Subheading>Theme</Subheading>

                <ThemeInput
                  value={manuscript.layoutTheme || ''}
                  handleChange={async (layoutTheme) => {
                    await saveManuscript({
                      layoutTheme,
                    })
                  }}
                />
              </>
            )}

            <Subheading>Keywords</Subheading>

            <KeywordsInput
              manuscript={manuscript}
              modelMap={modelMap}
              saveManuscript={saveManuscript}
              saveModel={saveModel}
              state={state}
              dispatch={dispatch}
            />
          </InspectorTabPanel>

          <InspectorTabPanel>
            <LabelField
              label={'Figure Panel'}
              placeholder={'Figure'}
              value={manuscript.figureElementLabel || ''}
              handleChange={async (figureElementLabel) => {
                await saveManuscript({
                  figureElementLabel,
                })
              }}
            />

            <LabelField
              label={'Table'}
              placeholder={'Table'}
              value={manuscript.tableElementLabel || ''}
              handleChange={async (tableElementLabel) => {
                await saveManuscript({
                  tableElementLabel,
                })
              }}
            />

            <LabelField
              label={'Equation'}
              placeholder={'Equation'}
              value={manuscript.equationElementLabel || ''}
              handleChange={async (equationElementLabel) => {
                await saveManuscript({
                  equationElementLabel,
                })
              }}
            />

            <LabelField
              label={'Listing'}
              placeholder={'Listing'}
              value={manuscript.listingElementLabel || ''}
              handleChange={async (listingElementLabel) => {
                await saveManuscript({
                  listingElementLabel,
                })
              }}
            />
          </InspectorTabPanel>

          <InspectorTabPanel>
            <CountInput
              label={'Min word count'}
              placeholder={'Minimum'}
              value={requirements.minWordCount}
              handleChange={async (
                requirement: Buildable<MinimumManuscriptWordCountRequirement>
              ) => {
                await saveModel<MinimumManuscriptWordCountRequirement>(
                  requirement as MinimumManuscriptWordCountRequirement
                )

                if (requirement._id !== manuscript.minWordCountRequirement) {
                  await saveManuscript({
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
                await saveModel<MaximumManuscriptWordCountRequirement>(
                  requirement as MaximumManuscriptWordCountRequirement
                )

                if (requirement._id !== manuscript.maxWordCountRequirement) {
                  await saveManuscript({
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
                  requirement as MinimumManuscriptCharacterCountRequirement
                )

                if (
                  requirement._id !== manuscript.minCharacterCountRequirement
                ) {
                  await saveManuscript({
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
                  requirement as MaximumManuscriptCharacterCountRequirement
                )

                if (
                  requirement._id !== manuscript.maxCharacterCountRequirement
                ) {
                  await saveManuscript({
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
