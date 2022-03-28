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

import { ManuscriptModel } from '@manuscripts/manuscript-transform'
import {
  MandatorySubsectionsRequirement,
  ManuscriptTemplate,
  SectionDescription,
} from '@manuscripts/manuscripts-json-schema'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  ManuscriptCountRequirement,
  manuscriptCountRequirementFieldsMap,
  ManuscriptCountRequirementType,
  SectionCountRequirementMaps,
  sectionDescriptionCountRequirementFieldsMap,
} from '../lib/requirements'
import { loadAllSharedData, SharedData } from '../lib/shared-data'
import {
  buildItems,
  createMergedTemplate,
  ManuscriptTemplateData,
} from '../lib/templates'
import { useStore } from '../store'

export const useSharedData = () => {
  const [data, setData] = useState<SharedData>()

  const [{ userTemplates, userTemplateModels }, setUserData] = useState<{
    userTemplates?: ManuscriptTemplate[]
    userTemplateModels?: ManuscriptModel[]
  }>({})
  const [getUserTemplates] = useStore((store) => store.getUserTemplates)

  useEffect(() => {
    if (getUserTemplates) {
      getUserTemplates()
        .then(({ userTemplateModels, userTemplates }) => {
          setUserData({ userTemplateModels, userTemplates })
        })
        .catch((e) => console.log(e))
    }
  }, [getUserTemplates])

  useEffect(() => {
    if (userTemplates && userTemplateModels) {
      loadAllSharedData(userTemplates, userTemplateModels)
        .then(setData)
        .catch((error) => {
          // TODO: display error message
          console.error(error)
        })
    }
  }, [userTemplates, userTemplateModels])

  const items = useMemo(() => (data ? buildItems(data) : undefined), [data])
  const getRequirement = useCallback(
    (requirementID: string) => {
      return data ? data.templatesData.get(requirementID) : undefined
    },
    [data]
  )

  const getTemplate = useCallback(
    (templateID: string) => {
      if (!items || !items.length) {
        return
      }
      for (const item of items) {
        if (item.template && item.template._id === templateID) {
          // merge the templates
          const template = createMergedTemplate(
            item.template,
            data!.manuscriptTemplates
          )
          return template
        }
      }
    },
    [items, data]
  )

  /**
   * Returns a map of key/value pairs from the passed template id.
   * Expects the key/value pair to be the manuscript count requirement type as the keys and the count number as the corresponding values.
   * */
  const getManuscriptCountRequirements = useCallback(
    (templateID: string) => {
      const template = getTemplate(templateID) as ManuscriptTemplateData
      const requirements = new Map<
        ManuscriptCountRequirementType,
        number | undefined
      >()
      if (template) {
        for (const [
          manuscriptCountRequirementField,
          manuscriptCountRequirementType,
        ] of manuscriptCountRequirementFieldsMap) {
          const requirementID = template[manuscriptCountRequirementField]

          if (requirementID) {
            const requirement = getRequirement(
              requirementID
            ) as ManuscriptCountRequirement

            if (requirement) {
              requirements.set(
                manuscriptCountRequirementType,
                requirement.count
              )
            }
          }
        }
      }

      return requirements
    },
    [getRequirement, getTemplate]
  )

  /**
   * Returns a map of key/value pairs from the passed template id.
   * Expects the key/value pair to be the sections categories as the keys
   * and another map (a map containing the section count requirement type as the keys and the count number as the corresponding values) as the corresponding values.
   */
  const getSectionCountRequirements = useCallback(
    (templateID: string) => {
      const template = getTemplate(templateID) as ManuscriptTemplateData
      const sectionDescriptions: SectionDescription[] = []
      if (template && template.mandatorySectionRequirements) {
        for (const requirementID of template.mandatorySectionRequirements) {
          const requirement = getRequirement(
            requirementID
          ) as MandatorySubsectionsRequirement

          if (requirement) {
            for (const sectionDescription of requirement.embeddedSectionDescriptions) {
              sectionDescriptions.push(sectionDescription)
            }
          }
        }
      }

      const requirements: SectionCountRequirementMaps = {}

      for (const sectionDescription of sectionDescriptions) {
        if (sectionDescription.sectionCategory) {
          for (const [
            sectionDescriptionField,
            sectionCountRequirementType,
          ] of sectionDescriptionCountRequirementFieldsMap) {
            const count = sectionDescription[sectionDescriptionField]
            if (!requirements[sectionDescription.sectionCategory]) {
              requirements[sectionDescription.sectionCategory] = new Map<
                string,
                number | undefined
              >()
            }
            requirements[sectionDescription.sectionCategory].set(
              sectionCountRequirementType,
              count
            )
          }
        }
      }
      return requirements
    },
    [getRequirement, getTemplate]
  )

  return {
    getTemplate,
    getRequirement,
    getManuscriptCountRequirements,
    getSectionCountRequirements,
  }
}
