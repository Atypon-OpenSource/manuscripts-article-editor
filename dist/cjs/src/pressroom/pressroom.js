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
exports.exportData = exports.importData = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const api_1 = require("../lib/api");
const client = axios_1.default.create({
    baseURL: config_1.default.pressroom.url,
});
client.interceptors.request.use((requestConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: token } = yield api_1.fetchScopedToken('pressroom-js');
    requestConfig.headers.Authorization = `Bearer ${token}`;
    return requestConfig;
}));
const validateResponse = (response) => {
    switch (response.status) {
        case 200:
        case 202:
        case 204:
            break;
        // TODO: handle authentication failure (401), timeout, too large, etc
        default:
            console.log(response.headers);
            console.log(response.data);
            throw new Error('Something went wrong: ' + response.data);
    }
};
const importData = (form, sourceFormat, headers = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield client.post(`/import/${sourceFormat}`, form, {
        responseType: 'blob',
        headers,
    });
    validateResponse(response);
    return response.data;
});
exports.importData = importData;
const exportData = (form, targetFormat, retries = 0) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (retries > 0) {
            form.append('allowMissingElements', 'true');
        }
        const response = yield client.post(`/export/${targetFormat}`, form, {
            responseType: 'blob',
        });
        validateResponse(response);
        return response.data;
    }
    catch (e) {
        if (retries > 0 || e.status !== 400) {
            throw e;
        }
        return exports.exportData(form, targetFormat, 1);
    }
});
exports.exportData = exportData;
//# sourceMappingURL=pressroom.js.map