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
import { LocationState } from 'history';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
declare type AlertFunction = React.FunctionComponent;
export declare enum ErrorName {
    GatewayInaccessibleError = "GatewayInaccessibleError",
    AccountNotFoundError = "AccountNotFoundError",
    InvalidClientApplicationError = "InvalidClientApplicationError",
    InvalidCredentialsError = "InvalidCredentialsError"
}
interface State {
    message?: AlertFunction;
    submitErrorType?: string;
}
interface RouteLocationState {
    from?: LocationState;
    action?: string;
    loginMessage?: string;
    verificationMessage?: string;
    infoLoginMessage?: string;
    errorMessage?: string;
}
declare class LoginPageContainer extends React.Component<RouteComponentProps<{}, {}, RouteLocationState>, State> {
    state: Readonly<State>;
    private initialValues;
    componentDidMount(): void;
    render(): JSX.Element;
    private isRedirectAction;
    private handleHash;
    private handleState;
    private handleErrorResponse;
    private redirectAfterLogin;
    private errorName;
    private errorResponseMessage;
    private resendVerificationEmail;
}
export default LoginPageContainer;
