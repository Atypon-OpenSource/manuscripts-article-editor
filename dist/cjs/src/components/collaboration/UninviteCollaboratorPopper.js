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
exports.UninviteCollaboratorPopper = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Popper_1 = require("../Popper");
const CollaboratorName = styled_components_1.default.div `
  text-align: center;
  font-size: ${(props) => props.theme.font.size.xlarge};
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.semibold};
  padding-bottom: ${(props) => props.theme.grid.unit * 3}px;
`;
const AvatarStyle = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  padding-top: ${(props) => props.theme.grid.unit * 3}px;
  padding-bottom: ${(props) => props.theme.grid.unit}px;
`;
const Action = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.semibold};
  padding-left: ${(props) => props.theme.grid.unit}px;
`;
const Message = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.colors.text.primary};
  padding-bottom: ${(props) => props.theme.grid.unit * 4}px;
`;
const Description = styled_components_1.default.div `
  display: flex;
  padding-bottom: ${(props) => props.theme.grid.unit * 2}px;
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  white-space: normal;
`;
const ButtonsContainer = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
`;
const UninviteCollaboratorPopper = ({ invitedUserName, handleUninvite, switchMode, }) => (react_1.default.createElement(Popper_1.PopperBody, null,
    react_1.default.createElement(Message, null,
        "Are you sure you want to ",
        react_1.default.createElement(Action, null, "uninvite")),
    react_1.default.createElement(AvatarStyle, null,
        react_1.default.createElement(style_guide_1.Avatar, { size: 45, color: '#6e6e6e' })),
    react_1.default.createElement(CollaboratorName, null, invitedUserName),
    react_1.default.createElement(Message, null, "from the Contributors list?"),
    react_1.default.createElement(Description, null,
        invitedUserName,
        " won't get an invitation to view or modify any content of the project anymore"),
    react_1.default.createElement(Popper_1.SeparatorLine, null),
    react_1.default.createElement(ButtonsContainer, null,
        react_1.default.createElement(style_guide_1.TertiaryButton, { onClick: switchMode }, "Cancel"),
        react_1.default.createElement(style_guide_1.TertiaryButton, { onClick: handleUninvite }, "Uninvite"))));
exports.UninviteCollaboratorPopper = UninviteCollaboratorPopper;
//# sourceMappingURL=UninviteCollaboratorPopper.js.map