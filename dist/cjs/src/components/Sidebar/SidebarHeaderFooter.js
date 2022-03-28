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
exports.SidebarHeader = exports.SidebarFooter = exports.SidebarTitle = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const commonStyles = styled_components_1.css `
  align-items: flex-start;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.grid.unit * 3}px;
`;
const StyledSidebarHeader = styled_components_1.default.div `
  ${commonStyles};
  margin-bottom: ${(props) => props.theme.grid.unit * 6}px;
`;
const StyledSidebarActionContainer = styled_components_1.default.div `
  margin-right: -16px;
`;
exports.SidebarTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  user-select: none;
  white-space: nowrap;
  width: 100%;
`;
exports.SidebarFooter = styled_components_1.default.div `
  ${commonStyles};
  margin-top: ${(props) => props.theme.grid.unit * 4}px;
`;
const SidebarHeader = ({ action, isCancel, cancelText, confirmText, title, }) => (react_1.default.createElement(StyledSidebarHeader, null,
    react_1.default.createElement(exports.SidebarTitle, null, title),
    action && (react_1.default.createElement(StyledSidebarActionContainer, null, isCancel ? (react_1.default.createElement(style_guide_1.TertiaryButton, { mini: true, onClick: action }, cancelText || 'Cancel')) : (react_1.default.createElement(style_guide_1.PrimaryButton, { mini: true, onClick: action }, confirmText || 'Done'))))));
exports.SidebarHeader = SidebarHeader;
//# sourceMappingURL=SidebarHeaderFooter.js.map