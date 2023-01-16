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
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const Dropdown_1 = require("../src/components/nav/Dropdown");
const ProjectsDropdown_1 = require("../src/components/nav/ProjectsDropdown");
const ProjectsDropdownList_1 = require("../src/components/nav/ProjectsDropdownList");
const UserInfo_1 = require("../src/components/nav/UserInfo");
const contributors_1 = require("./data/contributors");
const projects_1 = __importDefault(require("./data/projects"));
react_1.storiesOf('Nav/Dropdown', module)
    .add('Menu', () => (react_2.default.createElement(Dropdown_1.DropdownContainer, null,
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false, onClick: addon_actions_1.action('toggle') }, "Menu"),
    react_2.default.createElement(Dropdown_1.Dropdown, null,
        react_2.default.createElement(UserInfo_1.UserInfo, { user: contributors_1.user })))))
    .add('Menu - Projects Dropdown', () => (react_2.default.createElement(ProjectsDropdown_1.ProjectsDropdown, { notificationsCount: 0 },
    react_2.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { projects: projects_1.default, invitationsData: [], acceptedInvitations: [], rejectedInvitations: [], acceptInvitation: addon_actions_1.action('accept invitation'), addProject: addon_actions_1.action('add project'), acceptError: null, confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection') }))))
    .add('Button', () => (react_2.default.createElement("div", null,
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false }, "Closed"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: true }, "Open"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false, notificationsCount: 3 }, "Closed with notifications"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: true, notificationsCount: 3 }, "Open with notifications"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false, notificationsCount: 30 }, "More notifications"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false, notificationsCount: 300 }, "More notifications"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false, notificationsCount: 3000 }, "More notifications"),
    react_2.default.createElement(Dropdown_1.DropdownButton, { isOpen: false, removeChevron: true }, "Without Chevron"))));
//# sourceMappingURL=Dropdown.stories.js.map