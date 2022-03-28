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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarContent = exports.ModalBody = exports.StyledModalMain = exports.ModalSidebar = exports.Sidebar = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const styled_components_1 = __importStar(require("styled-components"));
const SidebarCommonStyles = styled_components_1.css `
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 2}px;
  width: 100%;
  overflow: hidden;
`;
exports.Sidebar = styled_components_1.default.div `
  ${SidebarCommonStyles};
  background: ${(props) => props.theme.colors.background.secondary};
  border-right: 1px solid ${(props) => props.theme.colors.border.tertiary};
`;
exports.ModalSidebar = styled_components_1.default.div `
  ${SidebarCommonStyles};
  background-color: ${(props) => props.theme.colors.background.secondary};
  border-top-left-radius: ${(props) => props.theme.grid.radius.default};
  border-bottom-left-radius: ${(props) => props.theme.grid.radius.default};
  max-width: 40vw;
  overflow: auto;
  width: 340px;
`;
exports.StyledModalMain = styled_components_1.default(style_guide_1.ModalMain) `
  box-sizing: border-box;
  max-width: 60vw;
  width: 480px;
`;
exports.ModalBody = styled_components_1.default.div `
  align-items: stretch;
  display: flex;
  flex: 1;
  height: 90vh;
  max-height: 680px;
`;
exports.SidebarContent = styled_components_1.default.div `
  flex: 1;
  padding: 0 ${(props) => props.theme.grid.unit * 3}px;
  position: relative;
  flex-shrink: 0;
  overflow-y: auto;
`;
//# sourceMappingURL=Sidebar.js.map