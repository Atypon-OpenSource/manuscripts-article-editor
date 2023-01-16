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
exports.TemplateCategorySelector = void 0;
const TemplateCategoryBlogPost_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryBlogPost"));
const TemplateCategoryBook_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryBook"));
const TemplateCategoryDissertation_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryDissertation"));
const TemplateCategoryEssay_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryEssay"));
const TemplateCategoryGrantApplication_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryGrantApplication"));
const TemplateCategoryManual_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryManual"));
const TemplateCategoryResearchArticle_1 = __importDefault(require("@manuscripts/assets/react/TemplateCategoryResearchArticle"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Slider_1 = require("../Slider");
const TemplateCategory_1 = require("./TemplateCategory");
const Categories = styled_components_1.default.nav.attrs(() => ({ role: 'navigation' })) `
  margin: 0 64px 32px;
  position: relative;

  @media (max-width: 450px) {
    margin-left: 70px;
    margin-right: 70px;
  }
`;
const Category = styled_components_1.default(style_guide_1.ToggleButton) `
  align-items: center;
  border-radius: ${(props) => props.theme.grid.radius.small};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
`;
const CategoryName = styled_components_1.default.span `
  padding-left: 10px;
`;
const icons = {
    Essay: react_1.default.createElement(TemplateCategoryEssay_1.default, null),
    Research: react_1.default.createElement(TemplateCategoryResearchArticle_1.default, null),
    Dissertation: react_1.default.createElement(TemplateCategoryDissertation_1.default, null),
    Chapter: react_1.default.createElement(TemplateCategoryBook_1.default, null),
    Patent: react_1.default.createElement(TemplateCategoryGrantApplication_1.default, null),
    Blog: react_1.default.createElement(TemplateCategoryBlogPost_1.default, null),
    Manual: react_1.default.createElement(TemplateCategoryManual_1.default, null),
};
const CategoryIcon = ({ name }) => name && icons[name] ? icons[name] : null;
const TemplateCategorySelector = ({ options, handleChange, value, }) => (react_1.default.createElement(Categories, null,
    react_1.default.createElement(Slider_1.Slider, null, options.map((category) => (react_1.default.createElement(TemplateCategory_1.TemplateCategory, { isSelected: value === category._id, key: category._id },
        react_1.default.createElement(Category, { autoFocus: value === category._id, title: category.desc, selected: value === category._id, onClick: () => handleChange(category._id) },
            react_1.default.createElement(CategoryIcon, { name: category.imageName }),
            react_1.default.createElement(CategoryName, null, category.name))))))));
exports.TemplateCategorySelector = TemplateCategorySelector;
//# sourceMappingURL=TemplateCategorySelector.js.map