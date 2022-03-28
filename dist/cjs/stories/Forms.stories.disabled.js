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
const formik_1 = require("formik");
const react_2 = __importDefault(require("react"));
const ChangePasswordForm_1 = require("../src/components/account/ChangePasswordForm");
const DeleteAccountForm_1 = require("../src/components/account/DeleteAccountForm");
const FeedbackForm_1 = require("../src/components/account/FeedbackForm");
const LoginForm_1 = require("../src/components/account/LoginForm");
const PasswordForm_1 = require("../src/components/account/PasswordForm");
const PreferencesForm_1 = require("../src/components/account/PreferencesForm");
const RecoverForm_1 = require("../src/components/account/RecoverForm");
const SignupForm_1 = require("../src/components/account/SignupForm");
const ModalForm_1 = require("../src/components/ModalForm");
const validation_1 = require("../src/validation");
const projects_1 = require("./data/projects");
react_1.storiesOf('Account/Forms/Pages', module)
    .add('Sign up', () => (react_2.default.createElement(react_2.default.Fragment, null,
    react_2.default.createElement(formik_1.Formik, { initialValues: {
            name: '',
            email: '',
            password: '',
        }, validationSchema: validation_1.signupSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: SignupForm_1.SignupForm }))))
    .add('Login', () => (react_2.default.createElement(formik_1.Formik, { initialValues: { email: '', password: '' }, validationSchema: validation_1.loginSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: LoginForm_1.LoginForm })))
    .add('Recover', () => (react_2.default.createElement(formik_1.Formik, { initialValues: { email: '' }, validationSchema: validation_1.recoverSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: RecoverForm_1.RecoverForm })))
    .add('Choose password', () => (react_2.default.createElement(formik_1.Formik, { initialValues: { password: '' }, validationSchema: validation_1.passwordSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: PasswordForm_1.PasswordForm })));
react_1.storiesOf('Account/Forms/Modal', module)
    .add('Change password', () => (react_2.default.createElement(ModalForm_1.ModalForm, { title: 'Change Password', handleClose: addon_actions_1.action('close') },
    react_2.default.createElement(formik_1.Formik, { initialValues: { currentPassword: '', newPassword: '' }, validationSchema: validation_1.changePasswordSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: ChangePasswordForm_1.ChangePasswordForm }))))
    .add('Delete account', () => (react_2.default.createElement(ModalForm_1.ModalForm, { title: 'Delete account', handleClose: addon_actions_1.action('close') },
    react_2.default.createElement(formik_1.Formik, { initialValues: { password: '' }, validationSchema: validation_1.deleteAccountSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: DeleteAccountForm_1.DeleteAccountForm }))))
    .add('Delete account with projects', () => (react_2.default.createElement(ModalForm_1.ModalForm, { title: 'Delete account', handleClose: addon_actions_1.action('close') },
    react_2.default.createElement(formik_1.Formik, { initialValues: { password: '' }, validationSchema: validation_1.deleteAccountSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), render: (props) => (react_2.default.createElement(DeleteAccountForm_1.DeleteAccountForm, Object.assign({}, props, { deletedProjects: [
                projects_1.project,
                Object.assign(Object.assign({}, projects_1.project), { title: undefined, _id: 'project-id-2' }),
            ] }))) }))));
react_1.storiesOf('Feedback', module).add('Feedback', () => (react_2.default.createElement(ModalForm_1.ModalForm, { title: 'Feedback', handleClose: addon_actions_1.action('close') },
    react_2.default.createElement(formik_1.Formik, { initialValues: {
            message: '',
            title: '',
        }, validationSchema: validation_1.feedbackSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: FeedbackForm_1.FeedbackForm }))));
react_1.storiesOf('Preferences', module).add('Preferences', () => (react_2.default.createElement(formik_1.Formik, { initialValues: {
        locale: 'en',
    }, validationSchema: validation_1.preferencesSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: addon_actions_1.action('submit'), component: PreferencesForm_1.PreferencesForm })));
//# sourceMappingURL=Forms.stories.disabled.js.map