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
Object.defineProperty(exports, "__esModule", { value: true });
exports.canWrite = exports.getUserRole = exports.isAnnotator = exports.isEditor = exports.isViewer = exports.isWriter = exports.isOwner = exports.ProjectRole = void 0;
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["owner"] = "Owner";
    ProjectRole["writer"] = "Writer";
    ProjectRole["viewer"] = "Viewer";
    ProjectRole["editor"] = "Editor";
    ProjectRole["annotator"] = "Annotator";
})(ProjectRole = exports.ProjectRole || (exports.ProjectRole = {}));
const isOwner = (project, userID) => project.owners.includes(userID);
exports.isOwner = isOwner;
const isWriter = (project, userID) => project.writers.includes(userID);
exports.isWriter = isWriter;
const isViewer = (project, userID) => project.viewers.includes(userID);
exports.isViewer = isViewer;
const isEditor = (project, userID) => { var _a; return (_a = project.editors) === null || _a === void 0 ? void 0 : _a.includes(userID); };
exports.isEditor = isEditor;
const isAnnotator = (project, userID) => { var _a; return (_a = project.annotators) === null || _a === void 0 ? void 0 : _a.includes(userID); };
exports.isAnnotator = isAnnotator;
const getUserRole = (project, userID) => {
    if (exports.isOwner(project, userID)) {
        return ProjectRole.owner;
    }
    if (exports.isWriter(project, userID)) {
        return ProjectRole.writer;
    }
    if (exports.isViewer(project, userID)) {
        return ProjectRole.viewer;
    }
    if (exports.isEditor(project, userID)) {
        return ProjectRole.editor;
    }
    if (exports.isAnnotator(project, userID)) {
        return ProjectRole.annotator;
    }
    return null;
};
exports.getUserRole = getUserRole;
const canWrite = (project, userID) => {
    return exports.isOwner(project, userID) || exports.isWriter(project, userID);
};
exports.canWrite = canWrite;
//# sourceMappingURL=roles.js.map