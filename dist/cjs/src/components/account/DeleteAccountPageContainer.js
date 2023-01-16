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
const formik_1 = require("formik");
const http_status_codes_1 = require("http-status-codes");
const react_1 = __importDefault(require("react"));
const account_1 = require("../../lib/account");
const api_1 = require("../../lib/api");
const roles_1 = require("../../lib/roles");
const store_1 = require("../../store");
const validation_1 = require("../../validation");
const Messages_1 = require("../Messages");
const ModalForm_1 = require("../ModalForm");
const DeleteAccountForm_1 = require("./DeleteAccountForm");
const DeleteAccountPageContainer = ({ history, tokenActions }) => {
    const [{ tokenData, projects, user }] = store_1.useStore((store) => ({
        tokenData: store.tokenData,
        projects: store.projects,
        user: store.user,
    }));
    return (react_1.default.createElement(ModalForm_1.ModalForm, { title: react_1.default.createElement(Messages_1.DeleteAccountMessage, null), handleClose: () => history.goBack() },
        react_1.default.createElement(formik_1.Formik, { initialValues: {
                password: '',
            }, validationSchema: validation_1.deleteAccountSchema, isInitialValid: true, validateOnChange: false, validateOnBlur: false, onSubmit: (values, actions) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                actions.setErrors({});
                try {
                    yield api_1.markUserForDeletion(values.password);
                    actions.setSubmitting(false);
                    yield account_1.logout();
                    (_a = tokenData.getTokenActions()) === null || _a === void 0 ? void 0 : _a.delete();
                    window.location.assign('/signup');
                }
                catch (error) {
                    actions.setSubmitting(false);
                    const errors = {
                        submit: error.response &&
                            error.response.status === http_status_codes_1.StatusCodes.FORBIDDEN
                            ? 'The password entered is incorrect'
                            : 'There was an error',
                    };
                    if (error.response &&
                        error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                        tokenActions.delete();
                    }
                    else {
                        actions.setErrors(errors);
                    }
                }
            }), render: (props) => (react_1.default.createElement(DeleteAccountForm_1.DeleteAccountForm, Object.assign({}, props, { deletedProjects: projects.filter((project) => project.owners.length === 1 && roles_1.isOwner(project, user.userID)) }))) })));
};
exports.default = DeleteAccountPageContainer;
//# sourceMappingURL=DeleteAccountPageContainer.js.map