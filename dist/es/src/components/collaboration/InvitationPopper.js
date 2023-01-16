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
exports.InvitationPopper = exports.ShareProjectTitle = exports.ShareProjectHeader = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const roles_1 = require("../../lib/roles");
const Popper_1 = require("../Popper");
const InvitationForm_1 = require("./InvitationForm");
exports.ShareProjectHeader = styled_components_1.default.div `
  align-items: center;
  display: flex;
  padding-bottom: ${(props) => props.theme.grid.unit * 7}px;
  justify-content: space-between;
`;
exports.ShareProjectTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  line-height: normal;
  letter-spacing: -0.9px;
  color: ${(props) => props.theme.colors.text.primary};
  display: inline-block;
  padding-right: ${(props) => props.theme.grid.unit * 5}px;
  font-family: ${(props) => props.theme.font.family.sans};
`;
const InvitationPopper = ({ user, project, handleSwitching, handleInvitationSubmit, tokenActions, }) => {
    const isProjectOwner = roles_1.isOwner(project, user.userID);
    return (react_1.default.createElement(Popper_1.PopperBody, null,
        react_1.default.createElement(exports.ShareProjectHeader, null,
            react_1.default.createElement(exports.ShareProjectTitle, null, "Share Project"),
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(style_guide_1.ToggleButton, { onClick: () => handleSwitching(false) }, "Link"),
                react_1.default.createElement(style_guide_1.ToggleButton, { selected: true }, "Invite"))),
        react_1.default.createElement(InvitationForm_1.InvitationForm, { allowSubmit: isProjectOwner, handleSubmit: handleInvitationSubmit, tokenActions: tokenActions })));
};
exports.InvitationPopper = InvitationPopper;
//# sourceMappingURL=InvitationPopper.js.map