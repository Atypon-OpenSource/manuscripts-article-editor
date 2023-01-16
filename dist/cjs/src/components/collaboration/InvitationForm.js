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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationForm = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const formik_1 = require("formik");
const http_status_codes_1 = require("http-status-codes");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const roles_1 = require("../../lib/roles");
const validation_1 = require("../../validation");
const RadioButton_1 = require("../RadioButton");
const SendInvitationButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  width: 100%;
`;
const RadioButtonsContainer = styled_components_1.default.div `
  padding-top: ${(props) => props.theme.grid.unit * 6}px;
  padding-bottom: ${(props) => props.theme.grid.unit * 6}px;
`;
const AlertMessageContainer = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
`;
const errorResponseMessage = (status) => {
    switch (status) {
        case http_status_codes_1.StatusCodes.BAD_REQUEST:
            return 'You are already a collaborator on this project.';
        case http_status_codes_1.StatusCodes.CONFLICT:
            return 'The invited user is already a collaborator on this project.';
        default:
            return 'Sending invitation failed.';
    }
};
class InvitationForm extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            invitationSent: false,
        };
        this.initialValues = {
            email: '',
            name: '',
            role: 'Writer',
        };
        this.dismissSuccessAlert = () => {
            this.setState({
                invitationSent: false,
            });
        };
    }
    render() {
        const { allowSubmit, handleSubmit, invitationValues, tokenActions, } = this.props;
        const { invitationSent } = this.state;
        return (react_1.default.createElement(formik_1.Formik, { onSubmit: (values, actions) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield handleSubmit(values);
                    this.setState({ invitationSent: true });
                }
                catch (error) {
                    const errors = {};
                    errors.submit = error.response
                        ? errorResponseMessage(error.response.status)
                        : 'There was an error submitting the form.';
                    if (error.response &&
                        error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                        tokenActions.delete();
                    }
                    else {
                        actions.setErrors(errors);
                    }
                }
                finally {
                    actions.setSubmitting(false);
                }
            }), initialValues: invitationValues || this.initialValues, isInitialValid: true, validateOnChange: false, validateOnBlur: false, validationSchema: validation_1.projectInvitationSchema }, ({ errors, isSubmitting, values, resetForm, }) => (react_1.default.createElement(formik_1.Form, { noValidate: true },
            errors.submit && (react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.error, hideCloseButton: true },
                errors.submit,
                ' ')),
            !allowSubmit && (react_1.default.createElement(AlertMessageContainer, null,
                react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.info, hideCloseButton: true }, "Only project owners can invite others to the project."))),
            invitationSent && (react_1.default.createElement(AlertMessageContainer, null,
                react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success, hideCloseButton: true, dismissButton: {
                        text: 'OK',
                        action: () => {
                            this.dismissSuccessAlert();
                            resetForm();
                        },
                    } }, "Invitation was sent."))),
            react_1.default.createElement(style_guide_1.TextFieldGroupContainer, { errors: {
                    name: errors.name,
                    email: errors.email,
                } },
                react_1.default.createElement(formik_1.Field, { name: 'name' }, ({ field }) => (react_1.default.createElement(style_guide_1.TextField, Object.assign({}, field, { onFocus: this.dismissSuccessAlert, type: 'text', placeholder: 'name', required: true, error: errors.name, disabled: !allowSubmit })))),
                react_1.default.createElement(formik_1.Field, { name: 'email' }, ({ field }) => (react_1.default.createElement(style_guide_1.TextField, Object.assign({}, field, { onFocus: this.dismissSuccessAlert, type: 'email', placeholder: 'email', required: true, error: errors.email, disabled: !allowSubmit }))))),
            react_1.default.createElement(RadioButtonsContainer, null,
                react_1.default.createElement(formik_1.Field, { name: 'role' }, ({ field }) => (react_1.default.createElement(RadioButton_1.RadioButton, Object.assign({ _id: 'owner' }, field, { onFocus: this.dismissSuccessAlert, value: 'Owner', required: true, textHint: 'Can modify and delete project, invite and remove collaborators', checked: values.role === roles_1.ProjectRole.owner, disabled: !allowSubmit }), "Owner"))),
                react_1.default.createElement(formik_1.Field, { name: 'role' }, ({ field }) => (react_1.default.createElement(RadioButton_1.RadioButton, Object.assign({ _id: 'writer' }, field, { onFocus: this.dismissSuccessAlert, value: 'Writer', required: true, textHint: 'Can modify project contents', checked: values.role === roles_1.ProjectRole.writer, disabled: !allowSubmit }), "Writer"))),
                react_1.default.createElement(formik_1.Field, { name: 'role' }, ({ field }) => (react_1.default.createElement(RadioButton_1.RadioButton, Object.assign({ _id: 'viewer' }, field, { onFocus: this.dismissSuccessAlert, value: 'Viewer', required: true, textHint: 'Can only review projects without modifying it', checked: values.role === roles_1.ProjectRole.viewer, disabled: !allowSubmit }), "Viewer"))),
                errors.role && react_1.default.createElement(style_guide_1.FormError, null, errors.role)),
            react_1.default.createElement(SendInvitationButton, { type: "submit", disabled: isSubmitting || !allowSubmit }, "Send Invitation")))));
    }
}
exports.InvitationForm = InvitationForm;
//# sourceMappingURL=InvitationForm.js.map