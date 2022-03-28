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
exports.ProjectsListPlaceholder = void 0;
const DocIcon_1 = __importDefault(require("@manuscripts/assets/react/DocIcon"));
const MarkdownIcon_1 = __importDefault(require("@manuscripts/assets/react/MarkdownIcon"));
const TeXIcon_1 = __importDefault(require("@manuscripts/assets/react/TeXIcon"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const AddButton_1 = require("../AddButton");
const Placeholders_1 = require("../Placeholders");
const OuterContainer = styled_components_1.default.div `
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: ${(props) => props.theme.font.size.xlarge};
  justify-content: center;
  line-height: ${(props) => props.theme.font.lineHeight.large};
  text-align: center;
`;
const Placeholder = styled_components_1.default.div ``;
const Title = styled_components_1.default.div `
  font-size: 24px;
  padding-left: ${(props) => props.theme.grid.unit * 3}px;
`;
const ActionContainer = styled_components_1.default.div `
  margin-top: ${(props) => props.theme.grid.unit * 10}px;
`;
const FontStyle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.large};
  font-weight: ${(props) => props.theme.font.weight.light};
`;
const Text = styled_components_1.default(FontStyle) `
  padding-top: ${(props) => props.theme.grid.unit * 5}px;
  color: ${(props) => props.theme.colors.text.secondary};
`;
const InnerText = styled_components_1.default(FontStyle) `
  max-width: 620px;
  margin: auto;
`;
const OuterText = styled_components_1.default(FontStyle) ``;
const UploadFileType = styled_components_1.default.span `
  display: inline-block;
  margin: 0 10px;
`;
const UploadFileTypes = styled_components_1.default.div `
  margin-top: ${(props) => props.theme.grid.unit * 11}px;
  display: flex;
  justify-content: center;
`;
const BrowseLink = styled_components_1.default.span `
  color: ${(props) => props.theme.colors.text.tertiary};
  cursor: pointer;
  margin: 0 2px;
  text-decoration: underline;
`;
const ProjectsListPlaceholder = ({ handleClick, openTemplateSelector, isDragAccept, }) => (react_1.default.createElement(OuterContainer, null,
    react_1.default.createElement(Placeholder, null,
        react_1.default.createElement(Placeholders_1.ProjectPlaceholder, null)),
    !isDragAccept ? (react_1.default.createElement(ActionContainer, null,
        react_1.default.createElement(AddButton_1.AddButton, { action: openTemplateSelector, id: 'create-project', size: 'large', title: 'Create Your First Project' }))) : (react_1.default.createElement(Title, null, "Drop File to Import")),
    !isDragAccept ? (react_1.default.createElement(Text, null,
        react_1.default.createElement(OuterText, null, "You can opt for a blank project or choose one of the many templates available."),
        react_1.default.createElement(InnerText, null,
            "You can also import a project by dragging a file to this window or",
            react_1.default.createElement(BrowseLink, { onClick: handleClick }, "browsing"),
            " for it."))) : (react_1.default.createElement(Text, null, "Create a new project from the file by dropping it here.")),
    react_1.default.createElement(UploadFileTypes, null,
        react_1.default.createElement(UploadFileType, null,
            react_1.default.createElement(TeXIcon_1.default, null)),
        react_1.default.createElement(UploadFileType, null,
            react_1.default.createElement(DocIcon_1.default, null)),
        react_1.default.createElement(UploadFileType, null,
            react_1.default.createElement(MarkdownIcon_1.default, null)))));
exports.ProjectsListPlaceholder = ProjectsListPlaceholder;
//# sourceMappingURL=ProjectsListPlaceholder.js.map