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
const style_guide_1 = require("@manuscripts/style-guide");
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const formik_1 = require("formik");
const react_2 = __importDefault(require("react"));
const ImmediateSelectField_1 = require("../src/components/ImmediateSelectField");
const SelectField_1 = require("../src/components/SelectField");
const options = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
];
react_1.storiesOf('SelectField', module)
    .add('manual submit', () => (react_2.default.createElement(formik_1.Formik, { initialValues: {
        locale: 'en',
    }, onSubmit: addon_actions_1.action('submit') },
    react_2.default.createElement(formik_1.Form, null,
        react_2.default.createElement(formik_1.Field, { name: 'locale', component: SelectField_1.SelectField, options: options }),
        react_2.default.createElement("div", { style: { marginTop: 20 } },
            react_2.default.createElement(style_guide_1.PrimaryButton, { type: "submit" }, "Save"))))))
    .add('submit on change', () => (react_2.default.createElement(formik_1.Formik, { initialValues: {
        locale: 'en',
    }, onSubmit: addon_actions_1.action('submit') },
    react_2.default.createElement(formik_1.Form, null,
        react_2.default.createElement(formik_1.Field, { name: 'locale', component: ImmediateSelectField_1.ImmediateSelectField, options: options })))));
//# sourceMappingURL=SelectField.stories.js.map