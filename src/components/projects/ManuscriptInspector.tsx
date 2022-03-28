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
  MaximumManuscriptCharacterCountRequirement,
  MaximumManuscriptWordCountRequirement,
  MinimumManuscriptCharacterCountRequirement,
  MinimumManuscriptWordCountRequirement,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { EditorState, Transaction } from 'prosemirror-state'
import React, { useCallback } from 'react'

import config from '../../config'
import { ManuscriptCountRequirementType } from '../../lib/requirements'
import { ManuscriptTemplateData } from '../../lib/templates'
import { useStore } from '../../store'
import {
  InspectorPanelTabList,
  InspectorTab,
  InspectorTabPanel,
  InspectorTabPanels,
  InspectorTabs,
} from '../Inspector'
import { LabelField } from '../inspector/LabelField'
import {
  ChooseButton,
  CitationStyle,
  InspectorValue,
} from '../inspector/ManuscriptStyleInspector'
import { InspectorSection, Subheading } from '../InspectorSection'
import { useModal } from '../ModalHookableProvider'
import TemplateSelector from '../templates/TemplateSelector'
import { CategorisedKeywordsInput } from './CategorisedKeywordsInput'
import { CheckboxInput } from './CheckboxInput'
import { CountInput } from './CountInput'
import { DateTimeInput } from './DateTimeInput'
import { DescriptionInput } from './DescriptionInput'
import { DOIInput } from './DOIInput'
import { KeywordsInput } from './KeywordsInput'
import { RunningTitleField } from './RunningTitleField'
import { ThemeInput } from './ThemeInput'
import { URLInput } from './URLInput'

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
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
  openTemplateSelector?: (newProject: boolean, switchTemplate: boolean) => void
  getTemplate: (templateID: string) => ManuscriptTemplateData | undefined
  getManuscriptCountRequirements: (
    templateID: string
  ) => Map<ManuscriptCountRequirementType, number | undefined>
  canWrite?: boolean
  leanWorkflow?: boolean
}> = ({
  state,
  dispatch,
  // pageLayout,
  openTemplateSelector,
  getTemplate,
  getManuscriptCountRequirements,
  canWrite,
  leanWorkflow,
}) => {
  const [
    { manuscript, modelMap, saveManuscript, saveModel, user, project },
  ] = useStore((store) => ({
    manuscript: store.manuscript,
    modelMap: store.modelMap,
    saveManuscript: store.saveManuscript,
    saveModel: store.saveModel,
    deleteModel: store.deleteModel,
    user: store.user,
    project: store.project,
  }))

  const authorInstructionsURL = manuscript.authorInstructionsURL
    ? manuscript.authorInstructionsURL
    : manuscript.prototype
    ? getTemplate(manuscript.prototype)?.authorInstructionsURL
    : undefined

  const getOrBuildRequirement = <T extends CountRequirement>(
    objectType: ManuscriptCountRequirementType,
    id?: string,
    prototype?: string
  ): T | Build<T> => {
    if (id && modelMap.has(id)) {
      return modelMap.get(id) as T
    }

    // infer requirement from the manuscript prototype
    const count = prototype
      ? getManuscriptCountRequirements(prototype)?.get(objectType)
      : undefined

    return buildCountRequirement<T>(objectType, count, count ? false : true)
  }

  const requirements: ManuscriptCountRequirements = {
    minWordCount: getOrBuildRequirement<MinimumManuscriptWordCountRequirement>(
      ObjectTypes.MinimumManuscriptWordCountRequirement,
      manuscript.minWordCountRequirement,
      manuscript.prototype
    ),
    maxWordCount: getOrBuildRequirement<MaximumManuscriptWordCountRequirement>(
      ObjectTypes.MaximumManuscriptWordCountRequirement,
      manuscript.maxWordCountRequirement,
      manuscript.prototype
    ),
    minCharacterCount: getOrBuildRequirement<MinimumManuscriptCharacterCountRequirement>(
      ObjectTypes.MinimumManuscriptCharacterCountRequirement,
      manuscript.minCharacterCountRequirement,
      manuscript.prototype
    ),
    maxCharacterCount: getOrBuildRequirement<MaximumManuscriptCharacterCountRequirement>(
      ObjectTypes.MaximumManuscriptCharacterCountRequirement,
      manuscript.maxCharacterCountRequirement,
      manuscript.prototype
    ),
  }

  const manuscriptFigureElementLabelChangeHandler = useCallback(
    async (figureElementLabel) => {
      await saveManuscript({
        figureElementLabel,
      })
    },
    [saveManuscript]
  )

  const manuscriptTableElementLabelChangeHandler = useCallback(
    async (tableElementLabel) => {
      await saveManuscript({
        tableElementLabel,
      })
    },
    [saveManuscript]
  )

  const manuscriptEquationElementLabelChangeHandler = useCallback(
    async (equationElementLabel) => {
      await saveManuscript({
        equationElementLabel,
      })
    },
    [saveManuscript]
  )

  const manuscriptListingElementLabelChangeHandler = useCallback(
    async (listingElementLabel) => {
      await saveManuscript({
        listingElementLabel,
      })
    },
    [saveManuscript]
  )

  const { addModal } = useModal()

  const openTemplateSelectorHandler = (
    newProject?: boolean,
    switchTemplate?: boolean
  ) => {
    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        projectID={newProject ? undefined : project._id}
        user={user}
        handleComplete={handleClose}
        manuscript={manuscript}
        switchTemplate={switchTemplate}
        modelMap={modelMap}
      />
    ))
  }

  return (
    <InspectorSection title={'Manuscript'}>
      <InspectorTabs>
        <InspectorPanelTabList>
          <InspectorTab>Metadata</InspectorTab>
          {!leanWorkflow && <InspectorTab>Labels</InspectorTab>}
          {!leanWorkflow && <InspectorTab>Requirements</InspectorTab>}
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

                {!leanWorkflow && (
                  <>
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
              </>
            )}

            <Subheading>Keywords</Subheading>

            {config.keywordsCategories ? (
              <CategorisedKeywordsInput target={manuscript} />
            ) : (
              <KeywordsInput state={state} dispatch={dispatch} />
            )}
            {!leanWorkflow && (
              <>
                <Subheading>Author Instruction URL</Subheading>

                <URLInput
                  handleChange={async (authorInstructionsURL) => {
                    await saveManuscript({
                      authorInstructionsURL,
                    })
                  }}
                  value={authorInstructionsURL}
                />
              </>
            )}
            {config.features.switchTemplate && canWrite && (
              <>
                <Subheading>Template</Subheading>
                <InspectorValue
                  onClick={() =>
                    openTemplateSelector
                      ? openTemplateSelector(false, true)
                      : openTemplateSelectorHandler(false, true)
                  }
                >
                  <CitationStyle
                    value={
                      manuscript.prototype
                        ? getTemplate(manuscript.prototype)?.title
                        : ''
                    }
                  />
                  <ChooseButton mini={true}>Choose</ChooseButton>
                </InspectorValue>
              </>
            )}
          </InspectorTabPanel>

          <InspectorTabPanel>
            <LabelField
              label={'Figure Panel'}
              placeholder={'Figure'}
              value={manuscript.figureElementLabel || ''}
              handleChange={manuscriptFigureElementLabelChangeHandler}
            />

            <LabelField
              label={'Table'}
              placeholder={'Table'}
              value={manuscript.tableElementLabel || ''}
              handleChange={manuscriptTableElementLabelChangeHandler}
            />

            <LabelField
              label={'Equation'}
              placeholder={'Equation'}
              value={manuscript.equationElementLabel || ''}
              handleChange={manuscriptEquationElementLabelChangeHandler}
            />

            <LabelField
              label={'Listing'}
              placeholder={'Listing'}
              value={manuscript.listingElementLabel || ''}
              handleChange={manuscriptListingElementLabelChangeHandler}
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
