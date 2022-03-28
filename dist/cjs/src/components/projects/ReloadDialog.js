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
exports.ReloadDialog = void 0;
const AttentionRed_1 = __importDefault(require("@manuscripts/assets/react/AttentionRed"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ContactSupportButton_1 = require("../ContactSupportButton");
const Message = ({ message }) => (react_1.default.createElement("div", null,
    react_1.default.createElement("p", null, message || 'Failed to open project for editing due to an error.'),
    react_1.default.createElement("p", null,
        "If the problem persists, please",
        ' ',
        react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support."))));
const Icon = styled_components_1.default(AttentionRed_1.default) `
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
  color: ${(props) => props.theme.colors.background.warning};
`;
const ModalBody = styled_components_1.default.div `
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  font-family: ${(props) => props.theme.font.family.sans};
`;
const Header = styled_components_1.default.div `
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.medium};
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const Body = styled_components_1.default.div `
  max-width: 300px;
  min-height: 100px;
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.secondary};
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;

  & a {
    color: inherit;
  }
`;
const Actions = styled_components_1.default(style_guide_1.ButtonGroup) `
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const navigateToProjectsList = () => {
    window.location.assign('/projects');
};
const reloadPage = () => {
    window.location.reload();
};
const ReloadDialog = ({ message, handleDownload, }) => (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: true, onRequestClose: navigateToProjectsList, shouldCloseOnOverlayClick: true },
    react_1.default.createElement(ModalBody, null,
        react_1.default.createElement(Header, null,
            react_1.default.createElement(Icon, null),
            " Failed to open project for editing"),
        react_1.default.createElement(Body, null,
            react_1.default.createElement(Message, { message: message }),
            handleDownload && (react_1.default.createElement(style_guide_1.TertiaryButton, { onClick: handleDownload }, "Download Project"))),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(style_guide_1.TertiaryButton, { onClick: navigateToProjectsList }, "View projects"),
            react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: reloadPage }, "Retry")))));
exports.ReloadDialog = ReloadDialog;
//# sourceMappingURL=ReloadDialog.js.map