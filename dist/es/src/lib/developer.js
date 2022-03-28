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
exports.createUserProfile = exports.createToken = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const uuid_1 = require("uuid");
const CollectionManager_1 = __importDefault(require("../sync/CollectionManager"));
const token_1 = __importDefault(require("./token"));
const createToken = () => {
    const data = {
        expiry: +new Date() + 10000,
        userId: 'developer@example.com',
        userProfileId: `${manuscripts_json_schema_1.ObjectTypes.UserProfile}:${uuid_1.v4()}`,
    };
    const token = ['', btoa(JSON.stringify(data)), ''].join('.');
    token_1.default.set(token);
};
exports.createToken = createToken;
const createUserProfile = (db) => __awaiter(void 0, void 0, void 0, function* () {
    exports.createToken();
    const token = token_1.default.get();
    const { userId: userID, userProfileId: userProfileID } = jwt_decode_1.default(token);
    const bibliographicName = {
        _id: 'MPBibliographicName:developer',
        objectType: manuscripts_json_schema_1.ObjectTypes.BibliographicName,
        given: 'Developer',
        family: 'User',
    };
    const profile = {
        _id: userProfileID,
        objectType: manuscripts_json_schema_1.ObjectTypes.UserProfile,
        userID,
        bibliographicName,
    };
    const userCollection = yield CollectionManager_1.default.createCollection({
        collection: 'user',
        channels: [],
        db,
    });
    yield userCollection.create(profile);
});
exports.createUserProfile = createUserProfile;
//# sourceMappingURL=developer.js.map