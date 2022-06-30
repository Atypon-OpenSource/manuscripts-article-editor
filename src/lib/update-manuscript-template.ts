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
  Build,
  ContainedModel,
  fromPrototype,
  generateID,
  isManuscriptModel,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  MandatorySubsectionsRequirement,
  Manuscript,
  Model,
  ParagraphElement,
  Requirement,
  SectionCategory,
  SectionDescription,
} from '@manuscripts/manuscripts-json-schema'
import { History } from 'history'

import { state } from '../store'
import { loadBundle } from './bundles'
import { isSection } from './manuscript'
import {
  manuscriptCountRequirementFields,
  SectionCountRequirement,
  sectionCountRequirementFields,
} from './requirements'
import { SharedData } from './shared-data'
import { ManuscriptTemplateData, sectionRequirementTypes } from './templates'

interface UpdateManuscriptProps {
  bundleID: string
  data: SharedData
  projectID: string
  previousManuscript: Manuscript
  prototype?: string
  template?: ManuscriptTemplateData
  modelMap: Map<string, Model>
  history: History
  updateManuscriptTemplate: state['updateManuscriptTemplate']
}

interface ContainedIDs {
  containerID: string
  manuscriptID?: string
}

export const updateManuscriptTemplate = async ({
  bundleID,
  data,
  projectID,
  previousManuscript,
  prototype,
  template,
  modelMap,
  history,
  updateManuscriptTemplate,
}: UpdateManuscriptProps) => {
  const containerID: string = projectID
  // set the new prototype
  const manuscript = {
    ...previousManuscript,
    prototype,
  }
  // collect the models that make up the manuscript
  const dependencies: Array<Build<ContainedModel> & ContainedIDs> = []

  if (!updateManuscriptTemplate) {
    throw new Error('No update template handler was provided.')
  }

  const addDependency = <T extends Model>(
    model: Build<T>,
    containedIDs: ContainedIDs = { containerID: '' }
  ) => {
    dependencies.push({ ...model, ...containedIDs })
  }

  const addContainedModel = <T extends Model>(model: Build<T>) => {
    const containerIDs: ContainedIDs = { containerID }

    if (isManuscriptModel(model as T)) {
      containerIDs.manuscriptID = manuscript._id
    }

    addDependency(model, containerIDs)
  }

  // set the authorInstructionsURL
  if (template && template.authorInstructionsURL) {
    manuscript.authorInstructionsURL = template.authorInstructionsURL
  }

  // update the citation style bundle(s)
  const [bundle, parentBundle] = await loadBundle(bundleID)
  manuscript.bundle = bundle._id
  addContainedModel<Bundle>(bundle)

  if (parentBundle) {
    addContainedModel<Bundle>(parentBundle)
  }

  const addNewRequirement = async <S extends Requirement>(
    requirementID: string
  ): Promise<S | undefined> => {
    const requirement = data.templatesData.get(requirementID) as S | undefined

    if (requirement) {
      const newRequirement: S = {
        ...fromPrototype(requirement),
        ignored: false,
      }

      addContainedModel<Requirement>(newRequirement)

      return newRequirement
    }
  }

  if (template) {
    // save manuscript requirements
    for (const requirementField of manuscriptCountRequirementFields) {
      const requirementID = template[requirementField]

      if (requirementID) {
        const requirement = await addNewRequirement(requirementID)

        if (requirement) {
          manuscript[requirementField] = requirement._id
        }
      } else {
        manuscript[requirementField] = undefined
      }
    }
  }

  const sectionDescriptions: SectionDescription[] = []

  if (template && template.mandatorySectionRequirements) {
    for (const requirementID of template.mandatorySectionRequirements) {
      const requirement = data.templatesData.get(requirementID) as
        | MandatorySubsectionsRequirement
        | undefined

      if (requirement) {
        for (const sectionDescription of requirement.embeddedSectionDescriptions) {
          sectionDescriptions.push(sectionDescription)
        }
      }
    }
  }

  // category & section descriptions map
  const sectionDescriptionsMap: Map<string, SectionDescription> = new Map()

  if (sectionDescriptions.length) {
    for (const sectionDescription of sectionDescriptions) {
      const sectionCategory = sectionDescription.sectionCategory

      sectionDescriptionsMap.set(sectionCategory, sectionDescription)
    }
  }

  const updatedModels: Array<ManuscriptModel> = []

  // update the sections requirements
  for (const model of modelMap.values()) {
    if (isSection(model) && model.category) {
      const sectionDescription = sectionDescriptionsMap.get(model.category)
      for (const [
        sectionField,
        sectionDescriptionField,
      ] of sectionCountRequirementFields) {
        if (sectionDescription) {
          const count = sectionDescription[sectionDescriptionField]
          const objectType = sectionRequirementTypes.get(
            sectionDescriptionField
          )

          if (count !== undefined && objectType !== undefined) {
            const requirementID = model[sectionField]
            if (requirementID) {
              // update requirement
              const requirement = modelMap.get(
                requirementID
              ) as SectionCountRequirement

              if (requirement && requirement.ignored === false) {
                requirement.count = count
                updatedModels.push(requirement)
              }
            } else {
              // create requirement
              const newRequirement: Build<SectionCountRequirement> = {
                _id: generateID(objectType),
                objectType,
                count,
                severity: 0,
                ignored: false,
              }

              addContainedModel<SectionCountRequirement>(newRequirement)

              model[sectionField] = newRequirement._id
            }
          } else {
            model[sectionField] = undefined
          }
        } else {
          model[sectionField] = undefined
        }
      }

      // update placeholders
      if (sectionDescription) {
        const sectionCategory = data.sectionCategories.get(
          sectionDescription.sectionCategory
        ) as SectionCategory

        const choosePlaceholder = (): string | undefined => {
          if (sectionDescription.placeholder) {
            return sectionDescription.placeholder
          }

          if (sectionCategory && sectionCategory.desc) {
            return sectionCategory.desc
          }
        }

        const placeholder = choosePlaceholder()

        const elementIDs = model.elementIDs || []

        const paragraphElement = elementIDs.length
          ? (modelMap.get(elementIDs[0]) as ParagraphElement | undefined)
          : undefined

        if (paragraphElement) {
          paragraphElement.placeholderInnerHTML = placeholder

          updatedModels.push(paragraphElement)
        }
      }

      updatedModels.push(model)
    }
  }

  await updateManuscriptTemplate(
    dependencies,
    containerID,
    manuscript,
    updatedModels
  )

  // @TODO - move out side effect
  // history.push(`/projects/${containerID}/manuscripts/${manuscript._id}`)
}
