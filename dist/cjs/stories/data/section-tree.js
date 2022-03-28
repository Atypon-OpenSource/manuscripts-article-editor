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
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const sync_client_1 = require("@manuscripts/sync-client");
const withRequiredProperties = (model) => (Object.assign({ createdAt: 0, updatedAt: 0, containerID: 'MPProject:project-1', manuscriptID: 'MPManuscript:manuscript-1' }, model));
const data = [
    {
        objectType: manuscripts_json_schema_1.ObjectTypes.Section,
        _id: 'MPSection:top-level-1',
        priority: 1,
        path: ['MPSection:top-level-1'],
        elementIDs: ['MPParagraphElement:para-1'],
        title: 'Top Level Section One',
    },
    {
        objectType: manuscripts_json_schema_1.ObjectTypes.Section,
        _id: 'MPSection:top-level-2',
        priority: 2,
        path: ['MPSection:top-level-2'],
        title: 'Top Level Section Two',
        elementIDs: [
            'MPParagraphElement:para-2',
            'MPSection:child-1',
            'MPSection:child-2',
        ],
    },
    {
        objectType: manuscripts_json_schema_1.ObjectTypes.Section,
        _id: 'MPSection:child-1',
        priority: 1,
        path: ['MPSection:top-level-2', 'MPSection:child-1'],
        title: 'Child Section One',
        elementIDs: ['MPParagraphElement:para-4'],
    },
    {
        objectType: manuscripts_json_schema_1.ObjectTypes.Section,
        _id: 'MPSection:child-2',
        priority: 2,
        path: ['MPSection:top-level-2', 'MPSection:child-2'],
        title: 'Child Section Two',
        elementIDs: ['MPParagraphElement:para-3'],
    },
].map(withRequiredProperties);
exports.default = sync_client_1.tree(data);
//# sourceMappingURL=section-tree.js.map