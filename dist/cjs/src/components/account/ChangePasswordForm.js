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
exports.ChangePasswordForm = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const ModalForm_1 = require("../ModalForm");
const ChangePasswordForm = ({ errors, isSubmitting }) => (react_1.default.createElement(formik_1.Form, { id: 'change-password-form', noValidate: true },
    react_1.default.createElement(style_guide_1.TextFieldGroupContainer, { errors: {
            currentPassword: errors.currentPassword,
            newPassword: errors.newPassword,
        } },
        react_1.default.createElement(formik_1.Field, { name: 'currentPassword' }, ({ field }) => (react_1.default.createElement(style_guide_1.TextField, Object.assign({}, field, { type: 'password', placeholder: 'Enter the current password', autoComplete: 'password', autoFocus: true, required: true, error: errors.currentPassword })))),
        react_1.default.createElement(formik_1.Field, { name: 'newPassword' }, ({ field }) => (react_1.default.createElement(style_guide_1.TextField, Object.assign({}, field, { type: 'password', autoComplete: 'new-password', placeholder: 'Enter a new password', required: true, error: errors.newPassword }))))),
    errors.submit && react_1.default.createElement(style_guide_1.FormError, null, errors.submit),
    react_1.default.createElement(ModalForm_1.ModalFormActions, null,
        react_1.default.createElement(style_guide_1.PrimaryButton, { type: "submit", disabled: isSubmitting }, "Save"))));
exports.ChangePasswordForm = ChangePasswordForm;
//# sourceMappingURL=ChangePasswordForm.js.map