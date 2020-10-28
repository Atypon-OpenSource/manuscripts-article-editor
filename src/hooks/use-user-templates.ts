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
  ManuscriptTemplate,
  ObjectTypes,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import { useContext, useEffect, useState } from 'react'

import { DatabaseContext } from '../components/DatabaseProvider'
import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'

export const useUserTemplates = () => {
  const db = useContext(DatabaseContext)
  const [userTemplates, setUserTemplates] = useState<ManuscriptTemplate[]>([])
  const [userTemplateModels, setUserTemplateModels] = useState<
    ManuscriptModel[]
  >([])
  const [isDone, setIsDone] = useState<boolean>(false)

  useEffect(() => {
    const promiseEverything = CollectionManager.getCollection('user')
      .find({
        objectType: ObjectTypes.Project,
        templateContainer: true,
      })
      .exec()
      .then((docs) => docs.map((doc) => doc.toJSON()) as Project[])
      .then((projects) =>
        Promise.all(
          projects.map(async (project) => {
            const collection = new Collection({
              collection: `project-${project._id}`,
              channels: [`${project._id}-read`, `${project._id}-readwrite`],
              db,
            })

            let retries = 0
            while (retries <= 1) {
              try {
                await collection.initialize(false)
                await collection.syncOnce('pull')
                break
              } catch (e) {
                retries++
                console.error(e)
              }
            }

            const templates = await collection
              .find({ objectType: ObjectTypes.ManuscriptTemplate })
              .exec()
              .then((docs) =>
                docs.map((doc) => doc.toJSON() as ManuscriptTemplate)
              )
            setUserTemplates(templates)

            const models = await collection
              .find({
                templateID: {
                  $in: templates.map((template) => template._id),
                },
              })
              .exec()
              .then((docs) =>
                docs.map((doc) => doc.toJSON() as ManuscriptModel)
              )
            setUserTemplateModels(models)
            return
          })
        )
      )

    promiseEverything.then(() => setIsDone(true)).catch(() => setIsDone(true))
  }, [db])

  return {
    userTemplates,
    userTemplateModels,
    isDone,
  }
}
