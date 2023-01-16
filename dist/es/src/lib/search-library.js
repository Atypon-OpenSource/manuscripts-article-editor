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
exports.filterLibrary = void 0;
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const hasFilter = (filters, keywordIDs) => {
    if (!keywordIDs) {
        return false;
    }
    for (const keywordID of keywordIDs) {
        if (filters.has(keywordID)) {
            return true;
        }
    }
    return false;
};
const newestFirst = (a, b) => {
    if (a.createdAt === b.createdAt) {
        return 0;
    }
    if (!a.createdAt) {
        return -1;
    }
    if (!b.createdAt) {
        return 1;
    }
    return b.createdAt - a.createdAt;
};
const prepareBibliographyItem = (item) => {
    const output = Object.assign({}, item);
    // add "authors" string containing all author names
    if (output.author) {
        output.authors = output.author
            .map((author) => [author.given, author.family].join(' '))
            .join(', ');
    }
    return output;
};
let sortPromise;
const filterLibrary = (library, query, filters) => __awaiter(void 0, void 0, void 0, function* () {
    if (sortPromise) {
        sortPromise.cancel();
    }
    if (!library) {
        return [];
    }
    if (!query && !filters) {
        const items = Array.from(library.values());
        items.sort(newestFirst);
        return items;
    }
    const filteredItems = [];
    for (const item of library.values()) {
        if (!filters || hasFilter(filters, item.keywordIDs)) {
            filteredItems.push(item);
        }
    }
    if (!query) {
        return filteredItems;
    }
    const preparedItems = filteredItems.map(prepareBibliographyItem);
    sortPromise = fuzzysort_1.default.goAsync(query, preparedItems, {
        keys: ['title', 'authors'],
        limit: 100,
        allowTypo: false,
        threshold: -1000,
    });
    const results = yield sortPromise;
    const output = results.map((result) => result.obj);
    output.sort(newestFirst);
    return output;
});
exports.filterLibrary = filterLibrary;
//# sourceMappingURL=search-library.js.map