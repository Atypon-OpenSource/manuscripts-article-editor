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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastOpenedManuscriptID = exports.buildRecentProjects = exports.buildUserProject = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const device_id_1 = __importDefault(require("./device-id"));
const buildUserProject = (userID, projectID, manuscriptID, deviceID, sectionID) => ({
    _id: manuscript_transform_1.generateID(manuscripts_json_schema_1.ObjectTypes.UserProject),
    objectType: manuscripts_json_schema_1.ObjectTypes.UserProject,
    userID,
    projectID,
    lastOpened: {
        [deviceID]: {
            timestamp: manuscript_transform_1.timestamp(),
            manuscriptID,
            sectionID,
        },
    },
});
exports.buildUserProject = buildUserProject;
const compareTimestamp = (deviceID) => (a, b) => {
    if (a.lastOpened[deviceID].timestamp < b.lastOpened[deviceID].timestamp) {
        return 1;
    }
    else if (a.lastOpened[deviceID].timestamp > b.lastOpened[deviceID].timestamp) {
        return -1;
    }
    else {
        return 0;
    }
};
const buildRecentProjects = (projectID, userProjects, projects, numberOfProjects = 5) => {
    const projectsMap = new Map();
    projects.forEach((project) => {
        projectsMap.set(project._id, project);
    });
    return userProjects
        .filter((userProject) => projectID !== userProject.projectID &&
        userProject.lastOpened[device_id_1.default] &&
        projectsMap.get(userProject.projectID))
        .sort(compareTimestamp(device_id_1.default))
        .splice(0, numberOfProjects)
        .map(({ projectID, lastOpened }) => ({
        projectID,
        projectTitle: projectsMap.get(projectID).title,
        manuscriptID: lastOpened[device_id_1.default].manuscriptID,
        sectionID: lastOpened[device_id_1.default].sectionID,
    }));
};
exports.buildRecentProjects = buildRecentProjects;
const lastOpenedManuscriptID = (projectID, userProjects) => {
    const userProject = userProjects.find((userProject) => userProject.projectID === projectID);
    if (!userProject) {
        return null;
    }
    const lastOpened = userProject.lastOpened[device_id_1.default];
    if (!lastOpened) {
        return null;
    }
    return lastOpened.manuscriptID;
};
exports.lastOpenedManuscriptID = lastOpenedManuscriptID;
//# sourceMappingURL=user-project.js.map