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
exports.importManuscript = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscript_1 = require("../../lib/manuscript");
const user_1 = require("../../lib/user");
const importManuscript = (history, saveNewManuscript, user, handleComplete, possibleProjectID) => (models) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = user ? user.userID : user_1.getCurrentUserId();
    const newProject = possibleProjectID ? null : manuscript_transform_1.buildProject(userID);
    const projectID = newProject ? newProject._id : possibleProjectID;
    // TODO: handle multiple manuscripts in a project bundle
    const manuscript = models.find(manuscript_1.isManuscript);
    if (!manuscript) {
        throw new Error('No manuscript found');
    }
    // TODO: try to share this code with createManuscript
    //  manuscript.priority = await nextManuscriptPriority(collection)
    // save the dependencies
    const dependencies = [];
    for (const model of models) {
        if (!manuscript_1.isManuscript(model)) {
            dependencies.push(Object.assign(Object.assign({}, model), { containerID: projectID, manuscriptID: manuscript_transform_1.isManuscriptModel(model) ? manuscript._id : undefined }));
        }
    }
    yield saveNewManuscript(dependencies, projectID, manuscript, newProject || undefined);
    if (handleComplete) {
        handleComplete(projectID, manuscript._id);
    }
});
exports.importManuscript = importManuscript;
//# sourceMappingURL=ImportManuscript.js.map