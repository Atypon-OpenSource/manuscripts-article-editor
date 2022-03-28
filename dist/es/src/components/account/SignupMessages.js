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
exports.signupVerifyResendFailureMessage = exports.signupVerifyResendSuccessMessage = exports.signupVerifyConflictMessage = exports.signupVerifyMessage = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const ContactSupportButton_1 = require("../ContactSupportButton");
const signupVerifyMessage = (email, resendVerificationEmail) => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success, dismissButton: {
            text: 'Click here to re-send.',
            action: () => resendVerificationEmail(email),
        } }, `Thanks for signing up! Please click the link sent to ${email} to verify your account.`));
};
exports.signupVerifyMessage = signupVerifyMessage;
const signupVerifyConflictMessage = (email) => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.warning }, `Account already exists with ${email}. Verification email has been re-sent to your email address.`));
};
exports.signupVerifyConflictMessage = signupVerifyConflictMessage;
const signupVerifyResendSuccessMessage = (email) => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success },
        react_1.default.createElement("span", null,
            "Verification email re-resent to ",
            email,
            ". If you have not received it, please wait, check your spam box before",
            ' ',
            react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contacting support."))));
};
exports.signupVerifyResendSuccessMessage = signupVerifyResendSuccessMessage;
const signupVerifyResendFailureMessage = (email, resendVerificationEmail) => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error, dismissButton: {
            text: 'Click here to retry.',
            action: () => resendVerificationEmail(email),
        } }, `Failed to re-send verification email to ${email}.`));
};
exports.signupVerifyResendFailureMessage = signupVerifyResendFailureMessage;
//# sourceMappingURL=SignupMessages.js.map