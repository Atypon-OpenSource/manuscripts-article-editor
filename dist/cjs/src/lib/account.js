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
exports.resetPassword = exports.logout = exports.login = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const db_1 = require("../couch-data/db");
const user_id_1 = __importDefault(require("../lib/user-id"));
const api = __importStar(require("./api"));
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: decide whether to remove the local database at login
    const { data: { token, recover }, } = yield api.login(email, password);
    try {
        const oldUserId = user_id_1.default.get();
        const { userId } = jwt_decode_1.default(token);
        if (oldUserId !== userId) {
            yield db_1.removeDatabase();
        }
    }
    catch (e) {
        console.error(e);
        // TODO: removing the local database failed
    }
    return { token, recover };
});
exports.login = login;
const logout = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield api.logout();
    }
    catch (e) {
        console.error(e);
        // TODO: request to the API server failed
    }
    try {
        yield db_1.removeDatabase();
    }
    catch (e) {
        console.error(e);
        // TODO: removing the local database failed
    }
    // TODO: clear localStorage
});
exports.logout = logout;
const resetPassword = (password, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { token }, } = yield api.resetPassword(password, verificationToken);
    return token;
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=account.js.map