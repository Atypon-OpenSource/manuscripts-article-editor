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
exports.ShareURIPopper = exports.MiniText = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const roles_1 = require("../../lib/roles");
const Popper_1 = require("../Popper");
const RadioButton_1 = require("../RadioButton");
const InvitationPopper_1 = require("./InvitationPopper");
const URIFieldContainer = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.border.field.default};
  border-radius: ${(props) => props.theme.grid.radius.small};
  display: flex;
  flex: 1;
  margin-bottom: ${(props) => props.theme.grid.unit * 5}px;

  & ${style_guide_1.TextField} {
    border: none;
  }

  & ${style_guide_1.SecondaryButton} {
    border: none;
    color: ${(props) => props.theme.colors.brand.default};
  }
`;
const AlertMessageContainer = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
exports.MiniText = styled_components_1.default.span `
  font-size: ${(props) => props.theme.font.size.normal};
  letter-spacing: -0.3px;
  text-align: left;
  color: ${(props) => props.theme.colors.text.secondary};
  clear: both;
  display: block;
  margin-bottom: ${(props) => props.theme.grid.unit * 3}px;
`;
const ShareURIField = ({ isCopied, handleCopy, URI, }) => (react_1.default.createElement(react_1.default.Fragment, null, isCopied ? (react_1.default.createElement(AlertMessageContainer, null,
    react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success, dismissButton: { text: 'OK', action: handleCopy }, hideCloseButton: true }, "Link copied to clipboard."))) : (react_1.default.createElement(URIFieldContainer, null,
    react_1.default.createElement(style_guide_1.TextField, { name: 'url', type: 'text', disabled: true, value: URI, style: { backgroundColor: 'white' } }),
    react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: handleCopy }, "COPY")))));
const ShareURIForm = ({ loadingURIError, selectedRole, isCopied, isProjectOwner, handleChange, }) => (react_1.default.createElement(react_1.default.Fragment, null, !loadingURIError && (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(exports.MiniText, null, "Anyone with the link can join as:"),
    react_1.default.createElement(RadioButton_1.RadioButton, { _id: 'writer', name: 'role', checked: selectedRole === 'Writer', value: 'Writer', disabled: isCopied || !isProjectOwner, textHint: 'Can modify project contents', onChange: handleChange }, "Writer"),
    react_1.default.createElement(RadioButton_1.RadioButton, { _id: 'viewer', name: 'role', checked: selectedRole === 'Viewer', value: 'Viewer', disabled: isCopied || !isProjectOwner, textHint: 'Can only review projects without modifying it', onChange: handleChange }, "Viewer")))));
const ShareURIPopper = ({ dataLoaded, URI, selectedRole, isCopied, user, project, requestURI, handleChange, handleCopy, handleSwitching, loadingURIError, }) => {
    const isProjectOwner = roles_1.isOwner(project, user.userID);
    return (react_1.default.createElement(Popper_1.PopperBody, null,
        react_1.default.createElement(InvitationPopper_1.ShareProjectHeader, null,
            react_1.default.createElement(InvitationPopper_1.ShareProjectTitle, null, "Share Project"),
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(style_guide_1.ToggleButton, { selected: true }, "Link"),
                react_1.default.createElement(style_guide_1.ToggleButton, { onClick: () => handleSwitching(true) }, "Invite"))),
        !isProjectOwner || dataLoaded ? (react_1.default.createElement(react_1.default.Fragment, null,
            !isProjectOwner ? (react_1.default.createElement(AlertMessageContainer, null,
                react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info, hideCloseButton: true }, "Only project owners can share links to the document."))) : (react_1.default.createElement(react_1.default.Fragment, null, loadingURIError ? (react_1.default.createElement(AlertMessageContainer, null,
                react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error, hideCloseButton: true, dismissButton: { text: 'Retry', action: requestURI } }, "Retrieving sharing link failed."))) : (react_1.default.createElement(ShareURIField, { URI: URI, isCopied: isCopied, handleCopy: handleCopy })))),
            react_1.default.createElement(ShareURIForm, { isCopied: isCopied, isProjectOwner: isProjectOwner, handleChange: handleChange, selectedRole: selectedRole, loadingURIError: loadingURIError }))) : (react_1.default.createElement(react_1.default.Fragment, null, loadingURIError ? (react_1.default.createElement(AlertMessageContainer, null,
            react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error, hideCloseButton: true, dismissButton: { text: 'Retry', action: requestURI } }, "Retrieving sharing link failed."))) : (react_1.default.createElement("div", null, "Thinking..."))))));
};
exports.ShareURIPopper = ShareURIPopper;
//# sourceMappingURL=ShareURIPopper.js.map