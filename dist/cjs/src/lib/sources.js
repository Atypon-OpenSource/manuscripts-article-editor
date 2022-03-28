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
exports.sources = void 0;
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const config_1 = __importDefault(require("../config"));
exports.sources = [
    {
        id: 'crossref',
        name: 'Crossref',
        search: manuscript_editor_1.crossref.search,
        fetch: manuscript_editor_1.crossref.fetch,
    },
    {
        id: 'datacite',
        name: 'DataCite',
        search: manuscript_editor_1.datacite.search,
        fetch: manuscript_editor_1.datacite.fetch,
    },
    {
        id: 'pubmed',
        name: 'PubMed',
        search: manuscript_editor_1.pubmed.search,
        fetch: manuscript_editor_1.pubmed.fetch,
    },
];
if (config_1.default.translation_server.url) {
    exports.sources.push({
        id: 'url',
        name: 'URL',
        search: manuscript_editor_1.url.search,
        fetch: manuscript_editor_1.url.fetch,
    });
}
//# sourceMappingURL=sources.js.map