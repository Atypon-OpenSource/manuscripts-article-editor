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
exports.fetchProjectScopedToken = exports.redirectToConnect = exports.refresh = exports.fetchScopedToken = exports.logout = exports.unmarkUserForDeletion = exports.markUserForDeletion = exports.refreshSyncSessions = exports.changePassword = exports.login = exports.resetPassword = exports.sendPasswordRecovery = exports.resendVerificationEmail = exports.verify = exports.signup = void 0;
const qs_1 = require("qs");
const config_1 = __importDefault(require("../../config"));
const client_1 = __importDefault(require("../client"));
const device_id_1 = __importDefault(require("../device-id"));
const signup = (name, email, password) => client_1.default.post('/registration/signup', {
    name,
    email,
    password,
});
exports.signup = signup;
const verify = (token) => client_1.default.post('/registration/verify', { token });
exports.verify = verify;
const resendVerificationEmail = (email) => client_1.default.post(`/registration/verify/resend`, { email });
exports.resendVerificationEmail = resendVerificationEmail;
const sendPasswordRecovery = (email) => client_1.default.post('/auth/sendForgottenPassword', { email });
exports.sendPasswordRecovery = sendPasswordRecovery;
const resetPassword = (password, token) => client_1.default.post('/auth/resetPassword', {
    password,
    token,
    deviceId: device_id_1.default,
}, {
    headers: config_1.default.api.headers,
    withCredentials: true,
});
exports.resetPassword = resetPassword;
const login = (email, password) => client_1.default.post('/auth/login', {
    email,
    password,
    deviceId: device_id_1.default,
}, {
    headers: config_1.default.api.headers,
    withCredentials: true,
});
exports.login = login;
const changePassword = (currentPassword, newPassword) => client_1.default.post('/auth/changePassword', {
    currentPassword,
    newPassword,
    deviceId: device_id_1.default,
});
exports.changePassword = changePassword;
const refreshSyncSessions = () => client_1.default.post('/auth/refreshSyncSessions', null, {
    withCredentials: true,
});
exports.refreshSyncSessions = refreshSyncSessions;
const markUserForDeletion = (password) => client_1.default.post('/user/mark-for-deletion', {
    password,
});
exports.markUserForDeletion = markUserForDeletion;
const unmarkUserForDeletion = () => client_1.default.post('/user/unmark-for-deletion');
exports.unmarkUserForDeletion = unmarkUserForDeletion;
const logout = () => client_1.default.post('/auth/logout', null, {
    withCredentials: true,
});
exports.logout = logout;
const fetchScopedToken = (scope) => client_1.default.request({
    url: `/authorization/${scope}`,
    method: 'GET',
    headers: {
        accept: 'text/plain',
    },
});
exports.fetchScopedToken = fetchScopedToken;
const refresh = () => client_1.default.request({
    url: '/token',
    method: 'POST',
    data: qs_1.stringify({
        grant_type: 'refresh',
    }),
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    },
});
exports.refresh = refresh;
const redirectToConnect = (action) => {
    window.location.assign(config_1.default.api.url +
        '/auth/iam?' +
        qs_1.stringify(Object.assign(Object.assign({ deviceId: device_id_1.default }, config_1.default.api.headers), { action })));
};
exports.redirectToConnect = redirectToConnect;
const fetchProjectScopedToken = (containerID, scope) => client_1.default.get(`/project/${containerID}/${scope}`);
exports.fetchProjectScopedToken = fetchProjectScopedToken;
//# sourceMappingURL=authentication.js.map