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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const CitationEditor_1 = __importDefault(require("../src/components/library/CitationEditor"));
const CitationSearchSection_1 = require("../src/components/library/CitationSearchSection");
const CitationViewer_1 = require("../src/components/library/CitationViewer");
const doc_1 = require("./data/doc");
const isBibliographyItem = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.BibliographyItem);
const bibliographyItems = new Map();
for (const model of doc_1.modelMap.values()) {
    if (isBibliographyItem(model)) {
        bibliographyItems.set(model._id, model);
    }
}
const items = [...bibliographyItems.values()];
const citation = doc_1.modelMap.get('MPCitation:31E42852-8377-4550-8C25-9E602EE657B0');
react_1.storiesOf('Citation', module)
    .add('Citation Editor', () => (react_2.default.createElement(CitationEditor_1.default, { filterLibraryItems: () => __awaiter(void 0, void 0, void 0, function* () { return []; }), handleCancel: addon_actions_1.action('handle cancel'), handleCite: addon_actions_1.action('handle cite'), handleClose: addon_actions_1.action('handle close'), handleRemove: addon_actions_1.action('handle remove'), items: items, projectID: 'MPProject:1', scheduleUpdate: addon_actions_1.action('schedule update'), selectedText: 'foo', importItems: addon_actions_1.action('import items'), citation: citation, updateCitation: addon_actions_1.action('update citation') })))
    .add('Citation Search Section', () => (react_2.default.createElement(CitationSearchSection_1.CitationSearchSection, { query: 'foo', source: {
        id: 'stories',
        title: 'Stories',
        search: () => __awaiter(void 0, void 0, void 0, function* () { return ({ items, total: items.length }); }),
    }, addToSelection: addon_actions_1.action('add to selection'), selectSource: addon_actions_1.action('select source'), rows: 10, selected: new Map(), fetching: new Set() })))
    .add('Citation Viewer', () => react_2.default.createElement(CitationViewer_1.CitationViewer, { items: items }));
//# sourceMappingURL=Citation.stories.js.map