"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remaster = exports.saveEditorState = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
// import {
//   Commit,
//   commitFromJSON,
//   findCommitWithChanges,
// } from '@manuscripts/track-changes'
const isEqual_1 = __importDefault(require("lodash-es/isEqual"));
const api = __importStar(require("../lib/api"));
const CollectionManager_1 = __importDefault(require("../sync/CollectionManager"));
// import { getSnapshot } from './snapshot'
// interface Data {
//   snapshots: Array<RxDocument<Snapshot>>
//   modelMap: Map<string, Model>
//   doc: ManuscriptNode
//   ancestorDoc: ManuscriptNode
//   commits: Commit[]
//   snapshotID: string | null
//   commitAtLoad: Commit | null
// }
// const buildModelMapFromJson = (models: JsonModel[]): Map<string, JsonModel> => {
//   return new Map(
//     models.map((model) => {
//       if (model.objectType === ObjectTypes.Figure && model.attachment) {
//         model.src = window.URL.createObjectURL(model.attachment.data)
//       }
//       return [model._id, model]
//     })
//   )
// }
// const querySnapshots = (collection: Collection<Model>) =>
//   collection
//     .find({
//       objectType: ObjectTypes.Snapshot,
//     })
//     .exec()
//     .catch(() => {
//       throw new Error('Failed to find snapshots in project collection')
//     })
// const queryModelMap = (
//   collection: Collection<Model>,
//   containerID: string,
//   manuscriptID: string
// ) =>
//   collection
//     .find({
//       $and: [
//         { containerID },
//         {
//           $or: [{ manuscriptID }, { manuscriptID: { $exists: false } }],
//         },
//       ],
//     })
//     .exec()
//     .then((models: Array<RxDocument<Model>>) => buildModelMap(models))
//     .catch(() => {
//       throw new Error('Unable to query project collection models')
//     })
// const queryCommits = (collection: Collection<Model>, containerID: string) =>
//   collection
//     .find({
//       $and: [{ containerID }, { objectType: ObjectTypes.Commit }],
//     })
//     .exec()
//     .then((docs) => {
//       return docs.map((doc) => {
//         const json = (doc.toJSON() as unknown) as CommitJson
//         return commitFromJSON(json, schema)
//       })
//     })
//     .catch(() => {
//       throw new Error('Unable to query commits')
//     })
// interface Args {
//   projectID: string
//   manuscriptID: string
// }
// export const bootstrap = async ({
//   projectID,
//   manuscriptID,
// }: Args): Promise<Data> => {
//   const collection = collectionManager.getCollection(`project-${projectID}`)
//   const [snapshotDocs, modelMap, commits] = await Promise.all([
//     querySnapshots(collection),
//     queryModelMap(collection, projectID, manuscriptID),
//     queryCommits(collection, projectID),
//   ])
//   const snapshots = snapshotDocs
//     .map((doc) => doc.toJSON() as RxDocument<Snapshot>)
//     .sort((a, b) => b.createdAt - a.createdAt)
//   const latestSnaphot = snapshots.length ? snapshots[0] : null
//   if (!latestSnaphot || !latestSnaphot.s3Id) {
//     const decoder = new Decoder(modelMap, true)
//     const doc = decoder.createArticleNode()
//     const ancestorDoc = decoder.createArticleNode()
//     return {
//       snapshotID: null,
//       commits,
//       commitAtLoad: null,
//       snapshots,
//       modelMap,
//       doc,
//       ancestorDoc,
//     }
//   }
//   const modelsFromSnapshot = await getSnapshot(
//     projectID,
//     latestSnaphot.s3Id
//   ).catch(() => {
//     throw new Error('Failed to load snapshot')
//   })
//   const snapshotModelMap = buildModelMapFromJson(
//     modelsFromSnapshot.filter(
//       (doc: any) => !doc.manuscriptID || doc.manuscriptID === manuscriptID
//     )
//   )
//   const decoder = new Decoder(snapshotModelMap, true)
//   const doc = decoder.createArticleNode() as ManuscriptNode
//   const ancestorDoc = decoder.createArticleNode() as ManuscriptNode
//   const corrections = (getModelsByType(
//     modelMap,
//     ObjectTypes.Correction
//   ) as Correction[]).filter((corr) => corr.snapshotID === snapshots[0]._id)
//   const unrejectedCorrections = corrections
//     .filter((cor) => cor.status.label !== 'rejected')
//     .map((cor) => cor.commitChangeID || '')
//   const commitAtLoad =
//     findCommitWithChanges(commits, unrejectedCorrections) || null
//   return {
//     snapshots,
//     snapshotID: snapshots[0]._id,
//     modelMap,
//     doc,
//     ancestorDoc,
//     commits,
//     commitAtLoad,
//   }
// }
const EXCLUDED_KEYS = [
    'id',
    '_id',
    '_rev',
    '_revisions',
    'sessionID',
    'createdAt',
    'updatedAt',
    'owners',
    'manuscriptID',
    'containerID',
    'src',
    'minWordCountRequirement',
    'maxWordCountRequirement',
    'minCharacterCountRequirement',
    'maxCharacterCountRequirement',
];
const hasChanged = (a, b) => {
    return !!Object.keys(a).find((key) => {
        if (EXCLUDED_KEYS.includes(key)) {
            return false;
        }
        return !isEqual_1.default(a[key], b[key]);
    });
};
const saveEditorState = (state, modelMap, saveModel) => __awaiter(void 0, void 0, void 0, function* () {
    const models = manuscript_transform_1.encode(state.doc);
    for (const model of models.values()) {
        const oldModel = modelMap.get(model._id);
        if (!oldModel) {
            yield saveModel(model);
        }
        else if (hasChanged(model, oldModel)) {
            console.log(`Saving ${model._id}`);
            const nextModel = Object.assign(Object.assign({}, oldModel), model);
            yield saveModel(nextModel);
        }
    }
});
exports.saveEditorState = saveEditorState;
const remaster = (state, modelMap, project, saveModel) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = CollectionManager_1.default.getCollection(`project-${project._id}`);
    yield exports.saveEditorState(state, modelMap, saveModel);
    // ensure that the snapshot is created with all the saved models
    yield collection.ensurePushSync();
    yield api.remaster(project._id);
    // why? -- @TODO - move out side effects
    window.location.reload();
});
exports.remaster = remaster;
//# sourceMappingURL=bootstrap-manuscript.js.map