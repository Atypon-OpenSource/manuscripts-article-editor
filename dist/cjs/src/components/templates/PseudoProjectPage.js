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
exports.PseudoProjectPage = exports.Overlay = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Page_1 = require("../Page");
const Sidebar_1 = require("../Sidebar");
const Container = styled_components_1.default.div `
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
exports.Overlay = styled_components_1.default.div `
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(props) => props.theme.colors.background.dark};
  opacity: 0.75;
`;
const pseudoProject = {
    _id: 'MPProject:pseudo',
    objectType: manuscripts_json_schema_1.ObjectTypes.Project,
    owners: [],
    writers: [],
    viewers: [],
    createdAt: 0,
    updatedAt: 0,
};
const ProjectTitle = styled_components_1.default(Sidebar_1.SidebarTitle) `
  border: 1px solid transparent;
  color: ${(props) => props.theme.colors.text.primary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.medium};
  margin: -${(props) => props.theme.grid.unit}px 0 -${(props) => props.theme.grid.unit}px;
  overflow: hidden;
  padding: ${(props) => props.theme.grid.unit}px;

  .ProseMirror.empty-node::before {
    color: ${(props) => props.theme.colors.text.muted};
    cursor: text;
    content: 'Untitled Project';
    max-width: 100%;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    text-overflow: ellipsis;
  }
`;
const PseudoProjectPage = () => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(Container, null,
        react_1.default.createElement(Page_1.Page, { project: pseudoProject },
            react_1.default.createElement(Sidebar_1.Sidebar, { "data-cy": 'pseudo-project' },
                react_1.default.createElement(Sidebar_1.SidebarHeader, { title: react_1.default.createElement(ProjectTitle, null,
                        react_1.default.createElement(title_editor_1.TitleField, { editable: false, value: '', handleChange: () => null })) })),
            react_1.default.createElement(Page_1.Main, null))),
    react_1.default.createElement(exports.Overlay, null)));
exports.PseudoProjectPage = PseudoProjectPage;
//# sourceMappingURL=PseudoProjectPage.js.map