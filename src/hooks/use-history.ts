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

import { Decoder, ManuscriptNode } from '@manuscripts/manuscript-transform'
import {
  Manuscript,
  Model,
  ObjectTypes,
  Snapshot,
} from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from '@manuscripts/rxdb'
import { useCallback, useEffect, useState } from 'react'

import { getSnapshot } from '../lib/snapshot'
import { JsonModel } from '../pressroom/importers'
import CollectionManager from '../sync/CollectionManager'
import { usePullComplete } from './use-pull-complete'

export enum SnapshotStatus {
  Ready = 'ready',
  Loading = 'loading',
  Done = 'done',
  Error = 'error',
  Writing = 'writing',
}

interface HookValue {
  snapshotsList: Array<RxDocument<Snapshot>>
  loadSnapshot: (remoteID: string, manuscriptID: string) => void
  loadSnapshotStatus: SnapshotStatus
  currentSnapshot: {
    manuscripts: Manuscript[]
    modelMap: Map<string, JsonModel>
    doc: ManuscriptNode
  } | null
}

const buildModelMap = (models: JsonModel[]): Map<string, JsonModel> => {
  return new Map(
    models.map((model) => {
      if (model.objectType === ObjectTypes.Figure && model.attachment) {
        model.src = window.URL.createObjectURL(model.attachment.data)
      }
      return [model._id, model]
    })
  )
}

export const useHistory = (projectID: string): HookValue => {
  const collection = CollectionManager.getCollection(`project-${projectID}`)
  const isPullComplete = usePullComplete(`project-${projectID}`)

  const [snapshotsList, setSnapshotsList] = useState<
    Array<RxDocument<Snapshot>>
  >([])
  const [loadSnapshotStatus, setLoadSnapshotStatus] = useState<SnapshotStatus>(
    SnapshotStatus.Ready
  )
  const [current, setCurrent] = useState<HookValue['currentSnapshot']>(null)

  useEffect(() => {
    if (!collection || !isPullComplete) {
      return
    }

    const subscription = collection
      .find({
        objectType: ObjectTypes.Snapshot,
      })
      .$.subscribe((docs) => {
        if (!docs) {
          return
        }
        const models = docs
          .map((doc) => doc.toJSON() as RxDocument<Snapshot>)
          .filter((doc) => doc.creator)
          .sort((a, b) => b.createdAt - a.createdAt)
        setSnapshotsList(models)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [collection, isPullComplete])

  const loadSnapshot = useCallback(
    (remoteID: string, manuscriptID: string) => {
      setLoadSnapshotStatus(SnapshotStatus.Loading)
      return getSnapshot(projectID, remoteID)
        .then((res) => {
          const manuscripts = res.filter(
            (model: Model) => model.objectType === ObjectTypes.Manuscript
          ) as Manuscript[]
          const modelMap = buildModelMap(
            res.filter(
              (doc: any) =>
                !doc.manuscriptID || doc.manuscriptID === manuscriptID
            )
          )
          const decoder = new Decoder(modelMap, true)
          const doc = decoder.createArticleNode() as ManuscriptNode
          setLoadSnapshotStatus(SnapshotStatus.Done)
          setCurrent({
            doc,
            modelMap,
            manuscripts,
          })
        })
        .catch(() => {
          setLoadSnapshotStatus(SnapshotStatus.Error)
        })
    },
    [projectID]
  )

  return {
    snapshotsList,
    loadSnapshot,
    loadSnapshotStatus,
    currentSnapshot: current,
  }
}
