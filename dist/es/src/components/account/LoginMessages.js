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
exports.userAccountErrorMessage = exports.resendVerificationDataMessage = exports.networkErrorMessage = exports.gatewayInaccessibleErrorMessage = exports.identityProviderErrorMessage = exports.infoLoginMessage = exports.verificationMessage = exports.warningLoginMessage = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const ContactSupportButton_1 = require("../ContactSupportButton");
const warningLoginMessage = (message) => {
    return react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.warning }, message);
};
exports.warningLoginMessage = warningLoginMessage;
const verificationMessage = (message) => {
    switch (message) {
        case 'account-verification-failed':
            return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error }, 'Account verification failed. Is the account already verified?'));
        default:
            return react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info }, message);
    }
};
exports.verificationMessage = verificationMessage;
const infoLoginMessage = (message) => {
    return react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info }, message);
};
exports.infoLoginMessage = infoLoginMessage;
const identityProviderErrorMessage = (message) => {
    let alertMessage;
    switch (message) {
        case 'user-not-found':
            alertMessage = (react_1.default.createElement("span", null,
                "A user record matching your identity was unexpectedly not found. Please ",
                react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support"),
                " if this persists."));
            break;
        case 'validation-error':
            alertMessage = (react_1.default.createElement("span", null,
                "An invalid request was made when attempting to log in. Please",
                ' ',
                react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support"),
                " if this persists."));
            break;
        default:
            alertMessage = (react_1.default.createElement("span", null,
                "An error occurred while logging in, please",
                ' ',
                react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support.")));
    }
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error }, alertMessage));
};
exports.identityProviderErrorMessage = identityProviderErrorMessage;
const gatewayInaccessibleErrorMessage = () => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error }, 'Trouble reaching manuscripts.io servers. Please try again later.'));
};
exports.gatewayInaccessibleErrorMessage = gatewayInaccessibleErrorMessage;
const networkErrorMessage = () => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error },
        react_1.default.createElement("span", null,
            "Failed to connect to service. Please check your network connection before trying again, and if the problem persists",
            ' ',
            react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support."))));
};
exports.networkErrorMessage = networkErrorMessage;
const resendVerificationDataMessage = (resendVerificationData, resendVerificationEmail) => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: resendVerificationData.type, dismissButton: {
            text: 'Re-send verification email.',
            action: () => resendVerificationEmail(resendVerificationData.email),
        } }, resendVerificationData.message));
};
exports.resendVerificationDataMessage = resendVerificationDataMessage;
const userAccountErrorMessage = () => {
    return (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error },
        react_1.default.createElement("span", null,
            "Your user account record is missing required information. This is most likely because of having logged in with an earlier version of the app. Please ",
            react_1.default.createElement(ContactSupportButton_1.ContactSupportButton, null, "contact support"),
            " for assistance.")));
};
exports.userAccountErrorMessage = userAccountErrorMessage;
//# sourceMappingURL=LoginMessages.js.map