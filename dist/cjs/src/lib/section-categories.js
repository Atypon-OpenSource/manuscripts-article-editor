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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUniquePresent = exports.isUnique = exports.findFirstParagraph = exports.chooseSectionCategory = exports.sortedSectionCategories = exports.isEditableSectionCategory = exports.isEditableSectionCategoryID = exports.uniqueSectionCategories = exports.uneditableSectionCategories = void 0;
const section_categories_json_1 = __importDefault(require("@manuscripts/data/dist/shared/section-categories.json"));
const sync_client_1 = require("@manuscripts/sync-client");
exports.uneditableSectionCategories = [
    'MPSectionCategory:bibliography',
    'MPSectionCategory:keywords',
    'MPSectionCategory:list-of-figures',
    'MPSectionCategory:list-of-tables',
    'MPSectionCategory:toc',
];
exports.uniqueSectionCategories = [
    'MPSectionCategory:abstract-graphical',
];
const isEditableSectionCategoryID = (id) => !exports.uneditableSectionCategories.includes(id);
exports.isEditableSectionCategoryID = isEditableSectionCategoryID;
const isEditableSectionCategory = (sectionCategory) => exports.isEditableSectionCategoryID(sectionCategory._id);
exports.isEditableSectionCategory = isEditableSectionCategory;
exports.sortedSectionCategories = section_categories_json_1.default.sort((a, b) => a.priority - b.priority);
const chooseSectionCategory = (section) => {
    if (section.category) {
        return section.category;
    }
    return section.path.length === 1
        ? 'MPSectionCategory:section'
        : 'MPSectionCategory:subsection';
};
exports.chooseSectionCategory = chooseSectionCategory;
const findFirstParagraph = (section, modelMap) => {
    if (section.elementIDs) {
        const [firstElementId] = section.elementIDs;
        if (firstElementId) {
            const firstElement = modelMap.get(firstElementId);
            if (firstElement && sync_client_1.isParagraphElement(firstElement)) {
                return firstElement;
            }
        }
    }
};
exports.findFirstParagraph = findFirstParagraph;
const isUnique = (categoryId) => {
    if (exports.uniqueSectionCategories.includes(categoryId)) {
        return true;
    }
    return false;
};
exports.isUnique = isUnique;
const isUniquePresent = (cat, existingCats) => {
    if (exports.isUnique(cat._id) && Object.keys(existingCats).includes(cat._id)) {
        return true;
    }
    return false;
};
exports.isUniquePresent = isUniquePresent;
//# sourceMappingURL=section-categories.js.map