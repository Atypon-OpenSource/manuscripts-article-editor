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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPushSyncErrorMessage = exports.isWriteError = exports.isSyncTimeoutError = exports.isPullSyncError = exports.isPushSyncError = exports.isUnauthorized = void 0;
const http_status_codes_1 = require("http-status-codes");
const lodash_es_1 = require("lodash-es");
const isUnauthorized = (detail) => {
    const status = lodash_es_1.get(detail, 'error.status', null);
    if (!status) {
        return null;
    }
    return status === http_status_codes_1.StatusCodes.UNAUTHORIZED;
};
exports.isUnauthorized = isUnauthorized;
const isPushSyncError = (detail) => {
    return detail.direction === 'push' && detail.error;
};
exports.isPushSyncError = isPushSyncError;
const isPullSyncError = (detail) => {
    // error.status is undefined for longpoll errors
    const status = lodash_es_1.get(detail, 'error.status', null);
    if (!status) {
        return null;
    }
    return Boolean(detail.direction === 'pull' && status);
};
exports.isPullSyncError = isPullSyncError;
const isSyncTimeoutError = (detail) => {
    const status = lodash_es_1.get(detail, 'error.status', null);
    const reason = lodash_es_1.get(detail, 'error.reason', null);
    return (status === http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR && reason === 'TimeoutError');
};
exports.isSyncTimeoutError = isSyncTimeoutError;
const isWriteError = (detail) => {
    const status = lodash_es_1.get(detail, 'error.status', 0);
    return status >= 400;
};
exports.isWriteError = isWriteError;
const getPushSyncErrorMessage = (detail) => {
    const status = lodash_es_1.get(detail, 'error.status');
    switch (status) {
        case http_status_codes_1.StatusCodes.BAD_REQUEST:
        case http_status_codes_1.StatusCodes.FORBIDDEN:
            return `Syncing your changes failed due to invalid data.`;
        case http_status_codes_1.StatusCodes.NOT_FOUND:
            return `Syncing your changes failed because of missing data.`;
        case http_status_codes_1.StatusCodes.CONFLICT:
            return `Syncing your changes failed due to a data conflict.`;
        case http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR:
            return `Syncing your changes failed due to a server error on our end.`;
    }
    return `Syncing your changes failed.`;
};
exports.getPushSyncErrorMessage = getPushSyncErrorMessage;
//# sourceMappingURL=syncErrors.js.map