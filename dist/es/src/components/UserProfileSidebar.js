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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../config"));
const Sidebar_1 = require("./Sidebar");
const UserEmail = styled_components_1.default.div `
  font-weight: ${(props) => props.theme.font.weight.medium};
  text-align: center;
`;
const MemberSince = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.normal};
  text-align: center;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 10px;
  margin-bottom: 40px;
`;
const EditButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  padding-left: 7px;
  padding-right: 7px;

  &:hover {
    background: ${(props) => props.theme.colors.background.primary};
  }
`;
const AvatarContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
`;
const RoundedBorders = styled_components_1.default.div `
  width: 150px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.background.secondary};
  border: solid 1px ${(props) => props.theme.colors.border.primary};
  border-radius: 50%;
`;
const ChangePasswordButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  width: 100%;
  margin-bottom: 10px;
`;
const DeleteAccountButton = styled_components_1.default(style_guide_1.TertiaryButton) `
  width: 100%;
`;
const AddProfileButtonContainer = styled_components_1.default.div `
  position: relative;
  bottom: 37px;
  display: flex;
  justify-content: center;
`;
const EditButtonContainer = styled_components_1.default.div `
  position: relative;
  bottom: 27px;
  display: flex;
  justify-content: center;
`;
const UserProfileSidebar = ({ userWithAvatar, handleChangePassword, handleDeleteAccount, handleEditAvatar, }) => (react_1.default.createElement(Sidebar_1.ModalSidebar, null,
    react_1.default.createElement(Sidebar_1.SidebarContent, null,
        react_1.default.createElement(AvatarContainer, null, !userWithAvatar.avatar ? (react_1.default.createElement(style_guide_1.Avatar, { size: 150, color: '#6e6e6e' })) : (react_1.default.createElement(RoundedBorders, null,
            react_1.default.createElement(style_guide_1.Avatar, { size: 150, src: userWithAvatar.avatar })))),
        !userWithAvatar.avatar ? (react_1.default.createElement(AddProfileButtonContainer, null,
            react_1.default.createElement(EditButton, { onClick: handleEditAvatar }, "Add Picture"))) : (react_1.default.createElement(EditButtonContainer, null,
            react_1.default.createElement(EditButton, { onClick: handleEditAvatar }, "Edit"))),
        react_1.default.createElement(UserEmail, null, userWithAvatar.email),
        react_1.default.createElement(MemberSince, null,
            "Member since",
            ' ',
            react_1.default.createElement(react_intl_1.FormattedDate, { value: userWithAvatar.createdAt * 1000, year: 'numeric', month: 'short', day: 'numeric' })),
        react_1.default.createElement(ChangePasswordButton, { onClick: handleChangePassword }, config_1.default.connect.enabled ? 'Manage Password' : 'Change Password'),
        react_1.default.createElement(DeleteAccountButton, { onClick: handleDeleteAccount }, "Delete Account"))));
exports.default = UserProfileSidebar;
//# sourceMappingURL=UserProfileSidebar.js.map