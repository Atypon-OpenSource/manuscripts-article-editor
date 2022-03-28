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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryInput = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_synced_data_1 = require("../../hooks/use-synced-data");
const section_categories_1 = require("../../lib/section-categories");
const CategoryInput = ({ value, handleChange, existingCatsCounted }) => {
    const [currentValue, handleLocalChange] = use_synced_data_1.useSyncedData(value, handleChange, 0);
    const handleInputChange = react_1.useCallback((event) => {
        handleLocalChange(event.target.value);
    }, [handleLocalChange]);
    return (react_1.default.createElement(CategorySelector, { value: currentValue, onChange: handleInputChange }, section_categories_1.sortedSectionCategories
        .filter((cat) => {
        return (section_categories_1.isEditableSectionCategory(cat) &&
            (!section_categories_1.isUniquePresent(cat, existingCatsCounted) ||
                section_categories_1.isUnique(currentValue)));
    })
        .map((sectionCategory) => (react_1.default.createElement("option", { value: sectionCategory._id, key: sectionCategory._id }, sectionCategory.name)))));
};
exports.CategoryInput = CategoryInput;
const CategorySelector = styled_components_1.default.select `
  display: block;
  width: 100%;
`;
//# sourceMappingURL=CategoryInput.js.map