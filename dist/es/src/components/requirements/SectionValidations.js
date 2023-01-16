"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionValidations = void 0;
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
const section_categories_json_1 = __importDefault(require("@manuscripts/data/dist/shared/section-categories.json"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const RequirementContainer_1 = require("./RequirementContainer");
const RequirementsData_1 = require("./RequirementsData");
const SectionValidations = ({ sortedData, modelMap, manuscriptID, bulkUpdate }) => {
    const isSectionValidation = (node) => {
        if (node.type &&
            node.type.startsWith('section-') &&
            !node.type.startsWith('section-order')) {
            return true;
        }
        return false;
    };
    let sectionValidation = sortedData.filter((node) => isSectionValidation(node) && node.message !== undefined);
    const sectionsData = [];
    while (sectionValidation.length > 0) {
        const category = isSectionValidation(sectionValidation[0]) &&
            sectionValidation[0].data.sectionCategory;
        const sectionValidationId = sectionValidation[0]._id;
        const sections = sectionValidation.filter((node) => isSectionValidation(node) && node.data.sectionCategory === category);
        sectionValidation = sectionValidation.filter((x) => sections.indexOf(x) === -1);
        const categoryData = section_categories_json_1.default.map((section) => {
            if (section._id === category) {
                return section.name;
            }
        });
        sectionsData.push(react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: sections, key: sectionValidationId, title: categoryData },
                react_1.default.createElement(Requirement, null, sections.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate })))))));
        if (sectionValidation.length <= 0) {
            return react_1.default.createElement(react_1.default.Fragment, null, sectionsData);
        }
    }
    return null;
};
exports.SectionValidations = SectionValidations;
const Requirement = styled_components_1.default.div `
  padding: 15px 0 0 0;
`;
//# sourceMappingURL=SectionValidations.js.map