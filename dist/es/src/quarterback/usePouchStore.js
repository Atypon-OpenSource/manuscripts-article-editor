"use strict";
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
exports.usePouchStore = void 0;
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const isEqual_1 = __importDefault(require("lodash-es/isEqual"));
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const EXCLUDED_KEYS = [
    'id',
    '_id',
    '_rev',
    '_revisions',
    'sessionID',
    'createdAt',
    'updatedAt',
    'owners',
    'manuscriptID',
    'containerID',
    'src',
    'minWordCountRequirement',
    'maxWordCountRequirement',
    'minCharacterCountRequirement',
    'maxCharacterCountRequirement',
];
const hasChanged = (a, b) => {
    return !!Object.keys(a).find((key) => {
        if (EXCLUDED_KEYS.includes(key)) {
            return false;
        }
        return !isEqual_1.default(a[key], b[key]);
    });
};
exports.usePouchStore = zustand_1.default(middleware_1.combine({}, (set, get) => ({
    init(state) {
        set(state);
    },
    saveDoc: (doc) => __awaiter(void 0, void 0, void 0, function* () {
        const { getModels, saveModel } = get();
        if (!getModels || !saveModel) {
            return { err: 'usePouchStore not initialized', code: 500 };
        }
        const modelMap = getModels();
        if (!modelMap) {
            return { err: 'modelMap undefined inside usePouchStore', code: 500 };
        }
        const models = manuscript_transform_1.encode(doc);
        let errored;
        for (const model of models.values()) {
            const oldModel = modelMap.get(model._id);
            try {
                if (!oldModel) {
                    yield saveModel(model);
                }
                else if (hasChanged(model, oldModel)) {
                    const nextModel = Object.assign(Object.assign({}, oldModel), model);
                    yield saveModel(nextModel);
                }
            }
            catch (e) {
                errored = oldModel;
            }
        }
        if (errored) {
            return { err: `Failed to save model: ${errored}`, code: 500 };
        }
        return { data: true };
    }),
})));
//# sourceMappingURL=usePouchStore.js.map