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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanItem = void 0;
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
// TODO: merge into one function?
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const funcs = [
    // Remove duplicate id field from all items
    (item) => {
        const { id, _id } = item;
        if (id) {
            if (!_id) {
                item._id = id;
            }
            delete item.id;
        }
        return item;
    },
    // Remove bundled and locked from all items
    (_a) => {
        var { bundled, locked } = _a, item = __rest(_a, ["bundled", "locked"]);
        return item;
    },
    // Remove derived fields from Contributors
    (item) => {
        if (item.objectType === manuscripts_json_schema_1.ObjectTypes.Contributor) {
            const { firstName, fullName, lastName, middleNames, nameString, prename } = item, rest = __rest(item, ["firstName", "fullName", "lastName", "middleNames", "nameString", "prename"]);
            return rest;
        }
        else {
            return item;
        }
    },
    // Remove caption field from Table
    (item) => {
        if (item.objectType === manuscripts_json_schema_1.ObjectTypes.Table) {
            const { caption } = item, rest = __rest(item, ["caption"]);
            return rest;
        }
        else {
            return item;
        }
    },
    // Remove _rev and collection from all items
    (_a) => {
        var { _rev, collection } = _a, item = __rest(_a, ["_rev", "collection"]);
        return item;
    },
    // Rename containingElement to containingObject with Citation items
    (item) => {
        if (item.objectType === manuscripts_json_schema_1.ObjectTypes.Citation) {
            const { containingElement, containingObject } = item, rest = __rest(item, ["containingElement", "containingObject"]);
            if (containingObject &&
                containingElement &&
                containingObject !== containingElement) {
                throw new Error('Mismatching container values for Citation');
            }
            return Object.assign(Object.assign({}, rest), { containingObject: containingElement });
        }
        else {
            return item;
        }
    },
    // Set a default type for BibliographyItems
    (item) => {
        if (item.objectType === manuscripts_json_schema_1.ObjectTypes.BibliographyItem && !item.type) {
            item.type = 'article-journal';
        }
        return item;
    },
    // Clean up author/embeddedAuthors in BibliographyItems
    (item) => {
        if (item.objectType === manuscripts_json_schema_1.ObjectTypes.BibliographyItem) {
            const { author, embeddedAuthors } = item;
            if (embeddedAuthors) {
                if (!author) {
                    item.author = embeddedAuthors.slice();
                }
                delete item.embeddedAuthors;
            }
        }
        return item;
    },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanItem = (item) => {
    for (const f of funcs) {
        item = f(item);
    }
    return item;
};
exports.cleanItem = cleanItem;
//# sourceMappingURL=ImporterUtils.js.map