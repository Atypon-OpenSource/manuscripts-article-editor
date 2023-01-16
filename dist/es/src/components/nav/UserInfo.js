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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const LogoutConfirmation_1 = require("../account/LogoutConfirmation");
const Messages_1 = require("../Messages");
const Dropdown_1 = require("./Dropdown");
const Name = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 3}px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: ${(props) => props.theme.font.weight.medium};
  user-select: none;
`;
// TODO: remove this once users have names
const emailPrefix = (email) => email.replace(/@.+/, '');
const displayName = (user) => {
    if (user.bibliographicName) {
        if (user.bibliographicName.given) {
            return user.bibliographicName.given;
        }
        if (user.bibliographicName.literal) {
            return user.bibliographicName.literal;
        }
    }
    if (user.email) {
        return emailPrefix(user.email);
    }
    return '';
};
const UserInfo = ({ user }) => {
    const handleLogout = react_1.useContext(LogoutConfirmation_1.LogoutConfirmationContext);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Name, null, displayName(user)),
        react_1.default.createElement(Dropdown_1.DropdownSeparator, null),
        react_1.default.createElement(Dropdown_1.DropdownLink, { to: '/profile' }, " Profile "),
        react_1.default.createElement(Dropdown_1.DropdownSeparator, null),
        react_1.default.createElement(Dropdown_1.DropdownLink, { to: '/diagnostics' }, "Diagnostics"),
        react_1.default.createElement(Dropdown_1.DropdownSeparator, null),
        react_1.default.createElement(Dropdown_1.DropdownLink, { to: "/logout", onClick: handleLogout },
            react_1.default.createElement(Messages_1.SignOutMessage, null))));
};
exports.UserInfo = UserInfo;
//# sourceMappingURL=UserInfo.js.map