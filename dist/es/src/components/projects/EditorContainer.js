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
exports.EditorBody = exports.EditorHeader = exports.EditorContainerInner = exports.EditorContainer = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.EditorContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.theme.grid.unit * 8}px;
  right: ${(props) => props.theme.grid.unit * 8}px;
  overflow: hidden;
  background: ${(props) => props.theme.colors.background.primary};
`;
exports.EditorContainerInner = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 960px;
  max-width: 100%;
  background: ${(props) => props.theme.colors.background.primary};
  border-bottom: none;
  border-top: none;
`;
exports.EditorHeader = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 14}px 0;
  background: ${(props) => props.theme.colors.background.primary};
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) ${(props) => props.theme.grid.unit * 4}px
  );
  z-index: 5;
`;
exports.EditorBody = styled_components_1.default.div `
  flex: 1;
  overflow-y: auto;
  padding: ${(props) => props.theme.grid.unit * 5}px
    ${(props) => props.theme.grid.unit * 2}px 0;
`;
//# sourceMappingURL=EditorContainer.js.map