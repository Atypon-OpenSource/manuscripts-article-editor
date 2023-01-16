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
const AvatarFileUpload_1 = require("../src/components/account/AvatarFileUpload");
const ProfilePage_1 = __importDefault(require("../src/components/account/ProfilePage"));
const people_1 = require("./data/people");
const bibliographicName = {
    _id: 'MPBibliographicName:id',
    objectType: 'MPBibliographicName',
    given: 'Jon',
    family: 'Snow',
};
const createdAt = new Date('2020-01-01T12:00:00Z').getTime() / 1000;
const affiliation1 = {
    _id: 'MPUserProfileAffiliation:id',
    objectType: 'MPUserProfileAffiliation',
    priority: 1,
    institution: 'Foobar University',
    containerID: 'MPUserProfile:id',
    createdAt,
    updatedAt: createdAt,
};
const affiliation2 = {
    _id: 'MPUserProfileAffiliation:id2',
    objectType: 'MPUserProfileAffiliation',
    priority: 1,
    institution: 'Foobar Collage of IT',
    containerID: 'MPUserProfile:id2',
    createdAt,
    updatedAt: createdAt,
};
const affiliationsMap = new Map([
    [affiliation1._id, affiliation1],
    [affiliation2._id, affiliation2],
]);
const user = {
    _id: 'MPUserProfile:id',
    objectType: 'MPUserProfile',
    bibliographicName,
    createdAt,
    updatedAt: createdAt,
    userID: 'User_jsnow@atypon.com',
    affiliations: [affiliation1._id],
};
react_1.storiesOf('Account/Modals', module).add('Profile', () => (react_2.default.createElement(ProfilePage_1.default, { userWithAvatar: user, affiliationsMap: affiliationsMap, handleSave: addon_actions_1.action('save profile'), handleChangePassword: addon_actions_1.action('open change password modal'), handleDeleteAccount: addon_actions_1.action('open delete account modal'), handleClose: addon_actions_1.action('close profile page'), saveUserProfileAvatar: addon_actions_1.action('save user avatar'), deleteUserProfileAvatar: addon_actions_1.action('delete user profile'), createAffiliation: addon_actions_1.action('create new affiliation'), updateAffiliation: addon_actions_1.action('update affiliations'), removeAffiliation: addon_actions_1.action('remove affiliations') })));
const avatar = { src: people_1.people[0].avatar };
const SidebarStory = styled_components_1.default.div `
  width: 300px;
  height: 600px;
`;
react_1.storiesOf('Account/Profile', module)
    .add('AvatarFileUpload', () => (react_2.default.createElement(SidebarStory, null,
    react_2.default.createElement(AvatarFileUpload_1.AvatarFileUpload, { newAvatar: null, avatarZoom: 2, avatarEditorRef: react_2.default.createRef(), importAvatar: addon_actions_1.action('import avatar'), handleAvatarZoom: addon_actions_1.action('zoom avatar'), handleCancel: addon_actions_1.action('cancel'), handleSaveAvatar: addon_actions_1.action('save avatar'), handleDeleteAvatar: addon_actions_1.action('delete avatar'), userWithAvatar: user }))))
    .add('AvatarFileUpload - with old Avatar', () => (react_2.default.createElement(SidebarStory, null,
    react_2.default.createElement(AvatarFileUpload_1.AvatarFileUpload, { newAvatar: null, avatarZoom: 2, avatarEditorRef: react_2.default.createRef(), importAvatar: addon_actions_1.action('import avatar'), handleAvatarZoom: addon_actions_1.action('zoom avatar'), handleCancel: addon_actions_1.action('cancel'), handleSaveAvatar: addon_actions_1.action('save avatar'), handleDeleteAvatar: addon_actions_1.action('delete avatar'), userWithAvatar: people_1.people[0] }))))
    .add('AvatarFileUpload - with new Avatar', () => (react_2.default.createElement(SidebarStory, null,
    react_2.default.createElement(AvatarFileUpload_1.AvatarFileUpload, { newAvatar: avatar, avatarZoom: 1, avatarEditorRef: react_2.default.createRef(), importAvatar: addon_actions_1.action('import avatar'), handleAvatarZoom: addon_actions_1.action('zoom avatar'), handleCancel: addon_actions_1.action('cancel'), handleSaveAvatar: addon_actions_1.action('save avatar'), handleDeleteAvatar: addon_actions_1.action('delete avatar'), userWithAvatar: people_1.people[0] }))));
//# sourceMappingURL=Profile.stories.js.map