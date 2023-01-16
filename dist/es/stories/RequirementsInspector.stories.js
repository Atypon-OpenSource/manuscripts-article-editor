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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const RequirementsInspector_1 = require("../src/components/requirements/RequirementsInspector");
const store_1 = require("../src/store");
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
// const prototypeId =
//   'MPManuscriptTemplate:www-zotero-org-styles-bmc-cell-biology-BMC-Cell-Biology-Journal-Publication'
doc_1.modelMap.set(manuscript._id, manuscript);
const bulkUpdate = (items) => __awaiter(void 0, void 0, void 0, function* () {
    return yield new Promise((resolve, reject) => {
        resolve();
    });
});
const storeState = {
    manuscript,
    modelMap: doc_1.modelMap,
    bulkUpdate,
};
const store = new store_1.GenericStore(undefined, undefined, storeState);
react_1.storiesOf('Inspector/Requirements', module).add('validations', () => {
    return (react_2.default.createElement(store_1.GenericStoreProvider, { store: store },
        react_2.default.createElement(manuscript_editor_1.RequirementsProvider, { modelMap: doc_1.modelMap },
            react_2.default.createElement(RequirementsInspector_1.RequirementsInspector, null))));
});
//# sourceMappingURL=RequirementsInspector.stories.js.map