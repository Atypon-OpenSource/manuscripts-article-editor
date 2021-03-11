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
  buildModelMap,
  Decoder,
  encode,
  getModelsByType,
  ManuscriptEditorState,
  ManuscriptNode,
  schema,
} from '@manuscripts/manuscript-transform'
import {
  Commit as CommitJson,
  Correction,
  Model,
  ObjectTypes,
  Project,
  Snapshot,
} from '@manuscripts/manuscripts-json-schema'
import { RxDocument } from '@manuscripts/rxdb'
import {
  Commit,
  commitFromJSON,
  findCommitWithChanges,
} from '@manuscripts/track-changes'

import { buildSnapshot } from '../hooks/use-snapshot-manager'
import * as api from '../lib/snapshot'
import { exportProject } from '../pressroom/exporter'
import { JsonModel } from '../pressroom/importers'
import { Collection } from '../sync/Collection'
import collectionManager from '../sync/CollectionManager'
import { getSnapshot } from './snapshot'

interface Data {
  snapshots: Array<RxDocument<Snapshot>>
  modelMap: Map<string, Model>
  doc: ManuscriptNode
  ancestorDoc: ManuscriptNode
  commits: Commit[]
  snapshotID: string | null
  commitAtLoad: Commit | null
}

const buildModelMapFromJson = (models: JsonModel[]): Map<string, JsonModel> => {
  return new Map(
    models.map((model) => {
      if (model.objectType === ObjectTypes.Figure && model.attachment) {
        model.src = window.URL.createObjectURL(model.attachment.data)
      }
      return [model._id, model]
    })
  )
}

const querySnapshots = (collection: Collection<Model>) =>
  collection
    .find({
      objectType: ObjectTypes.Snapshot,
    })
    .exec()
    .catch(() => {
      throw new Error('Failed to find snapshots in project collection')
    })

const queryModelMap = (
  collection: Collection<Model>,
  containerID: string,
  manuscriptID: string
) =>
  collection
    .find({
      $and: [
        { containerID },
        {
          $or: [{ manuscriptID }, { manuscriptID: { $exists: false } }],
        },
      ],
    })
    .exec()
    .then((models: Array<RxDocument<Model>>) => buildModelMap(models))
    .catch(() => {
      throw new Error('Unable to query project collection models')
    })

const queryCommits = (collection: Collection<Model>, containerID: string) =>
  collection
    .find({
      $and: [{ containerID }, { objectType: ObjectTypes.Commit }],
    })
    .exec()
    .then((docs) => {
      return docs.map((doc) => {
        const json = (doc.toJSON() as unknown) as CommitJson
        return commitFromJSON(json, schema)
      })
    })
    .catch(() => {
      throw new Error('Unable to query commits')
    })

interface Args {
  projectID: string
  manuscriptID: string
}

export const bootstrap = async ({
  projectID,
  manuscriptID,
}: Args): Promise<Data> => {
  const collection = collectionManager.getCollection(`project-${projectID}`)

  const [snapshotDocs, modelMap, commits] = await Promise.all([
    querySnapshots(collection),
    queryModelMap(collection, projectID, manuscriptID),
    queryCommits(collection, projectID),
  ])

  const snapshots = snapshotDocs
    .map((doc) => doc.toJSON() as RxDocument<Snapshot>)
    .sort((a, b) => b.createdAt - a.createdAt)

  const latestSnaphotID = snapshots.length ? snapshots[0].s3Id : null

  if (!latestSnaphotID) {
    const decoder = new Decoder(modelMap, true)
    const doc = decoder.createArticleNode()
    const ancestorDoc = decoder.createArticleNode()
    return {
      snapshotID: null,
      commits,
      commitAtLoad: null,
      snapshots,
      modelMap,
      doc,
      ancestorDoc,
    }
  }

  const modelsFromSnapshot = await getSnapshot(
    projectID,
    latestSnaphotID
  ).catch(() => {
    throw new Error('Failed to load snapshot')
  })
  const snapshotModelMap = buildModelMapFromJson(
    modelsFromSnapshot.filter(
      (doc: any) => !doc.manuscriptID || doc.manuscriptID === manuscriptID
    )
  )
  const decoder = new Decoder(snapshotModelMap, true)
  const doc = decoder.createArticleNode() as ManuscriptNode
  const ancestorDoc = decoder.createArticleNode() as ManuscriptNode

  const corrections = (getModelsByType(
    modelMap,
    ObjectTypes.Correction
  ) as Correction[]).filter((corr) => corr.snapshotID === latestSnaphotID)

  const unrejectedCorrections = corrections
    .filter((cor) => cor.status !== 'rejected')
    .map((cor) => cor.commitChangeID || '')

  const commitAtLoad =
    findCommitWithChanges(commits, unrejectedCorrections) || null

  return {
    snapshots,
    snapshotID: latestSnaphotID,
    modelMap,
    doc,
    ancestorDoc,
    commits,
    commitAtLoad,
  }
}

// TODO: Most likely this will be executed server-side, left here for now because
// we need to be able to do it somewhere.
export const remaster = async (
  state: ManuscriptEditorState,
  project: Project
) => {
  const collection = collectionManager.getCollection(`project-${project._id}`)

  const models = encode(state.doc)

  for (const model of models.values()) {
    await collection.save(model)
  }

  const blob = await exportProject(
    collection.getAttachmentAsBlob,
    models,
    null,
    'manuproj',
    project
  )
  const data = await api.takeSnapshot(project._id, blob)

  const snapshot = buildSnapshot(data, `Snapshot of ${Date.now() / 1000}`)

  await collection.save(snapshot)

  window.location.reload()
}
