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
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = __importDefault(require("react"));
const LoginMessages_1 = require("../src/components/account/LoginMessages");
const SignupMessages_1 = require("../src/components/account/SignupMessages");
const MessageBanner_1 = __importDefault(require("../src/components/MessageBanner"));
const Messages_1 = require("../src/components/Messages");
react_1.storiesOf('Account/Messages/Login', module)
    .add('warningLoginMessage', () => LoginMessages_1.warningLoginMessage('This is a warning message'))
    .add('verificationMessage', () => LoginMessages_1.verificationMessage('account-verification-failed'))
    .add('verificationMessage default', () => LoginMessages_1.verificationMessage('Verification failed'))
    .add('infoLoginMessage', () => LoginMessages_1.infoLoginMessage('Logged in successfully'))
    .add('identityProviderErrorMessage - user not found', () => LoginMessages_1.identityProviderErrorMessage('user-not-found'))
    .add('identityProviderErrorMessage - validation-error', () => LoginMessages_1.identityProviderErrorMessage('validation-error'))
    .add('identityProviderErrorMessage - default', () => LoginMessages_1.identityProviderErrorMessage(''))
    .add('gatewayInaccessibleErrorMessage', () => LoginMessages_1.gatewayInaccessibleErrorMessage())
    .add('networkErrorMessage', () => LoginMessages_1.networkErrorMessage())
    .add('resendVerificationDataMessage', () => LoginMessages_1.resendVerificationDataMessage({
    email: 'foobar@manuscripts.com',
    type: style_guide_1.AlertMessageType.success,
    message: 'Verification message send successfully to foobar@manuscripts.com',
}, addon_actions_1.action('Resend verification email')));
react_1.storiesOf('Account/Messages/Signup', module)
    .add('signupVerifyMessage', () => SignupMessages_1.signupVerifyMessage('foobar@manuscripts.com', addon_actions_1.action('Resend verification email')))
    .add('signupVerifyConflictMessage', () => SignupMessages_1.signupVerifyConflictMessage('foobar@manuscripts.com'))
    .add('signupVerifyResendSuccessMessage', () => SignupMessages_1.signupVerifyResendSuccessMessage('foobar@manuscripts.com'))
    .add('signupVerifyResendFailureMessage', () => SignupMessages_1.signupVerifyResendFailureMessage('foobar@manuscripts.com', addon_actions_1.action('Resend verification email')));
react_1.storiesOf('Messages', module)
    .add('SignInMessage', () => react_2.default.createElement(Messages_1.SignInMessage, null))
    .add('ManageProfileMessage', () => react_2.default.createElement(Messages_1.ManageProfileMessage, null))
    .add('PreferencesMessage', () => react_2.default.createElement(Messages_1.PreferencesMessage, null))
    .add('ManuscriptsTitleMessage', () => react_2.default.createElement(Messages_1.ManuscriptsTitleMessage, null))
    .add('EmptyManuscriptsMessage', () => react_2.default.createElement(Messages_1.EmptyManuscriptsMessage, null))
    .add('ImportManuscriptMessage', () => react_2.default.createElement(Messages_1.ImportManuscriptMessage, null))
    .add('AddAuthorsMessage', () => react_2.default.createElement(Messages_1.AddAuthorsMessage, null))
    .add('FeedbackMessage', () => react_2.default.createElement(Messages_1.FeedbackMessage, null))
    .add('MessageBanner', () => {
    window.location.hash = '#action=reset-password';
    return react_2.default.createElement(MessageBanner_1.default, null);
});
//# sourceMappingURL=Messages.stories.js.map