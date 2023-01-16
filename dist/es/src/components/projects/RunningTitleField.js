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
exports.RunningTitleField = void 0;
const title_editor_1 = require("@manuscripts/title-editor");
const styled_components_1 = __importDefault(require("styled-components"));
exports.RunningTitleField = styled_components_1.default(title_editor_1.TitleField) `
  & .ProseMirror {
    font-family: ${(props) => props.theme.font.family.sans};
    font-size: ${(props) => props.theme.font.size.medium};
    line-height: 1.25;
    color: ${(props) => props.theme.colors.text.primary};
    border-radius: ${(props) => props.theme.grid.radius.small};
    border: 1px solid ${(props) => props.theme.colors.text.muted};
    padding: ${(props) => props.theme.grid.unit * 2}px
      ${(props) => props.theme.grid.unit * 3}px;

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.colors.border.field.hover};
      background-color: ${(props) => props.theme.colors.background.fifth};
    }
  }
`;
//# sourceMappingURL=RunningTitleField.js.map