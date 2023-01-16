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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ErrorName = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const http_status_codes_1 = require("http-status-codes");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const qs_1 = require("qs");
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../../config"));
const account_1 = require("../../lib/account");
const api_1 = require("../../lib/api");
const redirect_path_1 = __importDefault(require("../../lib/redirect-path"));
const token_1 = __importDefault(require("../../lib/token"));
const user_id_1 = __importDefault(require("../../lib/user-id"));
const validation_1 = require("../../validation");
const IntroPage_1 = require("../IntroPage");
const Loading_1 = require("../Loading");
const Page_1 = require("../Page");
const messages = __importStar(require("./LoginMessages"));
const LoginPage_1 = __importDefault(require("./LoginPage"));
var ErrorName;
(function (ErrorName) {
    ErrorName["GatewayInaccessibleError"] = "GatewayInaccessibleError";
    ErrorName["AccountNotFoundError"] = "AccountNotFoundError";
    ErrorName["InvalidClientApplicationError"] = "InvalidClientApplicationError";
    ErrorName["InvalidCredentialsError"] = "InvalidCredentialsError";
})(ErrorName = exports.ErrorName || (exports.ErrorName = {}));
class LoginPageContainer extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.initialValues = {
            email: '',
            password: '',
        };
        this.isRedirectAction = (redirect) => redirect === 'login' || redirect === 'register';
        this.handleHash = (hash) => {
            const { action, error, access_token: token, redirect, error_description, recover, } = qs_1.parse(hash);
            if (error_description) {
                // TODO: do something
                console.error(error_description);
            }
            if (error) {
                this.setState({
                    message: () => messages.identityProviderErrorMessage(error),
                });
            }
            else if (action === 'logout') {
                this.setState({
                    message: () => messages.infoLoginMessage('You have been signed out'),
                });
            }
            else if (token) {
                token_1.default.set(token);
                recover === 'true'
                    ? window.location.assign('/retrieve-account')
                    : this.redirectAfterLogin();
            }
            if (redirect && config_1.default.connect.enabled) {
                api_1.redirectToConnect(this.isRedirectAction(redirect) ? redirect : undefined);
            }
        };
        this.handleState = (state) => {
            const { infoLoginMessage, loginMessage, verificationMessage, errorMessage, } = state;
            // TODO: pass message and messageType in state
            if (loginMessage) {
                this.setState({
                    message: () => messages.warningLoginMessage(loginMessage),
                });
            }
            else if (verificationMessage) {
                this.setState({
                    message: () => messages.verificationMessage(verificationMessage),
                });
            }
            else if (infoLoginMessage) {
                this.setState({
                    message: () => messages.infoLoginMessage(infoLoginMessage),
                });
            }
            else if (errorMessage === 'missing-user-profile') {
                this.setState({
                    message: () => messages.userAccountErrorMessage(),
                });
            }
        };
        this.handleErrorResponse = (response, values, actions) => {
            const errorName = this.errorName(response);
            switch (errorName) {
                case ErrorName.GatewayInaccessibleError:
                    this.setState({
                        message: messages.gatewayInaccessibleErrorMessage,
                    });
                    return;
                case ErrorName.InvalidCredentialsError:
                default: {
                    const errors = {
                        submit: this.errorResponseMessage(response.status, values, errorName),
                    };
                    actions.setErrors(errors);
                    this.setState({
                        submitErrorType: errorName,
                    });
                    return;
                }
            }
        };
        // redirect if the user tried before login to access an authenticated route
        // (e.g. a bookmarked project, but not a project invitation link,
        // that is handled with invitationTokenHandler and AcceptProjectInvitation component)
        this.redirectAfterLogin = () => {
            const redirectPath = redirect_path_1.default.get();
            if (redirectPath) {
                redirect_path_1.default.remove();
                window.location.assign(redirectPath);
            }
            else {
                window.location.assign('/projects');
            }
        };
        this.errorName = (response) => {
            const { data } = response;
            if (!data) {
                return null;
            }
            if (!data.error) {
                return null;
            }
            const error = JSON.parse(data.error);
            return error ? error.name : null;
        };
        this.errorResponseMessage = (status, values, errorName) => {
            switch (status) {
                case http_status_codes_1.StatusCodes.BAD_REQUEST:
                    return 'Invalid operation';
                case http_status_codes_1.StatusCodes.UNAUTHORIZED:
                    if (errorName === ErrorName.AccountNotFoundError) {
                        return 'No user exists with this email address.';
                    }
                    else if (errorName === ErrorName.InvalidClientApplicationError) {
                        return `Client and server configuration do not match. Please report this to ${config_1.default.support.email}.`;
                    }
                    else {
                        return 'Invalid password.';
                    }
                case http_status_codes_1.StatusCodes.FORBIDDEN: {
                    const resendVerificationData = {
                        message: 'Please verify your email address',
                        email: values.email,
                        type: style_guide_1.AlertMessageType.warning,
                    };
                    this.setState({
                        message: () => messages.resendVerificationDataMessage(resendVerificationData, () => this.resendVerificationEmail(values.email)),
                    });
                    break;
                }
                default:
                    return 'An error occurred.';
            }
        };
        this.resendVerificationEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield api_1.resendVerificationEmail(email);
                this.setState({
                    message: undefined,
                });
            }
            catch (error) {
                const resendVerificationData = {
                    message: 'Re-sending verification email failed.',
                    email,
                    type: style_guide_1.AlertMessageType.error,
                };
                this.setState({
                    message: () => messages.resendVerificationDataMessage(resendVerificationData, () => this.resendVerificationEmail(email)),
                });
            }
        });
    }
    componentDidMount() {
        const { location: { hash, state, search }, } = this.props;
        if (hash.length > 1) {
            this.handleHash(hash.substr(1));
        }
        const { email } = qs_1.parse(search.substr(1));
        if (email) {
            this.initialValues.email = email;
        }
        if (state) {
            this.handleState(state);
        }
    }
    render() {
        const { message: Message, submitErrorType } = this.state;
        const hash = this.props.location.hash;
        const { access_token: token, redirect } = qs_1.parse(hash.substr(1));
        if (token || redirect) {
            return react_1.default.createElement(Loading_1.Loading, null);
        }
        if (config_1.default.connect.enabled) {
            return react_1.default.createElement(IntroPage_1.IntroPage, { message: Message });
        }
        return (react_1.default.createElement(Page_1.Page, null,
            react_1.default.createElement(Page_1.Main, null,
                react_1.default.createElement(react_1.default.Fragment, null,
                    Message && react_1.default.createElement(Message, null),
                    react_1.default.createElement(LoginPage_1.default, { initialValues: this.initialValues, validationSchema: validation_1.loginSchema, submitErrorType: submitErrorType, onSubmit: (values, actions) => __awaiter(this, void 0, void 0, function* () {
                            token_1.default.remove();
                            try {
                                const { token, recover } = yield account_1.login(values.email, values.password);
                                token_1.default.set(token);
                                const { userId } = jwt_decode_1.default(token);
                                user_id_1.default.set(userId);
                                recover
                                    ? window.location.assign('/retrieve-account')
                                    : this.redirectAfterLogin();
                            }
                            catch (error) {
                                console.error(error);
                                if (error.response) {
                                    this.handleErrorResponse(error.response, values, actions);
                                }
                                else {
                                    this.setState({
                                        message: messages.networkErrorMessage,
                                    });
                                }
                                actions.setSubmitting(false);
                            }
                        }) })))));
    }
}
exports.default = LoginPageContainer;
//# sourceMappingURL=LoginPageContainer.js.map