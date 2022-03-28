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
exports.PreferencesPageContainer = void 0;
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const preferences_1 = __importDefault(require("../../lib/preferences"));
const validation_1 = require("../../validation");
const IntlProvider_1 = require("../IntlProvider");
const Messages_1 = require("../Messages");
const ModalForm_1 = require("../ModalForm");
const PreferencesForm_1 = require("./PreferencesForm");
const PreferencesPageContainer = ({ history, }) => (react_1.default.createElement(IntlProvider_1.IntlContext.Consumer, null, (intl) => (react_1.default.createElement(ModalForm_1.ModalForm, { title: react_1.default.createElement(Messages_1.PreferencesMessage, null), handleClose: () => history.goBack() },
    react_1.default.createElement(formik_1.Formik, { initialValues: preferences_1.default.get(), validationSchema: validation_1.preferencesSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: (values, actions) => {
            actions.setErrors({});
            preferences_1.default.set(Object.assign(Object.assign({}, preferences_1.default.get()), values));
            intl.setLocale(values.locale);
            actions.setSubmitting(false);
            history.push('/projects');
        }, component: PreferencesForm_1.PreferencesForm })))));
exports.PreferencesPageContainer = PreferencesPageContainer;
//# sourceMappingURL=PreferencesPageContainer.js.map