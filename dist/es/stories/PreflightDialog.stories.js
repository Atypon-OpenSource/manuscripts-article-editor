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
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const PreflightDialog_1 = require("../src/components/projects/PreflightDialog");
const doc_1 = require("./data/doc");
const maximumManuscriptWordCountRequirement = {
    _id: 'MaximumManuscriptWordCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMaximumManuscriptWordCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 1000,
};
doc_1.modelMap.set(maximumManuscriptWordCountRequirement._id, maximumManuscriptWordCountRequirement);
const minimumManuscriptWordCountRequirement = {
    _id: 'MinimumManuscriptWordCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMinimumManuscriptWordCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 100,
};
doc_1.modelMap.set(minimumManuscriptWordCountRequirement._id, minimumManuscriptWordCountRequirement);
const maximumManuscriptCharacterCountRequirement = {
    _id: 'MaximumManuscriptCharacterCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMaximumManuscriptCharacterCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 10000,
};
doc_1.modelMap.set(maximumManuscriptCharacterCountRequirement._id, maximumManuscriptCharacterCountRequirement);
const minimumManuscriptCharacterCountRequirement = {
    _id: 'MinimumManuscriptCharacterCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMinimumManuscriptCharacterCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 1000,
};
doc_1.modelMap.set(minimumManuscriptCharacterCountRequirement._id, minimumManuscriptCharacterCountRequirement);
const maximumSectionWordCountRequirement = {
    _id: 'MaximumSectionWordCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMaximumSectionWordCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 1000,
};
doc_1.modelMap.set(maximumSectionWordCountRequirement._id, maximumSectionWordCountRequirement);
const minimumSectionWordCountRequirement = {
    _id: 'MinimumSectionWordCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMinimumSectionWordCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 100,
};
doc_1.modelMap.set(minimumSectionWordCountRequirement._id, minimumSectionWordCountRequirement);
const maximumSectionCharacterCountRequirement = {
    _id: 'MaximumSectionCharacterCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMaximumSectionCharacterCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 10000,
};
doc_1.modelMap.set(maximumSectionCharacterCountRequirement._id, maximumSectionCharacterCountRequirement);
const minimumSectionCharacterCountRequirement = {
    _id: 'MinimumSectionCharacterCountRequirement:1',
    containerID: 'MPProject:1',
    manuscriptID: 'MPManuscript:1',
    objectType: 'MPMinimumSectionCharacterCountRequirement',
    createdAt: 0,
    updatedAt: 0,
    sessionID: 'foo',
    severity: 0,
    count: 1000,
};
doc_1.modelMap.set(minimumSectionCharacterCountRequirement._id, minimumSectionCharacterCountRequirement);
const isSection = (model) => model.objectType === manuscripts_json_schema_1.ObjectTypes.Section;
for (const model of doc_1.modelMap.values()) {
    if (isSection(model)) {
        // model.maxWordCountRequirement = maximumSectionWordCountRequirement._id
        model.minWordCountRequirement = minimumSectionWordCountRequirement._id;
        model.maxCharacterCountRequirement =
            maximumSectionCharacterCountRequirement._id;
        // model.minCharacterCountRequirement =
        //   minimumSectionCharacterCountRequirement._id
    }
}
const isManuscript = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.Manuscript);
const manuscript = [...doc_1.modelMap.values()].find(isManuscript);
manuscript.maxWordCountRequirement = maximumManuscriptWordCountRequirement._id;
// manuscript.minWordCountRequirement = minimumManuscriptWordCountRequirement._id
// manuscript.maxCharacterCountRequirement =
//   maximumManuscriptCharacterCountRequirement._id
// manuscript.minCharacterCountRequirement =
//   minimumManuscriptCharacterCountRequirement._id
doc_1.modelMap.set(manuscript._id, manuscript);
const targetJournals = [
    {
        journalName: 'Example Journal',
        issn: '1091-6490',
        depositoryCode: 'EJP',
        journalAbbreviation: 'ej',
    },
];
react_1.storiesOf('Preflight', module).add('Dialog', () => (react_2.default.createElement(manuscript_editor_1.RequirementsProvider, { modelMap: doc_1.modelMap },
    react_2.default.createElement(PreflightDialog_1.PreflightDialog, { manuscript: manuscript, issns: ['1091-6490'], targetJournals: targetJournals, doc: doc_1.doc, handleClose: addon_actions_1.action('close'), handleConfirm: addon_actions_1.action('confirm') }))));
//# sourceMappingURL=PreflightDialog.stories.js.map