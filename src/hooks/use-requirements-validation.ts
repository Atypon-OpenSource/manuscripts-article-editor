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
  buildValidation,
  ManuscriptEditorState,
} from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Model,
  ObjectTypes,
  Project,
  RequirementsValidation,
  RequirementsValidationData,
} from '@manuscripts/manuscripts-json-schema'
import { AnyValidationResult } from '@manuscripts/requirements'
import { useEffect, useState } from 'react'

import { buildQualityCheck } from '../components/requirements/RequirementsInspector'
import CollectionManager from '../sync/CollectionManager'
import { useIdlePropEffect } from './use-idle-prop-effect'
import { usePullComplete } from './use-pull-complete'

interface Args {
  project: Project
  manuscript: Manuscript
  modelMap: Map<string, Model>
  state: ManuscriptEditorState
}

export const useRequirementsValidation = ({
  project,
  manuscript,
  modelMap,
  state,
}: Args) => {
  const isPullComplete = usePullComplete(`project-${project._id}`)

  const [doc, setDoc] = useState<RequirementsValidation | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>()

  const collection = CollectionManager.getCollection(`project-${project._id}`)
  const prototypeID = manuscript.prototype

  useEffect(() => {
    if (isPullComplete) {
      const subscription = collection
        .find({
          manuscriptID: manuscript._id,
          objectType: ObjectTypes.RequirementsValidation,
        })
        .$.subscribe((docs) => {
          setLoaded(true)
          if (!docs || !docs.length) {
            return
          }

          const doc = docs[0].toJSON() as RequirementsValidation
          setDoc(doc)
        })
      return () => {
        subscription.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project._id, isPullComplete, manuscript._id])

  useIdlePropEffect(
    () => {
      buildQualityCheck(modelMap, prototypeID, manuscript._id, {
        validateImageFiles: false,
      })
        .then((results) => {
          // make sure not to create multiple documents
          if (!loaded) {
            return
          }

          const nextDoc = doc
            ? {
                ...doc,
                results,
              }
            : buildValidation(results as RequirementsValidationData[])

          setError(null)
          return collection.save(nextDoc, {
            containerID: project._id,
            manuscriptID: manuscript._id,
          })
        })
        .catch((err) => {
          setError(err)
        })
    },
    [state],
    1000
  )

  return { result: (doc?.results || []) as AnyValidationResult[], error }
}
