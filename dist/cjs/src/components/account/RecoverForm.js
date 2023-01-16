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
exports.RecoverForm = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const Hero_1 = require("../Hero");
const Container = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SignupLink = styled_components_1.default(react_router_dom_1.Link) `
  text-decoration: underline;
  color: ${(props) => props.theme.colors.text.error};
`;
const RecoverForm = ({ errors, isSubmitting }) => (react_1.default.createElement(style_guide_1.CenteredForm, { noValidate: true },
    react_1.default.createElement(style_guide_1.FormHeader, null,
        react_1.default.createElement(Hero_1.SubHero, null, "Reset Password")),
    react_1.default.createElement(style_guide_1.TextFieldGroupContainer, { errors: {
            name: errors.email,
        } },
        react_1.default.createElement(formik_1.Field, { name: 'email' }, ({ field }) => (react_1.default.createElement(style_guide_1.TextField, Object.assign({}, field, { type: 'email', placeholder: 'email', autoFocus: true, required: true, autoComplete: 'username email', error: errors.email }))))),
    errors.notFound && (react_1.default.createElement(style_guide_1.FormError, { className: "form-error" },
        react_1.default.createElement(Container, null,
            "Email address not found.",
            react_1.default.createElement(SignupLink, { to: '/signup' }, "Sign up?")))),
    errors.submit && react_1.default.createElement("div", null, errors.submit),
    react_1.default.createElement(style_guide_1.FormActions, null,
        react_1.default.createElement("div", null),
        react_1.default.createElement("div", null,
            react_1.default.createElement(style_guide_1.PrimaryButton, { type: "submit", disabled: isSubmitting }, "Send password reset")))));
exports.RecoverForm = RecoverForm;
//# sourceMappingURL=RecoverForm.js.map