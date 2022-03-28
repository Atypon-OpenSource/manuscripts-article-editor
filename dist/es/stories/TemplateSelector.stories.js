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
const keywords_json_1 = __importDefault(require("@manuscripts/data/dist/shared/keywords.json"));
const manuscript_categories_json_1 = __importDefault(require("@manuscripts/data/dist/shared/manuscript-categories.json"));
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const TemplateCategorySelector_1 = require("../src/components/templates/TemplateCategorySelector");
const TemplateEmpty_1 = require("../src/components/templates/TemplateEmpty");
const TemplateListItem_1 = require("../src/components/templates/TemplateListItem");
const TemplateSearchInput_1 = require("../src/components/templates/TemplateSearchInput");
const TemplateSelectorList_1 = require("../src/components/templates/TemplateSelectorList");
const TemplateSelectorModal_1 = require("../src/components/templates/TemplateSelectorModal");
const TemplateTopicSelector_1 = require("../src/components/templates/TemplateTopicSelector");
const TemplateTopicsList_1 = require("../src/components/templates/TemplateTopicsList");
const templates_data_1 = require("./data/templates-data");
const researchFields = keywords_json_1.default.filter((keyword) => keyword.objectType === manuscripts_json_schema_1.ObjectTypes.ResearchField);
const listRef = react_2.default.createRef();
const templatesDataWithType = templates_data_1.templatesData.map((templateData) => {
    return Object.assign(Object.assign({}, templateData), { titleAndType: [templateData.title, templateData.articleType].join(' ') });
});
const [templateData] = templatesDataWithType;
react_1.storiesOf('Template Selector', module)
    .add('Modal', () => (react_2.default.createElement(TemplateSelectorModal_1.TemplateSelectorModal, { items: templatesDataWithType, categories: manuscript_categories_json_1.default, researchFields: researchFields, handleComplete: addon_actions_1.action('complete'), 
    // importManuscript={action('import manuscript')}
    selectTemplate: addon_actions_1.action('select template'), createEmpty: addon_actions_1.action('create empty') })))
    .add('Search input', () => (react_2.default.createElement(TemplateSearchInput_1.TemplateSearchInput, { value: '', handleChange: addon_actions_1.action('search') })))
    .add('Category selector', () => (react_2.default.createElement(TemplateCategorySelector_1.TemplateCategorySelector, { value: 'MPManuscriptCategory:research-article', handleChange: addon_actions_1.action('select category'), options: manuscript_categories_json_1.default })))
    .add('Topic selector', () => (react_2.default.createElement("div", { style: { width: 200 } },
    react_2.default.createElement(TemplateTopicSelector_1.TemplateTopicSelector, { handleChange: addon_actions_1.action('select topic'), options: researchFields }))))
    .add('Topics list', () => (react_2.default.createElement(TemplateTopicsList_1.TemplateTopicsList, { handleChange: addon_actions_1.action('select topic'), options: researchFields })))
    .add('Empty search results', () => (react_2.default.createElement(TemplateEmpty_1.TemplateEmpty, { searchText: 'example', selectedCategoryName: 'selected', createEmpty: addon_actions_1.action('create empty') })))
    .add('Empty category', () => (react_2.default.createElement(TemplateEmpty_1.TemplateEmpty, { searchText: '', selectedCategoryName: 'Biology', createEmpty: addon_actions_1.action('create empty') })))
    .add('Results list', () => (react_2.default.createElement("div", { style: { height: 400, width: 600 } },
    react_2.default.createElement(TemplateSelectorList_1.TemplateSelectorList, { filteredItems: templatesDataWithType, listRef: listRef, resetList: addon_actions_1.action('reset list'), selectItem: addon_actions_1.action('return selection'), height: 400, width: 600 }))))
    .add('Result', () => (react_2.default.createElement("div", { style: { width: 600 } },
    react_2.default.createElement(TemplateListItem_1.TemplateListItem, { articleType: templateData.articleType, item: templateData, publisher: templateData.publisher, selected: false, selectItem: addon_actions_1.action('select item'), template: templateData.template, title: templateData.title }))))
    .add('Result: selected', () => (react_2.default.createElement("div", { style: { width: 600 } },
    react_2.default.createElement(TemplateListItem_1.TemplateListItem, { articleType: templateData.articleType, item: templateData, publisher: templateData.publisher, selected: true, selectItem: addon_actions_1.action('select item'), template: templateData.template, title: templateData.title }))));
//# sourceMappingURL=TemplateSelector.stories.js.map