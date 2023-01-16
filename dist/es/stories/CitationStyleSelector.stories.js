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
const bundles_json_1 = __importDefault(require("@manuscripts/data/dist/shared/bundles.json"));
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const CitationStyleEmpty_1 = require("../src/components/templates/CitationStyleEmpty");
const CitationStyleListItem_1 = require("../src/components/templates/CitationStyleListItem");
const CitationStyleSelectorList_1 = require("../src/components/templates/CitationStyleSelectorList");
const CitationStyleSelectorModal_1 = require("../src/components/templates/CitationStyleSelectorModal");
const listRef = react_2.default.createRef();
const [bundle] = bundles_json_1.default;
react_1.storiesOf('Citation Style Selector', module)
    .add('Modal', () => (react_2.default.createElement("div", { style: { height: 400, width: 600 } },
    react_2.default.createElement(CitationStyleSelectorModal_1.CitationStyleSelectorModal, { items: bundles_json_1.default, handleComplete: addon_actions_1.action('complete'), selectBundle: addon_actions_1.action('select bundle') }))))
    .add('Empty search results', () => (react_2.default.createElement(CitationStyleEmpty_1.CitationStyleEmpty, { searchText: 'example' })))
    .add('Results list', () => (react_2.default.createElement("div", { style: { height: 400, width: 600 } },
    react_2.default.createElement(CitationStyleSelectorList_1.CitationStyleSelectorList, { filteredItems: bundles_json_1.default, listRef: listRef, selectBundle: addon_actions_1.action('select bundle') }))))
    .add('Result', () => (react_2.default.createElement("div", { style: { width: 600 } },
    react_2.default.createElement(CitationStyleListItem_1.CitationStyleListItem, { item: bundle, selectBundle: addon_actions_1.action('select bundle') }))));
//# sourceMappingURL=CitationStyleSelector.stories.js.map