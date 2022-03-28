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
exports.Invitation = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const name_1 = require("../../lib/name");
const Badge_1 = require("../Badge");
const Dropdown_1 = require("../nav/Dropdown");
const Container = styled_components_1.default.div `
  display: grid;
  margin-right: 5px;
`;
const ButtonsContainer = styled_components_1.default(Container) `
  margin-top: -10px;
`;
const ProjectNameContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const InvitedBy = styled_components_1.default.div `
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.font.size.normal};
  letter-spacing: -0.3px;
  color: ${(props) => props.theme.colors.text.secondary};
  clear: both;
  margin-top: 15px;
`;
const AcceptButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.medium};
  background-color: ${(props) => props.theme.colors.brand.default};
  padding: 0 ${(props) => props.theme.grid.unit * 2}px;
  margin-bottom: 4px;

  &:hover {
    color: ${(props) => props.theme.colors.brand.default};
    border-color: ${(props) => props.theme.colors.brand.default};
  }
`;
const RejectButton = styled_components_1.default(style_guide_1.SecondaryButton) `
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.medium};
  padding: 0 ${(props) => props.theme.grid.unit * 2}px;
  color: ${(props) => props.theme.colors.text.secondary};

  &:hover {
    color: ${(props) => props.theme.colors.brand.default};
    border-color: ${(props) => props.theme.colors.brand.default};
  }
`;
const AvatarContainer = styled_components_1.default.div `
  margin-left: ${(props) => props.theme.grid.unit}px;
`;
const InvitationElement = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 4}px;
  box-shadow: 0 1px 0 0 ${(props) => props.theme.colors.border.secondary};
  width: 100%;
  max-width: 532px;
  border-radius: 0;
  border-top: 1px solid transparent;

  &:hover {
    background-color: ${(props) => props.theme.colors.background.fifth};
    box-shadow: unset;
  }

  @media (max-width: 480px) {
    width: unset;
  }
`;
const NotificationsBadge = styled_components_1.default(Badge_1.Badge) `
  margin-right: 4px;
  color: ${(props) => props.theme.colors.text.onDark};
  background-color: ${(props) => props.theme.colors.background.success};
  font-size: 9px;
  min-width: 10px;
  min-height: 10px;
  font-family: ${(props) => props.theme.font.family.sans};
`;
const InvitationTitle = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.xlarge};
  font-weight: ${(props) => props.theme.font.weight.medium};
  font-style: normal;
  flex: 1;
  color: inherit;
  text-decoration: none;
  display: block;
`;
const buildNameLiteral = (name) => [name_1.initials(name), name.family, name.suffix].filter((part) => part).join(' ');
const Invitation = ({ invitation, invitingUserProfile, acceptInvitation, confirmReject, }) => (react_1.default.createElement(InvitationElement, null,
    react_1.default.createElement(ProjectNameContainer, null,
        react_1.default.createElement(Container, null,
            react_1.default.createElement(InvitationTitle, null, invitation.containerTitle ? (react_1.default.createElement(title_editor_1.Title, { value: invitation.containerTitle })) : (react_1.default.createElement(Dropdown_1.PlaceholderTitle, { value: 'Untitled Invitation' }))),
            react_1.default.createElement(InvitedBy, null,
                react_1.default.createElement(NotificationsBadge, null, " ! "),
                "Invited by",
                react_1.default.createElement(AvatarContainer, null,
                    buildNameLiteral(invitingUserProfile.bibliographicName),
                    " (",
                    invitingUserProfile.email,
                    ")")))),
    react_1.default.createElement(ButtonsContainer, null,
        react_1.default.createElement(AcceptButton, { onClick: () => acceptInvitation(invitation) }, "Accept"),
        react_1.default.createElement(RejectButton, { onClick: () => confirmReject(invitingUserProfile, invitation) }, "Reject"))));
exports.Invitation = Invitation;
//# sourceMappingURL=InvitationElement.js.map