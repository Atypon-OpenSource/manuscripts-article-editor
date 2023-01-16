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
const ProjectsDropdownList_1 = require("../src/components/nav/ProjectsDropdownList");
const invitations_data_1 = __importDefault(require("./data/invitations-data"));
const projects_1 = __importDefault(require("./data/projects"));
react_1.storiesOf('Nav/Projects Dropdown List', module)
    .add('Without projects', () => (react_2.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { projects: [], invitationsData: [], acceptedInvitations: [], rejectedInvitations: [], acceptInvitation: addon_actions_1.action('accept invitation'), addProject: addon_actions_1.action('add project'), acceptError: null, confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection') })))
    .add('With projects', () => (react_2.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { projects: projects_1.default, invitationsData: [], acceptedInvitations: [], rejectedInvitations: [], acceptInvitation: addon_actions_1.action('accept invitation'), addProject: addon_actions_1.action('add project'), acceptError: null, confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection') })))
    .add('With only invitations', () => (react_2.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { projects: [], invitationsData: invitations_data_1.default, acceptedInvitations: [
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
    ], rejectedInvitations: [], acceptInvitation: addon_actions_1.action('accept invitation'), addProject: addon_actions_1.action('add project'), acceptError: null, confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection') })))
    .add('With projects and invitations', () => (react_2.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { projects: projects_1.default, invitationsData: invitations_data_1.default, acceptedInvitations: [
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
    ], rejectedInvitations: [], acceptInvitation: addon_actions_1.action('accept invitation'), addProject: addon_actions_1.action('add project'), acceptError: null, confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection') })))
    .add('With rejected invitations', () => (react_2.default.createElement(ProjectsDropdownList_1.ProjectsDropdownList, { projects: projects_1.default, invitationsData: invitations_data_1.default, acceptedInvitations: [
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
    ], rejectedInvitations: [
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f547',
    ], acceptInvitation: addon_actions_1.action('accept invitation'), addProject: addon_actions_1.action('add project'), acceptError: null, confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection') })));
//# sourceMappingURL=ProjectsDropdownList.stories.js.map