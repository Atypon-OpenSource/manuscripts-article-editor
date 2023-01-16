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
exports.ProfileForm = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const formik_1 = require("formik");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Fields = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const Fieldset = styled_components_1.default.fieldset `
  border: none;
`;
const Legend = styled_components_1.default.legend `
  font-size: ${(props) => props.theme.font.size.xlarge};
  letter-spacing: -0.4px;
  color: ${(props) => props.theme.colors.text.secondary};
`;
const buildProfileValues = (user) => ({
    bibliographicName: user.bibliographicName,
});
const ProfileForm = ({ affiliationsMap, userWithAvatar, handleSave, createAffiliation, updateAffiliation, removeAffiliation, }) => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(formik_1.Formik, { initialValues: buildProfileValues(userWithAvatar), onSubmit: handleSave }, ({ errors }) => (react_1.default.createElement(formik_1.Form, { noValidate: true },
        react_1.default.createElement(Fields, null,
            react_1.default.createElement(Fieldset, null,
                react_1.default.createElement(Legend, null, "Details"),
                react_1.default.createElement(style_guide_1.TextFieldGroupContainer, { errors: {
                        bibliographicNameFamily: errors.bibliographicName
                            ? errors.bibliographicName.family
                            : undefined,
                        bibliographicNameGiven: errors.bibliographicName
                            ? errors.bibliographicName.given
                            : undefined,
                    } },
                    react_1.default.createElement(formik_1.Field, { name: 'bibliographicName.given' }, (props) => (react_1.default.createElement(style_guide_1.AutoSaveInput, Object.assign({}, props, { component: style_guide_1.TextField, saveOn: 'blur', placeholder: 'given name' })))),
                    react_1.default.createElement(formik_1.Field, { name: 'bibliographicName.family' }, (props) => (react_1.default.createElement(style_guide_1.AutoSaveInput, Object.assign({}, props, { component: style_guide_1.TextField, saveOn: 'blur', placeholder: 'family name' }))))),
                errors.submit && react_1.default.createElement(style_guide_1.FormError, null, errors.submit)))))),
    react_1.default.createElement(style_guide_1.AffiliationsEditorProfile, { affiliations: affiliationsMap, addAffiliation: createAffiliation, updateAffiliation: updateAffiliation, removeAffiliation: removeAffiliation })));
exports.ProfileForm = ProfileForm;
//# sourceMappingURL=ProfileForm.js.map