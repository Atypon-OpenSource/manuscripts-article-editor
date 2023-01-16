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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModelMap = void 0;
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
const authors_1 = require("../lib/authors");
const collaborators_1 = require("../lib/collaborators");
const replace_attachments_ids_1 = require("../lib/replace-attachments-ids");
const roles_1 = require("../lib/roles");
const snapshot_1 = require("../lib/snapshot");
const TokenData_1 = require("../store/TokenData");
const buildModelMap = (docs) => __awaiter(void 0, void 0, void 0, function* () {
    const items = new Map();
    const output = new Map();
    yield Promise.all(docs.map((doc) => __awaiter(void 0, void 0, void 0, function* () {
        items.set(doc._id, doc);
        output.set(doc._id, manuscript_transform_1.getModelData(doc));
    })));
    // for (const model of output.values()) {
    // @TODO images are not stored in the manuscripts api under the LW mode, but managed in the LW store.
    // we still however need to support local image management
    // if (isFigure(model)) {
    //   if (model.listingAttachment) {
    //     const { listingID, attachmentKey } = model.listingAttachment
    //     const listingDoc = items.get(listingID)
    //     if (listingDoc) {
    //       model.src = await getAttachment(listingDoc, attachmentKey)
    //     }
    //   } else {
    //     const figureDoc = items.get(model._id)
    //     if (figureDoc) {
    //       model.src = await getAttachment(figureDoc, 'image')
    //     }
    //   }
    // }
    // TODO: enable once tables can be images
    // else if (isTable(model)) {
    //   if (model.listingAttachment) {
    //     const { listingID, attachmentKey } = model.listingAttachment
    //     const listingDoc = items.get(listingID)
    //
    //     if (listingDoc) {
    //       model.src = await getAttachment(listingDoc, attachmentKey)
    //     }
    //   } else {
    //     const tableDoc = items.get(model._id)!
    //     model.src = await getAttachment(tableDoc, 'image')
    //   }
    // }
    // if (isUserProfile(model)) {
    //   const userProfileDoc = items.get(model._id)
    //   if (userProfileDoc) {
    //     model.avatar = await getAttachment(userProfileDoc, 'image')
    //   }
    // }
    // }
    return output;
});
exports.buildModelMap = buildModelMap;
const isSnapshot = (model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.Snapshot;
const isTag = (model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.Tag;
const isCommit = (model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.Commit;
const isCorrection = (model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.Correction;
const isManuscriptNote = (model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.ManuscriptNote;
// Project data come along with the manuscript data. We may return to this so it's commented for now.
// const getProjectData = async (projectID: string, api: Api) => {
//   const project = await api.getProject(projectID)
//   if (project) {
//     return project
//   }
//   throw new Error("Can't find the project by ID")
// }
const buildDocsMap = (docs) => {
    const docsMap = new Map();
    for (const doc of docs) {
        docsMap.set(doc._id, doc);
    }
    return docsMap;
};
const getManuscriptData = (projectID, manuscriptID, api) => __awaiter(void 0, void 0, void 0, function* () {
    const models = yield api.getManuscript(projectID, manuscriptID);
    if (!models) {
        throw new Error('Models are wrong.');
    }
    const data = {};
    for (const model of models) {
        if (model.objectType === manuscripts_json_schema_1.ObjectTypes.Project) {
            data.project = model;
            continue;
        }
        if (manuscript_transform_1.isManuscript(model)) {
            data.manuscript = model;
            continue;
        }
        if (isSnapshot(model)) {
            data.snapshots = data.snapshots
                ? [...data.snapshots, model]
                : [model];
            continue;
        }
        if (isManuscriptNote(model)) {
            data.notes = data.notes
                ? [...data.notes, model]
                : [model];
            continue;
        }
        if (isTag(model)) {
            data.tags = data.tags
                ? [...data.tags, model]
                : [model];
            continue;
        }
        if (isCorrection(model)) {
            data.corrections = data.corrections
                ? [...data.corrections, model]
                : [model];
        }
        if (manuscript_transform_1.isCommentAnnotation(model)) {
            data.comments = data.comments
                ? [...data.comments, model]
                : [model];
        }
        if (isCommit(model)) {
            const commit = track_changes_1.commitFromJSON(model, manuscript_transform_1.schema);
            data.commits = data.commits
                ? [...data.commits, model]
                : [commit];
        }
    }
    data.commits = data.commits || [];
    data.modelMap = yield exports.buildModelMap(models || []);
    return data;
});
const getLibrariesData = (projectID, api) => __awaiter(void 0, void 0, void 0, function* () {
    const libraries = yield api.getProjectModels(projectID, [
        'MPLibraryCollection',
        'MPBibliographyItem',
    ]);
    if (libraries) {
        return libraries.reduce((acc, item) => {
            if (item.objectType === manuscripts_json_schema_1.ObjectTypes.BibliographyItem) {
                acc.library.set(item._id, item);
            }
            if (item.objectType === manuscripts_json_schema_1.ObjectTypes.LibraryCollection) {
                acc.projectLibraryCollections.set(item._id, item);
            }
            return acc;
        }, {
            projectLibraryCollections: new Map(),
            library: new Map(),
        });
    }
    return null;
});
const getCollaboratorsData = (projectID, data, user, api) => __awaiter(void 0, void 0, void 0, function* () {
    const collabsData = {};
    const collaboratorsProfiles = yield api.getCollaborators(projectID);
    if (collaboratorsProfiles) {
        const collaborators = buildDocsMap(collaboratorsProfiles);
        if (user) {
            collabsData.collaboratorsProfiles = collaborators_1.buildCollaboratorProfiles(collaborators, user);
            collabsData.collaboratorsById = collaborators_1.buildCollaboratorProfiles(collaborators, user, '_id');
        }
    }
    // collabsData.collaboratorsProfiles = collaboratorsProfiles // why?
    return collabsData;
});
const buildModelMapFromJson = (models) => {
    return new Map(models.map((model) => {
        return [model._id, model];
    }));
};
const getDrivedData = (manuscriptID, projectID, data, alternatedModelMap) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let storeData;
    if (!data.modelMap || !projectID) {
        return null;
    }
    const latestSnaphot = ((_a = data === null || data === void 0 ? void 0 : data.snapshots) === null || _a === void 0 ? void 0 : _a.length) ? data.snapshots[0] : null;
    if (!latestSnaphot) {
        const decoder = new manuscript_transform_1.Decoder(alternatedModelMap || data.modelMap, true);
        const doc = decoder.createArticleNode();
        const ancestorDoc = decoder.createArticleNode();
        storeData = {
            snapshotID: null,
            commitAtLoad: null,
            ancestorDoc,
            doc,
        };
    }
    else {
        const modelsFromSnapshot = yield snapshot_1.getSnapshot(projectID, latestSnaphot.s3Id).catch((e) => {
            console.log(e);
            throw new Error('Failed to load snapshot');
        });
        const snapshotModelMap = buildModelMapFromJson(modelsFromSnapshot.filter((doc) => !doc.manuscriptID || doc.manuscriptID === manuscriptID));
        const unrejectedCorrections = data.corrections
            .filter((cor) => cor.snapshotID === data.snapshots[0]._id &&
            cor.status.label !== 'rejected')
            .map((cor) => cor.commitChangeID || '');
        const commitAtLoad = track_changes_1.findCommitWithChanges(data.commits || [], unrejectedCorrections) || null;
        const decoder = new manuscript_transform_1.Decoder(snapshotModelMap, true);
        const doc = decoder.createArticleNode();
        const ancestorDoc = decoder.createArticleNode();
        storeData = {
            snapshotID: data.snapshots[0]._id,
            modelMap: snapshotModelMap,
            commitAtLoad,
            ancestorDoc,
            doc,
        };
    }
    const affiliationAndContributors = [];
    const contributorRoles = [];
    for (const model of (_b = data.modelMap) === null || _b === void 0 ? void 0 : _b.values()) {
        if (model.objectType === manuscripts_json_schema_1.ObjectTypes.Affiliation ||
            model.objectType === manuscripts_json_schema_1.ObjectTypes.Contributor) {
            affiliationAndContributors.push(model); // or Contributor
        }
        if (model.objectType === manuscripts_json_schema_1.ObjectTypes.ContributorRole) {
            contributorRoles.push(model);
        }
    }
    storeData.authorsAndAffiliations = authors_1.buildAuthorsAndAffiliations(affiliationAndContributors);
    storeData.contributorRoles = contributorRoles;
    return storeData;
});
function buildData(projectID, manuscriptID, api, attachments) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // const project = await getProjectData(projectID, api)
        const user = yield api.getUser();
        if (!user) {
            return {};
        }
        const manuscriptData = yield getManuscriptData(projectID, manuscriptID, api);
        const userRole = manuscriptData.project
            ? roles_1.getUserRole(manuscriptData.project, user.userID)
            : null;
        const collaboratorsData = yield getCollaboratorsData(projectID, manuscriptData, user, api);
        const projects = yield api.getUserProjects();
        const librariesData = yield getLibrariesData(projectID, api);
        // replace attachments with src
        let noAttachmentsModelMap = undefined;
        if (attachments && manuscriptData.modelMap) {
            noAttachmentsModelMap = replace_attachments_ids_1.replaceAttachmentsIds(manuscriptData.modelMap, attachments);
        }
        const derivedData = yield getDrivedData(manuscriptID, projectID, manuscriptData, noAttachmentsModelMap);
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ projects: projects, manuscripts: [manuscriptData.manuscript], 
            /* Wierd array? In lean workflow there is always only one project and a single manuscrit in it.
              These arrays have to be provided for components compatibility that shouldn't be changed as it is possible that it will change
              */
            user, manuscriptID: (_a = manuscriptData.manuscript) === null || _a === void 0 ? void 0 : _a._id, projectID: (_b = manuscriptData.project) === null || _b === void 0 ? void 0 : _b._id, userRole }, derivedData), collaboratorsData), librariesData), manuscriptData), { tokenData: new TokenData_1.TokenData() });
    });
}
exports.default = buildData;
//# sourceMappingURL=buildData.js.map