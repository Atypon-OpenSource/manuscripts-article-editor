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
const AddCollaboratorButton_1 = __importDefault(require("../src/components/collaboration/AddCollaboratorButton"));
const CollaboratorSettingsButton_1 = __importDefault(require("../src/components/collaboration/CollaboratorSettingsButton"));
const InvitedCollaboratorSettingsButton_1 = __importDefault(require("../src/components/collaboration/InvitedCollaboratorSettingsButton"));
const InviteAuthorButton_1 = __importDefault(require("../src/components/metadata/InviteAuthorButton"));
const contributors_1 = require("./data/contributors");
const invitations_data_1 = require("./data/invitations-data");
const people_1 = require("./data/people");
const projects_1 = require("./data/projects");
react_1.storiesOf('Collaboration/Popper Buttons', module)
    .add('CollaboratorSettingsButton', () => (react_2.default.createElement(CollaboratorSettingsButton_1.default, { project: projects_1.project, collaborator: people_1.people[0], updateUserRole: addon_actions_1.action('update role'), openPopper: addon_actions_1.action('open popper'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('InvitedCollaboratorSettingsButton', () => (react_2.default.createElement(InvitedCollaboratorSettingsButton_1.default, { invitation: invitations_data_1.invitations[0], openPopper: addon_actions_1.action('open popper'), projectInvite: addon_actions_1.action('project invite'), projectUninvite: addon_actions_1.action('project uninvite'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('AddCollaboratorButton', () => (react_2.default.createElement(AddCollaboratorButton_1.default, { collaborator: people_1.people[0], countAddedCollaborators: addon_actions_1.action('count collaborators'), addCollaborator: addon_actions_1.action('add collaborator'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })));
react_1.storiesOf('Metadata/Popper Buttons', module).add('InviteAuthorButton', () => (react_2.default.createElement(InviteAuthorButton_1.default, { author: contributors_1.authors[0], project: projects_1.project, updateAuthor: addon_actions_1.action('update author'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })));
//# sourceMappingURL=PopperButtons.stories.js.map