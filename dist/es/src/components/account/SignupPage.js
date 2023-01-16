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
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../../config"));
const Page_1 = require("../Page");
const AccountFooter_1 = require("./AccountFooter");
const AuthButtonContainer_1 = __importDefault(require("./AuthButtonContainer"));
const Authentication_1 = require("./Authentication");
const SignupForm_1 = require("./SignupForm");
const SignupPage = ({ initialValues, validationSchema, onSubmit, }) => (react_1.default.createElement(Page_1.Centered, null,
    react_1.default.createElement(formik_1.Formik, { initialValues: initialValues, validationSchema: validationSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: onSubmit, component: SignupForm_1.SignupForm }),
    react_1.default.createElement(Authentication_1.AuthenticationContainer, null,
        react_1.default.createElement("div", null, "Sign up with"),
        react_1.default.createElement("div", null,
            react_1.default.createElement(AuthButtonContainer_1.default, { component: Authentication_1.GoogleLogin }),
            config_1.default.connect.enabled && (react_1.default.createElement(AuthButtonContainer_1.default, { component: Authentication_1.ConnectLogin })))),
    react_1.default.createElement(AccountFooter_1.AccountFooter, null)));
exports.default = SignupPage;
//# sourceMappingURL=SignupPage.js.map