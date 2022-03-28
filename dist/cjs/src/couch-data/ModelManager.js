"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const track_changes_1 = require("@manuscripts/track-changes");
const errors_1 = require("../lib/errors");
const snapshot_1 = require("../lib/snapshot");
const Collection_1 = require("../sync/Collection");
const collections_1 = require("./collections");
class ModelManager {
    constructor(modelMap, setModelsState, manuscriptID, projectID, collection, userCollection, snapshots, commits, db) {
        this.buildModelMapFromJson = (models) => {
            return new Map(models.map((model) => {
                if (model.objectType === manuscripts_json_schema_1.ObjectTypes.Figure && model.attachment) {
                    model.src = window.URL.createObjectURL(model.attachment.data);
                }
                return [model._id, model];
            }));
        };
        this.saveDependenciesForNew = (dependencies, collection) => __awaiter(this, void 0, void 0, function* () {
            const results = yield collection.bulkCreate(dependencies);
            const failures = results.filter(Collection_1.isBulkDocsError);
            if (failures.length) {
                throw new errors_1.BulkCreateError(failures);
            }
        });
        this.getAttachment = (id, attachmentID) => __awaiter(this, void 0, void 0, function* () {
            const attachment = yield this.collection.getAttachmentAsBlob(id, attachmentID);
            return attachment;
        });
        this.putAttachment = (id, attachment) => {
            return this.collection.putAttachment(id, attachment).then(() => undefined);
        };
        this.saveNewManuscript = (dependencies, containerID, manuscript, newProject) => __awaiter(this, void 0, void 0, function* () {
            if (newProject) {
                yield collections_1.createAndPushNewProject(newProject);
            }
            const collection = yield collections_1.createProjectCollection(this.db, containerID);
            yield this.saveDependenciesForNew(dependencies, collection);
            yield collection.create(manuscript, { containerID });
            return Promise.resolve(manuscript);
        });
        this.updateManuscriptTemplate = (dependencies, containerID, manuscript, updatedModels) => __awaiter(this, void 0, void 0, function* () {
            const collection = yield collections_1.createProjectCollection(this.db, containerID);
            // save the manuscript dependencies
            const results = yield collection.bulkCreate(dependencies);
            const failures = results.filter(Collection_1.isBulkDocsError);
            if (failures.length) {
                throw new errors_1.BulkCreateError(failures);
            }
            // save the updated models
            for (const model of updatedModels) {
                yield collection.save(model);
            }
            // save the manuscript
            yield collection.save(manuscript);
            return Promise.resolve(manuscript);
        });
        this.getUserTemplates = () => __awaiter(this, void 0, void 0, function* () {
            const userTemplates = [];
            const userTemplateModels = [];
            const promiseEverything = this.userCollection
                .find({
                objectType: manuscripts_json_schema_1.ObjectTypes.Project,
                templateContainer: true,
            })
                .exec()
                .then((docs) => docs.map((doc) => doc.toJSON()))
                .then((projects) => Promise.all(projects.map((project) => __awaiter(this, void 0, void 0, function* () {
                const collection = new Collection_1.Collection({
                    collection: `project-${project._id}`,
                    channels: [`${project._id}-read`, `${project._id}-readwrite`],
                    db: this.db,
                });
                let retries = 0;
                while (retries <= 1) {
                    try {
                        yield collection.initialize(false);
                        yield collection.syncOnce('pull');
                        break;
                    }
                    catch (e) {
                        retries++;
                        console.error(e);
                    }
                }
                const templates = yield collection
                    .find({ objectType: manuscripts_json_schema_1.ObjectTypes.ManuscriptTemplate })
                    .exec()
                    .then((docs) => docs.map((doc) => doc.toJSON()));
                userTemplates.push(...templates);
                const models = yield collection
                    .find({
                    templateID: {
                        $in: templates.map((template) => template._id),
                    },
                })
                    .exec()
                    .then((docs) => docs.map((doc) => doc.toJSON()));
                userTemplateModels.push(...models);
                return;
            }))));
            yield promiseEverything;
            return { userTemplates, userTemplateModels };
        });
        this.getTools = () => __awaiter(this, void 0, void 0, function* () {
            const latestSnaphot = this.snapshots.length ? this.snapshots[0] : null;
            if (!latestSnaphot || !latestSnaphot.s3Id) {
                const decoder = new manuscript_transform_1.Decoder(this.modelMap, true);
                const doc = decoder.createArticleNode();
                const ancestorDoc = decoder.createArticleNode();
                return {
                    snapshotID: null,
                    commits: this.commits,
                    commitAtLoad: null,
                    snapshots: this.snapshots,
                    doc,
                    ancestorDoc,
                    saveModel: this.saveModel,
                    deleteModel: this.deleteModel,
                    saveManuscript: this.saveManuscript,
                    getModel: this.getModel,
                    saveNewManuscript: this.saveNewManuscript,
                    putAttachment: this.putAttachment,
                    getAttachment: this.getAttachment,
                    updateManuscriptTemplate: this.updateManuscriptTemplate,
                    getInvitation: this.getInvitation,
                    getUserTemplates: this.getUserTemplates,
                };
            }
            const modelsFromSnapshot = yield snapshot_1.getSnapshot(this.containerID, latestSnaphot.s3Id).catch((e) => {
                console.log(e);
                throw new Error('Failed to load snapshot');
            });
            const snapshotModelMap = this.buildModelMapFromJson(modelsFromSnapshot.filter((doc) => !doc.manuscriptID || doc.manuscriptID === this.manuscriptID));
            // to use modelMap for test here
            const decoder = new manuscript_transform_1.Decoder(snapshotModelMap, true);
            const doc = decoder.createArticleNode();
            const ancestorDoc = decoder.createArticleNode();
            const corrections = manuscript_transform_1.getModelsByType(this.modelMap, manuscripts_json_schema_1.ObjectTypes.Correction).filter((corr) => corr.snapshotID === this.snapshots[0]._id);
            const unrejectedCorrections = corrections
                .filter((cor) => cor.status.label !== 'rejected')
                .map((cor) => cor.commitChangeID || '');
            const commitAtLoad = track_changes_1.findCommitWithChanges(this.commits, unrejectedCorrections) || null;
            return {
                snapshotID: this.snapshots[0]._id,
                commits: this.commits,
                commitAtLoad,
                snapshots: this.snapshots,
                doc,
                ancestorDoc,
                saveModel: this.saveModel,
                deleteModel: this.deleteModel,
                saveManuscript: this.saveManuscript,
                getModel: this.getModel,
                saveNewManuscript: this.saveNewManuscript,
                putAttachment: this.putAttachment,
                getAttachment: this.getAttachment,
                updateManuscriptTemplate: this.updateManuscriptTemplate,
                getInvitation: this.getInvitation,
                getUserTemplates: this.getUserTemplates,
            };
        });
        this.saveCorrection = (correction) => {
            return this.collection.save(correction);
        };
        this.saveCommit = (commit) => {
            return this.collection.save(track_changes_1.commitToJSON(commit, this.containerID));
        };
        this.getModel = (id) => {
            if (!this.modelMap) {
                return;
            }
            return this.modelMap.get(id);
        };
        this.bulkUpdate = (items) => __awaiter(this, void 0, void 0, function* () {
            for (const value of items) {
                const containerIDs = {
                    containerID: this.containerID,
                };
                if (manuscript_transform_1.isManuscriptModel(value)) {
                    containerIDs.manuscriptID = this.manuscriptID;
                }
                yield this.collection.save(value, containerIDs, true);
            }
        });
        this.saveModel = (model) => __awaiter(this, void 0, void 0, function* () {
            if (!model) {
                console.log(new Error().stack);
            }
            if (!model._id) {
                throw new Error('Model ID required');
            }
            const containedModel = model;
            // NOTE: this is needed because the local state is updated before saving
            const containerIDs = {
                containerID: this.containerID,
            };
            if (manuscript_transform_1.isManuscriptModel(containedModel)) {
                containerIDs.manuscriptID = this.manuscriptID;
            }
            this.setModelsState(this.modelMap.set(containedModel._id, Object.assign(Object.assign({}, containedModel), containerIDs)));
            const _a = containedModel, { attachment } = _a, data = __rest(_a, ["attachment"]);
            // TODO: data.contents = serialized DOM wrapper for bibliography
            const result = yield this.collection.save(data, containerIDs);
            if (attachment) {
                yield this.collection.putAttachment(result._id, attachment);
            }
            return result;
        });
        this.deleteModel = (id) => {
            if (this.modelMap) {
                this.modelMap.delete(id);
            }
            this.setModelsState(this.modelMap);
            return this.collection.delete(id);
        };
        this.saveManuscript = (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const prevManuscript = this.modelMap.get(this.manuscriptID);
                return this.saveModel(Object.assign(Object.assign({}, prevManuscript), data)).then(() => undefined);
            }
            catch (e) {
                console.log(e);
            }
        });
        this.getInvitation = (invitingUserID, invitedEmail) => {
            return new Promise((resolve) => {
                const collection = this.userCollection;
                const sub = collection
                    .findOne({
                    objectType: manuscripts_json_schema_1.ObjectTypes.ContainerInvitation,
                    containerID: this.manuscriptID,
                    invitedUserEmail: invitedEmail,
                    invitingUserID,
                })
                    .$.subscribe((doc) => {
                    if (doc) {
                        sub.unsubscribe();
                        resolve(doc.toJSON());
                    }
                });
            });
        };
        this.snapshots = snapshots;
        this.commits = commits;
        this.collection = collection;
        this.userCollection = userCollection;
        this.manuscriptID = manuscriptID;
        this.setModelsState = setModelsState;
        this.containerID = projectID;
        this.modelMap = modelMap;
        this.db = db;
    }
}
exports.default = ModelManager;
//# sourceMappingURL=ModelManager.js.map