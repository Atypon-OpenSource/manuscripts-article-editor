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
exports.RequirementContainer = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_dropdown_1 = require("../../hooks/use-dropdown");
const RequirementsIcons_1 = require("./RequirementsIcons");
const RequirementContainer = ({ title, result, children, }) => {
    const failedResults = result.filter((node) => !node.passed && !node.ignored);
    const { toggleOpen, isOpen } = use_dropdown_1.useDropdown(failedResults.length !== 0);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Data, { onClick: toggleOpen },
            react_1.default.createElement(Icon, null, failedResults.length === 0 ? (react_1.default.createElement(RequirementsIcons_1.ValidationPassedIcon, null)) : (react_1.default.createElement(RequirementsIcons_1.ValidationDangerIcon, null))),
            react_1.default.createElement(Title, null, title),
            react_1.default.createElement(ExpanderButton, null, isOpen ? react_1.default.createElement(RequirementsIcons_1.ArrowUpIcon, null) : react_1.default.createElement(RequirementsIcons_1.ArrowDownIcon, null))),
        isOpen && react_1.default.createElement(react_1.default.Fragment, null, children)));
};
exports.RequirementContainer = RequirementContainer;
const ExpanderButton = styled_components_1.default.div `
  cursor: pointer;
`;
const Container = styled_components_1.default.div `
  padding: 0 0 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin: 24px 28px 0;
`;
const Title = styled_components_1.default.div `
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  flex: 0.96;
  cursor: pointer;
`;
const Icon = styled_components_1.default.div `
  display: inline-flex;
  padding: 3px 11px 0 0;
`;
const Data = styled_components_1.default.div `
  display: flex;
  padding: 20px 0 0 21px;
`;
//# sourceMappingURL=RequirementContainer.js.map