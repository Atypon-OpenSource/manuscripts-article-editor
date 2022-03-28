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
const ProjectsMenu_1 = __importDefault(require("../src/components/nav/ProjectsMenu"));
const EmptyProjectPage_1 = require("../src/components/projects/EmptyProjectPage");
// import { ProjectsList } from '../src/components/projects/ProjectsList'
const contributors_1 = require("./data/contributors");
const people_1 = require("./data/people");
const projects_1 = __importDefault(require("./data/projects"));
const users = new Map();
for (const person of people_1.people) {
    users.set(person._id, person);
}
react_1.storiesOf('Projects', module)
    /*.add('Projects Page', () => (
      <ProjectsList
        projects={projects}
        deleteProject={action('delete project')}
        saveProjectTitle={action('save project title')}
        user={user}
        acceptedInvitations={[]}
        tokenActions={{
          delete: action('delete token'),
          update: action('update token'),
        }}
      />
    ))*/
    .add('Projects Page - Empty', () => (react_2.default.createElement(EmptyProjectPage_1.EmptyProjectPage, { openTemplateSelector: addon_actions_1.action('open template selector '), hasPullError: false, restartSync: addon_actions_1.action('cancel syncing and reinitialize collection') })))
    .add('Projects Page - Empty due to pull error', () => (react_2.default.createElement(EmptyProjectPage_1.EmptyProjectPage, { openTemplateSelector: addon_actions_1.action('open template selector '), hasPullError: true, restartSync: addon_actions_1.action('cancel syncing and reinitialize collection') })))
    .add('Projects Menu', () => (react_2.default.createElement(ProjectsMenu_1.default, { invitationsData: [], removeInvitationData: addon_actions_1.action('remove'), projects: projects_1.default, acceptedInvitations: [], rejectedInvitations: [], acceptError: null, acceptInvitation: addon_actions_1.action('accept invitation'), confirmReject: addon_actions_1.action('show dialog to confirm invitation rejection'), user: contributors_1.user })));
//# sourceMappingURL=Projects.stories.js.map