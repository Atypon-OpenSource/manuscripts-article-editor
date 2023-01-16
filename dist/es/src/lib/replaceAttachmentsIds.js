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
exports.replaceAttachmentLinks = exports.replaceAttachmentsIds = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const attachmentPrefix = 'attachment:';
function replaceAttachmentsIds(modelMap, attachments) {
    const newMap = new Map();
    modelMap.forEach((model) => {
        var _a;
        const figure = model;
        if (figure.objectType === manuscripts_json_schema_1.ObjectTypes.Figure &&
            ((_a = figure.src) === null || _a === void 0 ? void 0 : _a.startsWith(attachmentPrefix))) {
            const id = figure.src.replace(attachmentPrefix, '');
            const attachment = attachments.find((a) => id === a.id);
            if (attachment) {
                figure.src = attachment.link;
            }
        }
        newMap.set(model._id, model);
    });
    return newMap;
}
exports.replaceAttachmentsIds = replaceAttachmentsIds;
function replaceAttachmentLinks(modelMap, attachments) {
    const newMap = new Map();
    modelMap.forEach((model) => {
        const figure = model;
        if (figure.objectType === manuscripts_json_schema_1.ObjectTypes.Figure && figure.src) {
            const attachment = attachments.find((a) => figure.src === a.link);
            if (attachment) {
                figure.src = attachmentPrefix + attachment.id;
            }
        }
        newMap.set(model._id, model);
    });
    return newMap;
}
exports.replaceAttachmentLinks = replaceAttachmentLinks;
//# sourceMappingURL=replaceAttachmentsIds.js.map