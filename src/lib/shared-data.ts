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

import {
  Bundle,
  ManuscriptCategory,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  Publisher,
  ResearchField,
  SectionCategory,
  StatusLabel,
} from '@manuscripts/manuscripts-json-schema'

import { Requirement } from './requirements'
import { Style } from './styles'
import { TemplatesDataType } from './templates'

export interface SharedData {
  bundles: Map<string, Bundle>
  // contributorRoles: Map<string, ContributorRole>
  manuscriptCategories: Map<string, ManuscriptCategory>
  manuscriptTemplates: Map<string, ManuscriptTemplate>
  publishers: Map<string, Publisher>
  researchFields: Map<string, ResearchField>
  sectionCategories: Map<string, SectionCategory>
  styles: Map<string, Style>
  // statusLabels: Map<string, StatusLabel>
  templatesData: Map<string, TemplatesDataType>
  userManuscriptTemplates: Map<string, ManuscriptTemplate>
}

export const importSharedData = <T extends Model>(file: string) =>
  import(`@manuscripts/data/dist/shared/${file}.json`)
    .then((module) => module.default as T[])
    .then(
      (items) =>
        new Map<string, T>(
          items.map<[string, T]>((item) => [item._id, item])
        )
    )

export const loadAllSharedData = async (
  userTemplates?: ManuscriptTemplate[],
  userTemplateModels?: Model[]
): Promise<SharedData> => {
  // bundled template data
  const templatesData = await importSharedData<TemplatesDataType>(
    'templates-v2'
  )

  // manuscript templates
  const manuscriptTemplates = new Map<string, ManuscriptTemplate>()

  for (const item of templatesData.values()) {
    if (item.objectType === ObjectTypes.ManuscriptTemplate) {
      manuscriptTemplates.set(item._id, item)
    }
  }

  // bundles
  const bundles = await importSharedData<Bundle>('bundles')

  // manuscript categories
  const manuscriptCategories = await importSharedData<ManuscriptCategory>(
    'manuscript-categories'
  )

  // publishers
  const publishers = await importSharedData<Publisher>('publishers')

  // section categories
  const sectionCategories = await importSharedData<SectionCategory>(
    'section-categories'
  )

  // styles
  const styles = await importSharedData<Style>('styles')

  // keywords
  const keywords = await importSharedData<ResearchField | StatusLabel>(
    'keywords'
  )

  const researchFields = new Map<string, ResearchField>()
  // const statusLabels = new Map<string, StatusLabel>()

  for (const item of keywords.values()) {
    switch (item.objectType) {
      case ObjectTypes.ResearchField:
        researchFields.set(item._id, item)
        break

      // case ObjectTypes.StatusLabel:
      //   statusLabels.set(item._id, item)
      //   break
    }
  }

  // contributor roles
  // const contributorRoles = await importSharedData<ContributorRole>(
  //   'contributor-roles'
  // )

  const userManuscriptTemplates = new Map<string, ManuscriptTemplate>()

  if (userTemplates && userTemplateModels) {
    // user manuscript templates
    for (const item of userTemplates) {
      userManuscriptTemplates.set(item._id, item)
    }

    // user template models
    for (const model of userTemplateModels) {
      switch (model.objectType) {
        case ObjectTypes.Bundle:
          bundles.set(model._id, model as Bundle)
          break

        case ObjectTypes.AuxiliaryObjectReferenceStyle:
        case ObjectTypes.BorderStyle:
        case ObjectTypes.CaptionStyle:
        case ObjectTypes.Color:
        case ObjectTypes.ColorScheme:
        case ObjectTypes.FigureStyle:
        case ObjectTypes.PageLayout:
        case ObjectTypes.ParagraphStyle:
        case ObjectTypes.TableStyle:
          styles.set(model._id, model as Style)
          break

        default:
          if (model.objectType.endsWith('Requirement')) {
            templatesData.set(model._id, model as Requirement)
          }
          // TODO: anything else?
          break
      }
    }
  }

  return {
    bundles,
    // contributorRoles,
    manuscriptCategories,
    manuscriptTemplates,
    publishers,
    researchFields,
    sectionCategories,
    styles,
    templatesData,
    userManuscriptTemplates,
    // statusLabels,
  }
}
