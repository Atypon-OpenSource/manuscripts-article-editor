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
exports.AllProjectsDropdownSection = exports.DropdownSection = exports.ProjectDropdownSection = exports.InvitationDropdownSection = void 0;
const ProjectIcon_1 = __importDefault(require("@manuscripts/assets/react/ProjectIcon"));
const ProjectsList_1 = __importDefault(require("@manuscripts/assets/react/ProjectsList"));
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const theme_1 = require("../../theme/theme");
const AcceptedLabel_1 = __importDefault(require("../AcceptedLabel"));
const AddButton_1 = require("../AddButton");
const Dropdown_1 = require("./Dropdown");
const activeStyle = {
    fontWeight: 600,
};
const ActionContainer = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 3}px;
`;
const DropdownIcon = styled_components_1.default.div `
  display: flex;
  padding-right: ${(props) => props.theme.grid.unit * 3}px;
`;
const DropdownWithNotificationIcon = styled_components_1.default.div `
  display: flex;
  padding-right: ${(props) => props.theme.grid.unit}px;
`;
const ButtonsContainer = styled_components_1.default.div `
  display: grid;
  padding-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const ProjectNameContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const AcceptButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  line-height: 1;
  font-size: ${(props) => props.theme.font.size.normal};
  margin-bottom: 4px;
`;
const RejectButton = styled_components_1.default(style_guide_1.SecondaryButton) `
  line-height: 1;
  font-size: ${(props) => props.theme.font.size.normal};
`;
const AvatarContainer = styled_components_1.default.div `
  display: flex;
  margin-left: 6px;
  align-items: center;
`;
const InvitedByText = styled_components_1.default.div `
  height: 20px;
`;
const InvitationDropdownSection = ({ invitation, invitingUserProfile, acceptInvitation, confirmReject, }) => (react_1.default.createElement(Dropdown_1.DropdownElement, null,
    react_1.default.createElement(ProjectNameContainer, null,
        react_1.default.createElement(DropdownWithNotificationIcon, null,
            react_1.default.createElement(style_guide_1.ProjectNotificationIcon, { color: theme_1.theme.colors.brand.default })),
        react_1.default.createElement(ButtonsContainer, null,
            react_1.default.createElement(title_editor_1.Title, { value: invitation.containerTitle || 'Untitled Invitation' }),
            react_1.default.createElement(Dropdown_1.InvitedBy, null,
                react_1.default.createElement(InvitedByText, null, "Invited by"),
                react_1.default.createElement(AvatarContainer, null,
                    react_1.default.createElement(style_guide_1.Avatar, { size: 20, src: invitingUserProfile.avatar, color: theme_1.theme.colors.brand.default }))))),
    react_1.default.createElement(ButtonsContainer, null,
        react_1.default.createElement(AcceptButton, { onClick: () => acceptInvitation(invitation) }, "Accept"),
        react_1.default.createElement(RejectButton, { onClick: () => confirmReject(invitingUserProfile, invitation) }, "Reject"))));
exports.InvitationDropdownSection = InvitationDropdownSection;
const ProjectDropdownSection = ({ project, accepted, handleClose, }) => (react_1.default.createElement(Dropdown_1.DropdownLink, { key: project._id, to: `/projects/${project._id}`, activeStyle: activeStyle, onClick: (event) => handleClose ? handleClose(event) : null },
    react_1.default.createElement(ProjectNameContainer, null,
        react_1.default.createElement(DropdownIcon, null,
            react_1.default.createElement(ProjectIcon_1.default, { color: theme_1.theme.colors.brand.default })),
        project.title ? (react_1.default.createElement(title_editor_1.Title, { value: project.title })) : (react_1.default.createElement(Dropdown_1.PlaceholderTitle, { value: 'Untitled Project' }))),
    accepted && react_1.default.createElement(AcceptedLabel_1.default, { backgroundColor: theme_1.theme.colors.brand.default })));
exports.ProjectDropdownSection = ProjectDropdownSection;
const DropdownSection = ({ children, onClick, }) => (react_1.default.createElement(ActionContainer, null,
    react_1.default.createElement(AddButton_1.AddButton, { action: onClick, size: 'default', title: children })));
exports.DropdownSection = DropdownSection;
const AllProjectsDropdownSection = ({ handleClose, }) => (react_1.default.createElement(Dropdown_1.DropdownLink, { key: 'projects', to: '/projects', exact: true, activeStyle: activeStyle, onClick: (event) => handleClose ? handleClose(event) : null },
    react_1.default.createElement(ProjectNameContainer, null,
        react_1.default.createElement(DropdownIcon, null,
            react_1.default.createElement(ProjectsList_1.default, { width: 24, height: 26 })),
        "View All Projects")));
exports.AllProjectsDropdownSection = AllProjectsDropdownSection;
//# sourceMappingURL=ProjectDropdown.js.map