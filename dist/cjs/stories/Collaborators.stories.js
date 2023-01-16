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
const styled_components_1 = __importDefault(require("styled-components"));
const AddCollaboratorPopper_1 = __importDefault(require("../src/components/collaboration/AddCollaboratorPopper"));
const AddCollaboratorsSidebar_1 = __importDefault(require("../src/components/collaboration/AddCollaboratorsSidebar"));
const CollaboratorForm_1 = require("../src/components/collaboration/CollaboratorForm");
const CollaboratorSettingsPopper_1 = __importDefault(require("../src/components/collaboration/CollaboratorSettingsPopper"));
const CollaboratorsPage_1 = require("../src/components/collaboration/CollaboratorsPage");
const CollaboratorsSidebar_1 = __importDefault(require("../src/components/collaboration/CollaboratorsSidebar"));
const InvitationForm_1 = require("../src/components/collaboration/InvitationForm");
const InviteCollaboratorPopper_1 = __importDefault(require("../src/components/collaboration/InviteCollaboratorPopper"));
const InviteCollaboratorsSidebar_1 = __importDefault(require("../src/components/collaboration/InviteCollaboratorsSidebar"));
const RemoveCollaboratorPopper_1 = require("../src/components/collaboration/RemoveCollaboratorPopper");
const SearchCollaboratorsSidebar_1 = __importDefault(require("../src/components/collaboration/SearchCollaboratorsSidebar"));
const UninviteCollaboratorPopper_1 = require("../src/components/collaboration/UninviteCollaboratorPopper");
const contributors_1 = require("./data/contributors");
const invitations_data_1 = require("./data/invitations-data");
const people_1 = require("./data/people");
const projects_1 = require("./data/projects");
const PopperStory = styled_components_1.default.div `
  width: 300px;
`;
react_1.storiesOf('Collaboration/Poppers', module)
    .add('Add', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(AddCollaboratorPopper_1.default, { addCollaborator: addon_actions_1.action('add collaborator') }))))
    .add('Settings and Remove', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(CollaboratorSettingsPopper_1.default, { project: Object.assign(Object.assign({}, projects_1.project), { owners: [contributors_1.user.userID, 'User_foobar'] }), collaborator: contributors_1.user, handleUpdateRole: addon_actions_1.action('update role'), handleRemove: addon_actions_1.action('remove'), handleOpenModal: addon_actions_1.action('open update role confirmation modal'), updateRoleIsOpen: false }))))
    .add('Settings and Remove - only owner', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(CollaboratorSettingsPopper_1.default, { project: projects_1.project, collaborator: contributors_1.user, handleUpdateRole: addon_actions_1.action('update role'), handleRemove: addon_actions_1.action('remove'), handleOpenModal: addon_actions_1.action('open update role confirmation modal'), updateRoleIsOpen: false }))))
    .add('Settings and Remove - Update role', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(CollaboratorSettingsPopper_1.default, { project: projects_1.project, collaborator: contributors_1.user, handleUpdateRole: addon_actions_1.action('update role'), handleRemove: addon_actions_1.action('remove'), handleOpenModal: addon_actions_1.action('open update role confirmation modal'), updateRoleIsOpen: true }))))
    .add('Invite and Uninvite', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(InviteCollaboratorPopper_1.default, { invitation: invitations_data_1.invitations[0], handleUpdateRole: addon_actions_1.action('invite'), handleUninvite: addon_actions_1.action('uninvite'), handleOpenModal: addon_actions_1.action('open update role confirmation modal'), isUpdateRoleOpen: false, resendInvitation: addon_actions_1.action('re-send invitation'), resendSucceed: null }))))
    .add('Invite and Uninvite - Update role', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(InviteCollaboratorPopper_1.default, { invitation: invitations_data_1.invitations[0], handleUpdateRole: addon_actions_1.action('invite'), handleUninvite: addon_actions_1.action('uninvite'), handleOpenModal: addon_actions_1.action('open update role confirmation modal'), isUpdateRoleOpen: true, resendInvitation: addon_actions_1.action('re-send invitation'), resendSucceed: null }))));
react_1.storiesOf('Collaboration/Forms', module).add('Invite', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(InvitationForm_1.InvitationForm, { allowSubmit: true, handleSubmit: addon_actions_1.action('submit'), tokenActions: {
            delete: addon_actions_1.action('delete token'),
            update: addon_actions_1.action('update token'),
        } }))));
const collaborator = {
    bibliographicName: {
        _id: 'id',
        objectType: 'MPBibliographicName',
        given: 'Mark',
        family: 'Foobarovic',
    },
};
react_1.storiesOf('Collaboration/Pages', module)
    .add('No collaborators', () => (react_2.default.createElement(CollaboratorsPage_1.CollaboratorDetailsPage, { project: projects_1.project, collaboratorsCount: 0, user: contributors_1.user, selectedCollaborator: null, handleAddCollaborator: addon_actions_1.action('add collaborator'), manageProfile: addon_actions_1.action('manage your profile') })))
    .add('Collaborator details', () => (react_2.default.createElement(CollaboratorsPage_1.CollaboratorDetailsPage, { project: projects_1.project, collaboratorsCount: 3, user: contributors_1.user, selectedCollaborator: null, handleAddCollaborator: addon_actions_1.action('add collaborator'), manageProfile: addon_actions_1.action('manage your profile') })))
    .add('Collaborator Details page', () => (react_2.default.createElement(CollaboratorForm_1.CollaboratorForm, { collaborator: collaborator, user: contributors_1.user, manageProfile: addon_actions_1.action('manage your profile'), affiliations: null })))
    .add('Collaborator Details page - with affiliations', () => (react_2.default.createElement(CollaboratorForm_1.CollaboratorForm, { collaborator: collaborator, user: contributors_1.user, manageProfile: addon_actions_1.action('manage your profile'), affiliations: [
        {
            _id: 'MPAffiliation:foo-bar',
            containerID: 'MPProject:foo-bar',
            createdAt: 123123123,
            updatedAt: 123123123,
            manuscriptID: 'MPManuscript:foo-bar',
            sessionID: 123,
            objectType: 'MPAffiliation',
            priority: 1,
            institution: 'Bla bla',
        },
    ] })))
    .add('Collaborator Details page - for the user', () => (react_2.default.createElement(CollaboratorForm_1.CollaboratorForm, { collaborator: contributors_1.user, user: contributors_1.user, manageProfile: addon_actions_1.action('manage your profile'), affiliations: null })))
    .add('Add collaborators', () => (react_2.default.createElement(CollaboratorsPage_1.AddCollaboratorsPage, { addedCollaboratorsCount: 3 })))
    .add('Invite collaborators', () => react_2.default.createElement(CollaboratorsPage_1.InviteCollaboratorsPage, null))
    .add('Search collaborators by name', () => (react_2.default.createElement(CollaboratorsPage_1.SearchCollaboratorsPage, { searchText: 'bob' })))
    .add('Search collaborators by email', () => (react_2.default.createElement(CollaboratorsPage_1.SearchCollaboratorsPage, { searchText: 'bob@example.com' })));
react_1.storiesOf('Collaboration/Sidebars', module)
    .add('Collaborators - Owner', () => (react_2.default.createElement(CollaboratorsSidebar_1.default, { project: Object.assign(Object.assign({}, projects_1.project), { owners: [people_1.people[0].userID], viewers: [people_1.people[1].userID, people_1.people[2].userID] }), projectCollaborators: people_1.people, invitations: invitations_data_1.invitations, user: people_1.people[0], projectInvite: addon_actions_1.action('invitation send'), projectUninvite: addon_actions_1.action('invitation deleted'), updateUserRole: addon_actions_1.action('update user role'), handleAddCollaborator: addon_actions_1.action('add collaborator'), handleClickCollaborator: addon_actions_1.action('selected collaborator'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Collaborators - Non-owner', () => (react_2.default.createElement(CollaboratorsSidebar_1.default, { project: Object.assign(Object.assign({}, projects_1.project), { owners: [people_1.people[1].userID], viewers: [people_1.people[0].userID, people_1.people[2].userID] }), projectCollaborators: people_1.people, invitations: invitations_data_1.invitations, user: people_1.people[0], projectInvite: addon_actions_1.action('invitation send'), projectUninvite: addon_actions_1.action('invitation deleted'), updateUserRole: addon_actions_1.action('update user role'), handleAddCollaborator: addon_actions_1.action('add collaborator'), handleClickCollaborator: addon_actions_1.action('selected collaborator'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Add Collaborator', () => (react_2.default.createElement(AddCollaboratorsSidebar_1.default, { people: people_1.people, invitations: [], addCollaborator: addon_actions_1.action('add collaborator'), handleInvite: addon_actions_1.action('invite'), numberOfAddedCollaborators: 0, countAddedCollaborators: () => 0, addedUsers: [], setSearchText: addon_actions_1.action('set search text'), handleDoneCancel: addon_actions_1.action('handle done/cancel'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Add Collaborator - few have been added', () => (react_2.default.createElement(AddCollaboratorsSidebar_1.default, { people: people_1.people, invitations: [], addCollaborator: addon_actions_1.action('add collaborator'), handleInvite: addon_actions_1.action('invite'), numberOfAddedCollaborators: 1, countAddedCollaborators: () => 1, addedUsers: [people_1.people[0].userID], setSearchText: addon_actions_1.action('set search text'), handleDoneCancel: addon_actions_1.action('handle done/cancel'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Add Collaborator - with invitations', () => (react_2.default.createElement(AddCollaboratorsSidebar_1.default, { people: people_1.people, invitations: invitations_data_1.invitations, addCollaborator: addon_actions_1.action('add collaborator'), handleInvite: addon_actions_1.action('invite'), numberOfAddedCollaborators: 0, countAddedCollaborators: () => 0, addedUsers: [], setSearchText: addon_actions_1.action('set search text'), handleDoneCancel: addon_actions_1.action('handle done/cancel'), tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Invite Collaborators', () => (react_2.default.createElement(InviteCollaboratorsSidebar_1.default, { invitationValues: { name: '', email: 'user@example.com', role: '' }, handleCancel: addon_actions_1.action('cancel'), handleSubmit: addon_actions_1.action('submit'), invitationSent: false, tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Search Collaborators', () => (react_2.default.createElement(SearchCollaboratorsSidebar_1.default, { addCollaborator: addon_actions_1.action('add collaborator'), countAddedCollaborators: () => 3, handleInvite: addon_actions_1.action('invite'), searchResults: people_1.people, searchText: 'ego', tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Search Collaborators - Empty', () => (react_2.default.createElement(SearchCollaboratorsSidebar_1.default, { addCollaborator: addon_actions_1.action('add collaborator'), countAddedCollaborators: () => 3, handleInvite: addon_actions_1.action('invite'), searchResults: [], searchText: 'ego', tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Uninvite Collaborators', () => (react_2.default.createElement(UninviteCollaboratorPopper_1.UninviteCollaboratorPopper, { invitedUserName: '', handleUninvite: addon_actions_1.action('Uninvite'), switchMode: addon_actions_1.action('switch mode') })))
    .add('Remove Collaborators', () => (react_2.default.createElement(RemoveCollaboratorPopper_1.RemoveCollaboratorPopper, { collaborator: people_1.people[0], handleRemove: addon_actions_1.action('remove'), switchMode: addon_actions_1.action('switch mode') })));
//# sourceMappingURL=Collaborators.stories.js.map