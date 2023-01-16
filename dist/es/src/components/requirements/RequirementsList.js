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
exports.RequirementsList = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const store_1 = require("../../store");
const RequirementContainer_1 = require("./RequirementContainer");
const RequirementsData_1 = require("./RequirementsData");
const SectionValidations_1 = require("./SectionValidations");
const RequirementsList = ({ validationResult }) => {
    const [{ modelMap, manuscriptID, bulkUpdate }] = store_1.useStore((store) => ({
        modelMap: store.modelMap,
        manuscriptID: store.manuscriptID,
        bulkUpdate: store.bulkUpdate,
    }));
    const sortedData = react_1.useMemo(() => [...validationResult].sort((a, b) => a.passed === b.passed ? 0 : a ? -1 : 1), [validationResult]);
    const ignoredValidations = sortedData.filter((node) => node.ignored);
    const validationsList = sortedData.filter((node) => !node.ignored);
    const manuscriptValidation = validationsList.filter((node) => node.type && node.type.startsWith('manuscript-'));
    const bibliographyValidation = validationsList.filter((node) => node.type && node.type.startsWith('bibliography-'));
    const figureValidation = validationsList.filter((node) => node.type && node.type.startsWith('figure-'));
    const requiredSectionValidation = validationsList.filter((node) => node.type === 'required-section');
    const sectionOrderValidation = validationsList.filter((node) => node.type === 'section-order');
    const sectionValidation = validationsList.filter((node) => node.type && node.type.startsWith('section-'));
    return (react_1.default.createElement(RequirementList, null,
        manuscriptValidation.length !== 0 && (react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: manuscriptValidation, title: 'Manuscript' },
            react_1.default.createElement(Requirement, null, manuscriptValidation.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate })))))),
        react_1.default.createElement(SectionValidations_1.SectionValidations, { sortedData: sectionValidation, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate }),
        requiredSectionValidation.length !== 0 && (react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: requiredSectionValidation, title: 'Required Section' },
            react_1.default.createElement(Requirement, null, requiredSectionValidation.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate })))))),
        bibliographyValidation.length !== 0 && (react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: bibliographyValidation, title: 'Bibliography' },
            react_1.default.createElement(Requirement, null, bibliographyValidation.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate })))))),
        figureValidation.length !== 0 && (react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: figureValidation, title: 'Figure' },
            react_1.default.createElement(Requirement, null, figureValidation.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate })))))),
        sectionOrderValidation.length !== 0 && (react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: sectionOrderValidation, title: 'Section Order' },
            react_1.default.createElement(Requirement, null, sectionOrderValidation.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate })))))),
        ignoredValidations.length !== 0 && (react_1.default.createElement(RequirementContainer_1.RequirementContainer, { result: ignoredValidations, title: 'Ignored' },
            react_1.default.createElement(Requirement, null, ignoredValidations.map((section) => section.message && (react_1.default.createElement(RequirementsData_1.RequirementsData, { node: section, key: section._id, modelMap: modelMap, manuscriptID: manuscriptID, bulkUpdate: bulkUpdate }))))))));
};
exports.RequirementsList = RequirementsList;
const RequirementList = styled_components_1.default.div `
  display: block;
`;
const Requirement = styled_components_1.default.div `
  padding: 15px 0 0 0;
`;
//# sourceMappingURL=RequirementsList.js.map