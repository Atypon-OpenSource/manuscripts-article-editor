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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Biblio = void 0;
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
const library_1 = require("@manuscripts/library");
const search_library_1 = require("../lib/search-library");
class Biblio {
    constructor(bundle, library, collection, lang) {
        this.matchLibraryItemByIdentifier = (item) => library_1.matchLibraryItemByIdentifier(item, this.library);
        this.filterLibraryItems = (query) => search_library_1.filterLibrary(this.library, query);
        this.getCitationProvider = () => this.citationProvider;
        this.removeLibraryItem = () => this.removeLibraryItem;
        this.getTools = () => {
            return {
                filterLibraryItems: this.filterLibraryItems,
                matchLibraryItemByIdentifier: this.matchLibraryItemByIdentifier,
                setLibraryItem: this.setLibraryItem,
                removeLibraryItem: this.removeLibraryItem,
                getCitationProvider: this.getCitationProvider,
                getLibraryItem: this.getLibraryItem,
            };
        };
        this.library = library;
        this.getLibraryItem = (id) => library.get(id);
        this.setLibraryItem = (item) => library.set(item._id, item);
        if (!bundle) {
            return;
        }
        collection
            .getAttachmentAsString(bundle._id, 'csl')
            .then((citationStyleData) => __awaiter(this, void 0, void 0, function* () {
            if (this.citationProvider && citationStyleData) {
                this.citationProvider.recreateEngine(citationStyleData, lang);
            }
            else {
                const styles = yield library_1.loadCitationStyle({
                    bundleID: bundle._id,
                    bundle,
                    citationStyleData,
                });
                const provider = new library_1.CitationProvider({
                    getLibraryItem: this.getLibraryItem,
                    citationStyle: styles,
                    lang,
                });
                this.citationProvider = provider;
            }
        }))
            .catch((error) => {
            if (window.Sentry) {
                window.Sentry.captureException(error);
            }
        });
    }
}
exports.Biblio = Biblio;
//# sourceMappingURL=Bibilo.js.map