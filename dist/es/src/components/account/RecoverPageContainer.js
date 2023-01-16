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
const http_status_codes_1 = require("http-status-codes");
const qs_1 = require("qs");
const react_1 = __importDefault(require("react"));
const account_1 = require("../../lib/account");
const api_1 = require("../../lib/api");
const token_1 = __importDefault(require("../../lib/token"));
const validation_1 = require("../../validation");
const MessageBanner_1 = require("../MessageBanner");
const Page_1 = require("../Page");
const PasswordPage_1 = __importDefault(require("./PasswordPage"));
const RecoverPage_1 = __importDefault(require("./RecoverPage"));
class RecoverPageContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            sent: null,
            token: '',
        };
        this.initialRecoverValues = {
            email: '',
        };
        this.initialPasswordValues = {
            password: '',
        };
        this.verifyRecovery = (values, { setSubmitting, setErrors }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield account_1.resetPassword(values.password, this.state.token);
                token_1.default.set(token);
                setSubmitting(false);
                window.location.assign('/projects#' +
                    qs_1.stringify({
                        action: MessageBanner_1.MessageBannerAction.resetPassword,
                    }));
            }
            catch (error) {
                setSubmitting(false);
                const errors = {};
                if (error.response) {
                    if (error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                        errors.submit = 'Invalid or expired reset password link';
                    }
                    else if (error.response.status === http_status_codes_1.StatusCodes.BAD_REQUEST) {
                        errors.submit = 'Invalid parameters';
                    }
                    else {
                        errors.submit = 'An error occurred';
                    }
                }
                setErrors(errors);
            }
        });
        this.sendRecovery = (values, { setSubmitting, setErrors }) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield api_1.sendPasswordRecovery(values.email);
                setSubmitting(false);
                this.setState({
                    sent: values.email,
                });
            }
            catch (error) {
                setSubmitting(false);
                const errors = {};
                if (error.response) {
                    if (error.response.status === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
                        errors.notFound = 'Invalid username or password';
                    }
                    else if (error.response.status === http_status_codes_1.StatusCodes.BAD_REQUEST) {
                        errors.submit = 'Invalid parameters';
                    }
                    else {
                        errors.submit = 'An error occurred';
                    }
                }
                setErrors(errors);
            }
        });
    }
    componentDidMount() {
        const { token } = qs_1.parse(window.location.hash.substr(1));
        if (token) {
            this.setState({ token });
        }
    }
    render() {
        const { sent, token } = this.state;
        if (sent) {
            this.props.history.push('/login', {
                infoLoginMessage: 'An email with password reset instructions has been sent. Follow the link in the email to reset your password.',
            });
        }
        return (react_1.default.createElement(Page_1.Page, null,
            react_1.default.createElement(Page_1.Main, null, token ? (react_1.default.createElement(PasswordPage_1.default, { initialValues: this.initialPasswordValues, validationSchema: validation_1.passwordSchema, onSubmit: this.verifyRecovery })) : (react_1.default.createElement(RecoverPage_1.default, { initialValues: this.initialRecoverValues, validationSchema: validation_1.recoverSchema, onSubmit: this.sendRecovery })))));
    }
}
exports.default = RecoverPageContainer;
//# sourceMappingURL=RecoverPageContainer.js.map