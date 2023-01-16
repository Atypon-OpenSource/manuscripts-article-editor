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
const api_1 = require("../../lib/api");
const validation_1 = require("../../validation");
const Page_1 = require("../Page");
const LoginMessages_1 = require("./LoginMessages");
const SignupMessages_1 = require("./SignupMessages");
const SignupPage_1 = __importDefault(require("./SignupPage"));
const errorResponseMessage = (status) => {
    switch (status) {
        case http_status_codes_1.StatusCodes.BAD_REQUEST:
            return 'Invalid operation';
        case http_status_codes_1.StatusCodes.CONFLICT:
            return 'The email address is already registered';
        default:
            return 'An error occurred.';
    }
};
class SignupPageContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.handleError = (error, setErrors, email) => __awaiter(this, void 0, void 0, function* () {
            const errors = {};
            if (error.response) {
                const { data } = error.response;
                const name = JSON.parse(data.error).name;
                if (data &&
                    data.error &&
                    name === 'ConflictingUnverifiedUserExistsError') {
                    this.setState({
                        message: () => SignupMessages_1.signupVerifyConflictMessage(email),
                        email: undefined,
                    });
                    yield api_1.resendVerificationEmail(email);
                }
                else if (data && data.error && name === 'GatewayInaccessibleError') {
                    this.setState({
                        message: () => LoginMessages_1.gatewayInaccessibleErrorMessage(),
                    });
                }
                else {
                    errors.submit = errorResponseMessage(error.response.status);
                    setErrors(errors);
                }
            }
            else {
                this.setState({
                    message: () => LoginMessages_1.networkErrorMessage(),
                });
            }
        });
        this.resendVerificationEmail = () => __awaiter(this, void 0, void 0, function* () {
            const email = this.state.email;
            if (!email) {
                return;
            }
            try {
                yield api_1.resendVerificationEmail(email);
                this.setState({
                    message: () => SignupMessages_1.signupVerifyResendSuccessMessage(email),
                });
            }
            catch (error) {
                this.setState({
                    message: () => SignupMessages_1.signupVerifyResendFailureMessage(email, this.resendVerificationEmail),
                });
            }
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, email } = qs_1.parse(window.location.hash.substr(1));
            const message = this.props.location.state
                ? this.props.location.state.errorMessage
                : null;
            if (message === 'missing-user-profile') {
                this.setState({
                    message: () => LoginMessages_1.userAccountErrorMessage(),
                });
            }
            if (token) {
                try {
                    yield api_1.verify(token);
                    this.props.history.push(`/login?${qs_1.stringify({ email })}`, {
                        verificationMessage: 'Your account is now verified.',
                    });
                }
                catch (error) {
                    this.props.history.push('/login', {
                        verificationMessage: 'account-verification-failed',
                    });
                }
            }
        });
    }
    render() {
        const { message } = this.state;
        return (react_1.default.createElement(Page_1.Page, null,
            react_1.default.createElement(Page_1.Main, null,
                message && message(),
                react_1.default.createElement(SignupPage_1.default, { initialValues: {
                        email: '',
                        password: '',
                        name: '',
                    }, onSubmit: (values, actions) => __awaiter(this, void 0, void 0, function* () {
                        const { name, email, password } = values;
                        try {
                            yield api_1.signup(name, email, password);
                            actions.setSubmitting(false);
                            this.setState({
                                message: () => SignupMessages_1.signupVerifyMessage(email, this.resendVerificationEmail),
                                email,
                            });
                        }
                        catch (error) {
                            actions.setSubmitting(false);
                            yield this.handleError(error, actions.setErrors, email);
                        }
                    }), validationSchema: validation_1.signupSchema }))));
    }
}
exports.default = SignupPageContainer;
//# sourceMappingURL=SignupPageContainer.js.map