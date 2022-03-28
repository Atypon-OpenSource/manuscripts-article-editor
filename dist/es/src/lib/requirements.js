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
exports.sectionDescriptionCountRequirementFieldsMap = exports.manuscriptCountRequirementFieldsMap = exports.sectionCountRequirementFields = exports.manuscriptCountRequirementFields = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
exports.manuscriptCountRequirementFields = [
    'maxCharacterCountRequirement',
    'minCharacterCountRequirement',
    'maxWordCountRequirement',
    'minWordCountRequirement',
    // 'maxCombinedFigureTableCountRequirement',
    // 'minCombinedFigureTableCountRequirement',
];
exports.sectionCountRequirementFields = new Map([
    ['maxCharacterCountRequirement', 'maxCharCount'],
    ['maxWordCountRequirement', 'maxWordCount'],
    ['minCharacterCountRequirement', 'minCharCount'],
    ['minWordCountRequirement', 'minWordCount'],
]);
exports.manuscriptCountRequirementFieldsMap = new Map([
    [
        'maxCharacterCountRequirement',
        manuscripts_json_schema_1.ObjectTypes.MaximumManuscriptCharacterCountRequirement,
    ],
    [
        'maxWordCountRequirement',
        manuscripts_json_schema_1.ObjectTypes.MaximumManuscriptWordCountRequirement,
    ],
    [
        'minCharacterCountRequirement',
        manuscripts_json_schema_1.ObjectTypes.MinimumManuscriptCharacterCountRequirement,
    ],
    [
        'minWordCountRequirement',
        manuscripts_json_schema_1.ObjectTypes.MinimumManuscriptWordCountRequirement,
    ],
]);
exports.sectionDescriptionCountRequirementFieldsMap = new Map([
    ['maxCharCount', manuscripts_json_schema_1.ObjectTypes.MaximumSectionCharacterCountRequirement],
    ['maxWordCount', manuscripts_json_schema_1.ObjectTypes.MaximumSectionWordCountRequirement],
    ['minCharCount', manuscripts_json_schema_1.ObjectTypes.MinimumSectionCharacterCountRequirement],
    ['minWordCount', manuscripts_json_schema_1.ObjectTypes.MinimumSectionWordCountRequirement],
]);
//# sourceMappingURL=requirements.js.map