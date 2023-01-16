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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackSchema = exports.projectInvitationSchema = exports.preferencesSchema = exports.profileSchema = exports.deleteAccountSchema = exports.changePasswordSchema = exports.signupSchema = exports.recoverSchema = exports.passwordSchema = exports.loginSchema = void 0;
const yup = __importStar(require("yup"));
// TODO: warn about password strength?
exports.loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});
exports.passwordSchema = yup.object().shape({
    password: yup.string().required(),
});
exports.recoverSchema = yup.object().shape({
    email: yup.string().email().required(),
});
exports.signupSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8),
    name: yup
        .string()
        .required()
        .matches(/^\p{Alpha}/u, {
        message: 'Name must start with a letter',
    }),
});
exports.changePasswordSchema = yup.object().shape({
    currentPassword: yup.string().required('Please enter the current password'),
    newPassword: yup
        .string()
        .min(8, 'The new password must be at least 8 characters long')
        .required('Please enter a new password'),
});
exports.deleteAccountSchema = yup.object().shape({
    password: yup.string().required('Please enter the current password'),
});
exports.profileSchema = yup.object().shape({
    bibliographicName: yup.object().shape({
        given: yup
            .string()
            .required('Please enter your given name')
            .min(1, 'The given name must contain at least 1 character'),
        family: yup
            .string()
            .required('Please enter your family name')
            .min(2, 'The family name must contain at least 2 characters'),
    }),
    title: yup.string(),
});
exports.preferencesSchema = yup.object().shape({
    locale: yup.string().required().min(2), // TODO: valid locales
});
exports.projectInvitationSchema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required().min(1),
    role: yup.string().required(),
});
exports.feedbackSchema = yup.object().shape({
    message: yup.string().required('Please provide feedback'),
    title: yup.string().required('Please provide the feedback title'),
});
//# sourceMappingURL=validation.js.map