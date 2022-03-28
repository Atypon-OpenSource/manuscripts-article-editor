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
exports.CollaboratorRolePopper = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Popper_1 = require("../Popper");
const CollaboratorRolesInput_1 = require("./CollaboratorRolesInput");
const AlertMessageContainer = styled_components_1.default.div `
  margin-bottom: 9px;
`;
const CollaboratorRolePopper = ({ selectedRole, handleRoleChange, switchMode, removeText, resendInvitation, resendSucceed, invitedUserEmail, selectedMode, isOnlyOwner, }) => (react_1.default.createElement(Popper_1.PopperBody, { size: 250 },
    isOnlyOwner && (react_1.default.createElement(AlertMessageContainer, null,
        react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info, hideCloseButton: true }, "Role change not permitted because you are the only owner."))),
    selectedMode === 'invite' &&
        resendSucceed !== null &&
        (resendSucceed ? (react_1.default.createElement(AlertMessageContainer, null,
            react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success },
                "Invitation has been re-sent to ",
                invitedUserEmail,
                "."))) : (react_1.default.createElement(AlertMessageContainer, null,
            react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error },
                "Failed to re-send invitation to ",
                invitedUserEmail,
                ".")))),
    react_1.default.createElement(CollaboratorRolesInput_1.CollaboratorRolesInput, { name: 'role', value: selectedRole, onChange: handleRoleChange, disabled: isOnlyOwner }),
    react_1.default.createElement(Popper_1.SeparatorLine, null),
    react_1.default.createElement(style_guide_1.ButtonGroup, null,
        react_1.default.createElement(style_guide_1.TertiaryButton, { onClick: switchMode, disabled: isOnlyOwner }, removeText),
        selectedMode === 'invite' && (react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: resendInvitation }, "Resend")))));
exports.CollaboratorRolePopper = CollaboratorRolePopper;
//# sourceMappingURL=CollaboratorRolePopper.js.map