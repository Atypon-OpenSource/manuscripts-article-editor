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
const InvitationPopper_1 = require("../src/components/collaboration/InvitationPopper");
const ShareProjectButton_1 = __importDefault(require("../src/components/collaboration/ShareProjectButton"));
const ShareURIPopper_1 = require("../src/components/collaboration/ShareURIPopper");
const contributors_1 = require("./data/contributors");
const PopperStory = styled_components_1.default.div `
  width: 400px;
`;
const project = {
    _id: 'project-id',
    owners: ['user-1'],
};
const owner = { userID: 'user-1' };
const notOwner = { userID: 'user-2' };
react_1.storiesOf('Collaboration/Invitation', module)
    .add('Invite', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(InvitationPopper_1.InvitationPopper, { handleInvitationSubmit: addon_actions_1.action('submit'), handleSwitching: addon_actions_1.action('switch'), project: project, user: owner, tokenActions: {
            delete: addon_actions_1.action('delete token'),
            update: addon_actions_1.action('update token'),
        } }))))
    .add('Invite: not owner', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(InvitationPopper_1.InvitationPopper, { handleInvitationSubmit: addon_actions_1.action('submit'), handleSwitching: addon_actions_1.action('switch'), project: project, user: notOwner, tokenActions: {
            delete: addon_actions_1.action('delete token'),
            update: addon_actions_1.action('update token'),
        } }))))
    .add('Share Project Button', () => (react_2.default.createElement(ShareProjectButton_1.default, { project: project, user: contributors_1.user, tokenActions: {
        delete: addon_actions_1.action('delete token'),
        update: addon_actions_1.action('update token'),
    } })))
    .add('Share Link: loading', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(ShareURIPopper_1.ShareURIPopper, { dataLoaded: false, URI: 'http://example.com', selectedRole: 'Writer', isCopied: false, handleChange: addon_actions_1.action('change'), handleCopy: addon_actions_1.action('copy'), handleSwitching: addon_actions_1.action('switch'), requestURI: addon_actions_1.action('request URI'), project: project, user: owner, loadingURIError: null }))))
    .add('Share Link: loaded', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(ShareURIPopper_1.ShareURIPopper, { dataLoaded: true, URI: 'http://example.com', selectedRole: 'Writer', isCopied: false, handleChange: addon_actions_1.action('change'), handleCopy: addon_actions_1.action('copy'), handleSwitching: addon_actions_1.action('switch'), project: project, user: owner, requestURI: addon_actions_1.action('request URI'), loadingURIError: null }))))
    .add('Share Link: copied', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(ShareURIPopper_1.ShareURIPopper, { dataLoaded: true, URI: 'http://example.com', selectedRole: 'Writer', isCopied: true, handleChange: addon_actions_1.action('change'), handleCopy: addon_actions_1.action('copy'), handleSwitching: addon_actions_1.action('switch'), project: project, user: owner, requestURI: addon_actions_1.action('request URI'), loadingURIError: null }))))
    .add('Share Link: not owner', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(ShareURIPopper_1.ShareURIPopper, { dataLoaded: true, URI: 'http://example.com', selectedRole: 'Writer', isCopied: true, handleChange: addon_actions_1.action('change'), handleCopy: addon_actions_1.action('copy'), handleSwitching: addon_actions_1.action('switch'), project: project, user: notOwner, requestURI: addon_actions_1.action('request URI'), loadingURIError: null }))))
    .add('Share Link: error', () => (react_2.default.createElement(PopperStory, null,
    react_2.default.createElement(ShareURIPopper_1.ShareURIPopper, { dataLoaded: true, URI: 'http://example.com', selectedRole: 'Writer', isCopied: true, handleChange: addon_actions_1.action('change'), handleCopy: addon_actions_1.action('copy'), handleSwitching: addon_actions_1.action('switch'), project: project, user: owner, requestURI: addon_actions_1.action('request URI'), loadingURIError: new Error('An error occurred.') }))));
//# sourceMappingURL=Invitation.stories.js.map