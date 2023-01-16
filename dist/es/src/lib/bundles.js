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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBundle = void 0;
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const shared_data_1 = require("./shared-data");
const attachBundleStyle = (bundle) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = bundle.csl) === null || _a === void 0 ? void 0 : _a.cslIdentifier) {
        bundle.attachment = {
            id: 'csl',
            type: 'application/vnd.citationstyles.style+xml',
            data: yield library_1.loadCitationStyle({ bundle }),
        };
    }
});
const loadBundle = (bundleID) => __awaiter(void 0, void 0, void 0, function* () {
    const models = [];
    const bundles = yield shared_data_1.importSharedData('bundles');
    const bundle = manuscript_transform_1.createNewBundle(bundleID || manuscript_transform_1.DEFAULT_BUNDLE, bundles);
    yield attachBundleStyle(bundle);
    models.push(bundle);
    const parentBundle = manuscript_transform_1.createParentBundle(bundle, bundles);
    if (parentBundle) {
        yield attachBundleStyle(parentBundle);
        models.push(parentBundle);
    }
    return models;
});
exports.loadBundle = loadBundle;
//# sourceMappingURL=bundles.js.map