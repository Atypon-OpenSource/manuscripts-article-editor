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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const track_changes_1 = require("@manuscripts/track-changes");
const Bibilo_1 = require("./Bibilo");
const savingUtilities_1 = require("./savingUtilities");
const buildUtilities = (data, api, updateState) => {
    var _a, _b;
    const getModel = (id) => {
        if (!data.modelMap) {
            return;
        }
        return data.modelMap.get(id);
    };
    //   const bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
    //     for (const value of items) {
    //       const containerIDs: ContainerIDs = {
    //         containerID: this.containerID,
    //       }
    //       if (isManuscriptModel(value)) {
    //         containerIDs.manuscriptID = this.manuscriptID
    //       }
    //       await this.collection.save(value, containerIDs, true)
    //     }
    //   }
    const bulkPersistentProjectSave = (models) => {
        // combine entire project and overwrite?
        const onlyProjectModels = models.filter((model) => !model.manuscriptID);
        if (data.projectID && data.manuscriptID) {
            api.saveProject(data.projectID, onlyProjectModels);
        }
    };
    const bulkPersistentManuscriptSave = (models) => {
        // const onlyManuscriptModels = models.filter((model) => {
        //   return isManuscript(model) || model.manuscriptID === data.manuscriptID
        // })
        const clearedModels = models.filter((model) => {
            return model.objectType !== manuscripts_json_schema_1.ObjectTypes.Project;
        });
        if (data.projectID && data.manuscriptID) {
            return api
                .saveManuscriptData(data.projectID, data.manuscriptID, clearedModels)
                .then(() => {
                return true; // not sure what will be returned at this point
            })
                .catch(() => {
                return false;
            });
        }
        else {
            return Promise.reject(false);
        }
    };
    const saveModel = (model) => __awaiter(void 0, void 0, void 0, function* () {
        if (!model._id) {
            throw new Error('Model ID required');
        }
        if (!data.modelMap || !data.manuscriptID || !data.projectID) {
            throw new Error('State misses important element. Unable to savel a model.');
        }
        const containedModel = model;
        // NOTE: this is needed because the local state is updated before saving
        const containerIDs = {
            containerID: data.projectID,
        };
        if (manuscript_transform_1.isManuscriptModel(containedModel)) {
            containerIDs.manuscriptID = data.manuscriptID;
        }
        const newModel = Object.assign(Object.assign({}, containedModel), containerIDs);
        const modelMap = data.modelMap.set(containedModel._id, newModel);
        // const { attachment, ...containedModeldata } = containedModel as T &
        //   ContainedProps &
        //   ModelAttachment
        // TODO: containedModeldata.contents = serialized DOM wrapper for bibliography
        // const result = await this.collection.save(containedModeldata, containerIDs)
        // under this new API we won' save the model separately but rather trigger a bulk save once in a while
        // if (attachment) {
        //   await this.collection.putAttachment(result._id, attachment)
        // }
        // return result as T & ContainedProps
        savingUtilities_1.saveWithThrottle(() => __awaiter(void 0, void 0, void 0, function* () {
            updateState({
                modelMap,
            });
            updateState({
                savingProcess: 'saving',
            });
            const result = yield bulkPersistentManuscriptSave([
                ...modelMap.values(),
            ]);
            updateState({
                savingProcess: result ? 'saved' : 'failed',
            });
        }));
        return newModel;
    });
    const saveProjectModel = (model) => {
        if (!model._id) {
            throw new Error('Model ID required.');
        }
        if (!data.modelMap || !data.projectID) {
            throw new Error('State misses important element. Unable to savel a model.');
        }
        const containedModel = Object.assign(Object.assign({}, model), { containerID: data.projectID });
        const map = data.modelMap; // potential time discrepancy bug
        savingUtilities_1.saveWithThrottle(() => {
            updateState({
                modelMap: map.set(model._id, containedModel),
            });
            if (data.modelMap) {
                bulkPersistentProjectSave([
                    ...data.modelMap.values(),
                ]);
            }
        });
        return containedModel;
    };
    const deleteModel = (id) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.modelMap) {
            data.modelMap.delete(id);
            updateState({
                modelMap: data.modelMap,
                savingProcess: 'saving',
            });
            const result = yield bulkPersistentManuscriptSave([
                ...data.modelMap.values(),
            ]);
            updateState({
                savingProcess: result ? 'saved' : 'failed',
            });
        }
        return id;
    });
    const saveManuscript = (manuscriptData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!data.modelMap || !data.manuscriptID) {
                throw new Error('Unable to save manuscript due to incomplete data');
            }
            const prevManuscript = data.modelMap.get(data.manuscriptID);
            return saveModel(Object.assign(Object.assign({}, prevManuscript), manuscriptData)).then(() => undefined);
        }
        catch (e) {
            console.log(e);
        }
    });
    const saveNewManuscript = (
    // this is only for development purposes, in LW there should be no direct insertion of manuscripts by user
    dependencies, containerID, // ignoring for now because API doesn't support an compulsory containerID
    manuscript, newProject) => __awaiter(void 0, void 0, void 0, function* () {
        if (newProject) {
            const project = yield api.createProject(newProject.title || 'Untitled');
            if (project) {
                yield api.createNewManuscript(project._id, manuscript._id);
                dependencies.forEach((dep) => {
                    dep.containerID = project._id;
                });
                yield api.saveProjectData(project._id, dependencies);
                return manuscript;
            }
            else {
                throw new Error('Unable to create new project');
            }
        }
        // else {
        // currently not supporting multiple manuscripts in a project
        // }
        return Promise.resolve(manuscript);
    });
    const saveBiblioItem = (item, projectID) => __awaiter(void 0, void 0, void 0, function* () {
        return saveProjectModel(item);
    });
    const updateBiblioItem = (item) => {
        return saveModel(item); // difference between modelMap and projectModelMap are those different? should we store project level data in a different map?
        // return this.collection.update(item._id, item)
    };
    const deleteBiblioItem = (item) => {
        var _a;
        return Promise.resolve(((_a = data.modelMap) === null || _a === void 0 ? void 0 : _a.delete(item._id)) || false);
    };
    const saveCorrection = (correction) => {
        return saveModel(correction);
    };
    const saveCommit = (commit) => {
        if (data.containerID) {
            return saveProjectModel(track_changes_1.commitToJSON(commit, data.containerID));
        }
    };
    const createProjectLibraryCollection = (libraryCollection, projectID) => __awaiter(void 0, void 0, void 0, function* () {
        saveProjectModel(libraryCollection);
    });
    const bulkUpdate = (items) => __awaiter(void 0, void 0, void 0, function* () {
        for (const value of items) {
            // @TODO - optimize to save all the models at once or at least throttle
            saveModel(value);
        }
    });
    let biblioUtils;
    if (data.manuscript && data.library) {
        const bundle = ((_a = data.manuscript) === null || _a === void 0 ? void 0 : _a.bundle // TODO: infer bundle from prototype if manuscript.bundle is undefined ?
        )
            ? (_b = data === null || data === void 0 ? void 0 : data.modelMap) === null || _b === void 0 ? void 0 : _b.get(data.manuscript.bundle)
            : null;
        biblioUtils = new Bibilo_1.Biblio(bundle, data.library, data.manuscript.primaryLanguageCode || 'eng');
    }
    const createUser = (profile) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveModel(profile);
        return Promise.resolve();
    });
    return {
        saveModel,
        deleteModel,
        saveManuscript,
        saveNewManuscript,
        getModel,
        saveCommit,
        saveCorrection,
        createProjectLibraryCollection,
        saveBiblioItem,
        deleteBiblioItem,
        updateBiblioItem,
        bulkUpdate,
        createUser,
        biblio: biblioUtils === null || biblioUtils === void 0 ? void 0 : biblioUtils.getTools(),
    };
};
exports.default = buildUtilities;
//# sourceMappingURL=buildUtilities.js.map