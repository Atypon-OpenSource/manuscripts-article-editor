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
exports.PreferencesForm = void 0;
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const LocaleSelectorLabel = styled_components_1.default.label `
  display: block;
  margin-top: 20px;
`;
const LocaleSelector = styled_components_1.default.select `
  width: auto;
  margin-left: 1ch;
`;
const locales = new Map([
    ['en', 'English'],
    ['ar', 'Arabic'],
    // ['zh', 'Chinese'],
]);
const PreferencesForm = ({ values, errors, handleBlur, handleChange }) => (react_1.default.createElement(formik_1.Form, null,
    react_1.default.createElement(LocaleSelectorLabel, null,
        "Locale",
        react_1.default.createElement(LocaleSelector, { name: 'locale', onChange: handleChange, onBlur: handleBlur, value: values.locale, required: true }, Array.from(locales).map(([locale, localeName]) => (react_1.default.createElement("option", { key: locale, value: locale }, localeName))))),
    Object.entries(errors).map(([field, message]) => (react_1.default.createElement("div", { key: field }, message)))));
exports.PreferencesForm = PreferencesForm;
//# sourceMappingURL=PreferencesForm.js.map