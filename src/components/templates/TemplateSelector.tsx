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

import { DEFAULT_BUNDLE } from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Model,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'

import { useUserTemplates } from '../../hooks/use-user-templates'
import { createManuscript } from '../../lib/create-manuscript'
import { loadAllSharedData, SharedData } from '../../lib/shared-data'
import {
  buildCategories,
  buildItems,
  buildResearchFields,
  chooseBundleID,
  createMergedTemplate,
  TemplateData,
} from '../../lib/templates'
import { updateManuscriptTemplate } from '../../lib/update-manuscript-template'
import { DatabaseContext } from '../DatabaseProvider'
// import { importManuscript } from '../projects/ImportManuscript'
import { PseudoProjectPage } from './PseudoProjectPage'
import { TemplateLoadingModal } from './TemplateLoadingModal'
import { TemplateSelectorModal } from './TemplateSelectorModal'

// private findDefaultColorScheme = (newStyles: Map<string, Model>) => {
//   for (const style of newStyles.values()) {
//     if (isColorScheme(style)) {
//       if (style.prototype === DEFAULT_COLOR_SCHEME) {
//         return style
//       }
//     }
//   }
// }

export interface TemplateSelectorProps {
  handleComplete: (isCancellation?: boolean) => void
  user: UserProfile
  projectID?: string
  manuscript?: Manuscript
  switchTemplate?: boolean
  modelMap?: Map<string, Model>
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  handleComplete,
  projectID,
  user,
  manuscript,
  switchTemplate,
  modelMap,
}) => {
  const db = useContext(DatabaseContext)

  const [data, setData] = useState<SharedData>()

  const history = useHistory()

  const handleCancellation = useCallback(() => {
    handleComplete(true)
  }, [handleComplete])

  const { userTemplates, userTemplateModels, isDone } = useUserTemplates()

  useEffect(() => {
    if (isDone) {
      if (userTemplates && userTemplateModels) {
        loadAllSharedData(userTemplates, userTemplateModels)
          .then(setData)
          .catch((error) => {
            // TODO: display error message
            console.error(error)
          })
      }
    }
  }, [userTemplates, userTemplateModels, isDone])

  // const importManuscriptModels = useMemo(
  //   () => importManuscript(db, history, user, handleComplete, projectID),
  //   [db, history, user, handleComplete, projectID]
  // )

  const categories = useMemo(
    () => (data ? buildCategories(data.manuscriptCategories) : undefined),
    [data]
  )

  const researchFields = useMemo(
    () => (data ? buildResearchFields(data.researchFields) : undefined),
    [data]
  )

  const items = useMemo(() => (data ? buildItems(data) : undefined), [data])

  // TODO: refactor most of this to a separate module

  const createEmpty = useCallback(async () => {
    if (!data) {
      throw new Error('Data not loaded')
    }

    await createManuscript({
      analyticsTemplateName: '(empty)',
      bundleID: DEFAULT_BUNDLE,
      data,
      db,
      history,
      projectID,
      user,
    })

    handleComplete()
  }, [data, projectID, user, db, history, handleComplete])

  // TODO: refactor most of this to a separate module
  const selectTemplate = useCallback(
    async (item: TemplateData) => {
      if (!data) {
        throw new Error('Data not loaded')
      }

      // merge the templates
      const template = item.template
        ? createMergedTemplate(item.template, data.manuscriptTemplates)
        : undefined

      switchTemplate && manuscript && projectID && modelMap
        ? await updateManuscriptTemplate({
            bundleID: chooseBundleID(item),
            data,
            db,
            projectID,
            previousManuscript: manuscript,
            prototype: item.template?._id,
            template,
            modelMap,
            history,
          })
        : await createManuscript({
            addContent: true,
            analyticsTemplateName: item.title,
            bundleID: chooseBundleID(item),
            data,
            db,
            history,
            projectID,
            prototype: item.template?._id,
            template,
            user,
          })

      handleComplete()
    },
    [
      data,
      projectID,
      user,
      db,
      history,
      handleComplete,
      switchTemplate,
      manuscript,
      modelMap,
    ]
  )

  if (!data || !categories || !researchFields || !items) {
    return (
      <TemplateLoadingModal
        handleCancel={handleCancellation}
        status={'Thinking…'}
      />
    )
  }

  return (
    <>
      {!projectID && <PseudoProjectPage />}

      <TemplateSelectorModal
        categories={categories}
        createEmpty={createEmpty}
        handleComplete={handleCancellation}
        // importManuscript={importManuscriptModels}
        items={items}
        researchFields={researchFields}
        selectTemplate={selectTemplate}
        switchTemplate={switchTemplate}
      />
    </>
  )
}

export default TemplateSelector
