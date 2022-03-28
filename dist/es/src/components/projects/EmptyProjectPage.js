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
exports.EmptyProjectPage = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const authorization_1 = require("../../lib/authorization");
const AddButton_1 = require("../AddButton");
const NotificationMessage_1 = require("../NotificationMessage");
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
const ActionContainer = styled_components_1.default.div ``;
const Message = styled_components_1.default.div `
  font-weight: ${(props) => props.theme.font.weight.light};
  padding-top: ${(props) => props.theme.grid.unit * 5}px;
  color: ${(props) => props.theme.colors.text.secondary};
`;
const TextContainer = styled_components_1.default.div `
  letter-spacing: -0.8px;
  padding-top: 6px;
`;
const EmptyProjectPage = ({ openTemplateSelector, message, hasPullError, isUnauthorized, restartSync, }) => {
    return (react_1.default.createElement(OuterContainer, null,
        message && react_1.default.createElement(NotificationMessage_1.Notification, { message: message, id: 'empty-project' }),
        react_1.default.createElement(Placeholder, null,
            react_1.default.createElement(Placeholders_1.ProjectPlaceholder, null)),
        react_1.default.createElement(ActionContainer, null,
            react_1.default.createElement(AddButton_1.AddButton, { action: openTemplateSelector, size: 'large', title: 'New Manuscript' })),
        hasPullError && isUnauthorized ? (react_1.default.createElement(Message, null,
            react_1.default.createElement(TextContainer, null, "Missing manuscript data: sign in again to sync"),
            react_1.default.createElement(TextContainer, null,
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: authorization_1.loginAgain }, "Sign in")))) : hasPullError ? (react_1.default.createElement(Message, null,
            react_1.default.createElement(TextContainer, null, "Error while pulling data: there may be manuscripts which are missing locally"),
            react_1.default.createElement(TextContainer, null,
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: restartSync }, "Restart sync")))) : (react_1.default.createElement(Message, null,
            react_1.default.createElement(TextContainer, null, "This project is empty."),
            react_1.default.createElement(TextContainer, null, "Create a manuscript to get started.")))));
};
exports.EmptyProjectPage = EmptyProjectPage;
//# sourceMappingURL=EmptyProjectPage.js.map