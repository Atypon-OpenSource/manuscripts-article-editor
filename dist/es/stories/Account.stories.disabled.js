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
const LoginPage_1 = __importDefault(require("../src/components/account/LoginPage"));
const PasswordPage_1 = __importDefault(require("../src/components/account/PasswordPage"));
const RecoverPage_1 = __importDefault(require("../src/components/account/RecoverPage"));
const SignupPage_1 = __importDefault(require("../src/components/account/SignupPage"));
const validation_1 = require("../src/validation");
react_1.storiesOf('Account/Pages', module)
    .add('Sign up', () => (react_2.default.createElement(SignupPage_1.default, { initialValues: {
        name: '',
        email: '',
        password: '',
    }, validationSchema: validation_1.signupSchema, onSubmit: addon_actions_1.action('sign up') })))
    .add('Login', () => (react_2.default.createElement(LoginPage_1.default, { initialValues: { email: '', password: '' }, validationSchema: validation_1.loginSchema, onSubmit: addon_actions_1.action('login') })))
    .add('Recover', () => (react_2.default.createElement(RecoverPage_1.default, { initialValues: { email: '' }, validationSchema: validation_1.recoverSchema, onSubmit: addon_actions_1.action('recover') })))
    .add('Set password', () => (react_2.default.createElement(PasswordPage_1.default, { initialValues: { password: '' }, validationSchema: validation_1.passwordSchema, onSubmit: addon_actions_1.action('save password') })));
//# sourceMappingURL=Account.stories.disabled.js.map