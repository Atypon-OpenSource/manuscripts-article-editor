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
exports.RequireLogin = void 0;
const qs_1 = require("qs");
const react_1 = __importDefault(require("react"));
const react_router_1 = require("react-router");
const config_1 = __importDefault(require("../config"));
const api_1 = require("../lib/api");
const redirect_path_1 = __importDefault(require("../lib/redirect-path"));
const RequireLogin = ({ children: message, location: from, profileMissing }) => {
    redirect_path_1.default.set(location.pathname);
    const { autologin } = qs_1.parse(location.search.substr(1));
    if (typeof autologin !== 'undefined' && config_1.default.connect.enabled) {
        api_1.redirectToConnect('login');
        return null;
    }
    if (profileMissing) {
        return (react_1.default.createElement(react_router_1.Redirect, { to: {
                pathname: `/login`,
                state: {
                    errorMessage: 'missing-user-profile',
                },
            } }));
    }
    return (react_1.default.createElement(react_router_1.Redirect, { to: {
            pathname: '/login',
            state: { infoLoginMessage: message },
        } }));
};
exports.RequireLogin = RequireLogin;
//# sourceMappingURL=RequireLogin.js.map