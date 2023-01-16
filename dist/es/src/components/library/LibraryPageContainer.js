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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryPageContainer = void 0;
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importStar(require("react"));
const use_debounce_1 = require("../../hooks/use-debounce");
const store_1 = require("../../store");
const ExternalSearch_1 = require("./ExternalSearch");
const GlobalLibrary_1 = require("./GlobalLibrary");
const LibrarySidebar_1 = require("./LibrarySidebar");
const ProjectLibrary_1 = require("./ProjectLibrary");
const LibraryPageContainer = () => {
    const [{ projectID, user, globalLibraries, globalLibraryCollections, globalLibraryItems, projectLibrary, saveBiblioItem, projectLibraryCollections, },] = store_1.useStore((store) => ({
        projectID: store.projectID,
        user: store.user,
        globalLibraries: store.globalLibraries || new Map(),
        globalLibraryCollections: store.globalLibraryCollections || new Map(),
        globalLibraryItems: store.globalLibraryItems || new Map(),
        projectLibrary: store.library,
        saveBiblioItem: store.saveBiblioItem,
        projectLibraryCollections: store.projectLibraryCollections,
    }));
    const [selectedItem, setSelectedItem] = react_1.useState(); // TODO: item in route?
    const [sourceType, dispatch] = store_1.useStore((store) => store.sourceType || '');
    // TODO: should the query be part of the route?
    const [query, setQuery] = react_1.useState();
    const debouncedQuery = use_debounce_1.useDebounce(query, 500);
    const importItems = (items) => __awaiter(void 0, void 0, void 0, function* () {
        const newItems = [];
        for (const item of items) {
            const existingItem = library_1.matchLibraryItemByIdentifier(item, projectLibrary);
            if (!existingItem) {
                // add the item to the model map so it's definitely available
                projectLibrary.set(item._id, item);
                // save the new item
                const newItem = yield saveBiblioItem(item, projectID);
                newItems.push(newItem);
            }
        }
        return newItems;
    });
    const createBibliographyItem = react_1.useCallback(() => {
        const item = manuscript_transform_1.buildBibliographyItem({});
        saveBiblioItem(item, projectID)
            .then((item) => {
            dispatch({
                sourceType: 'project',
            });
            setSelectedItem(item);
        })
            .catch((error) => {
            console.error(error);
        });
    }, [saveBiblioItem, projectID, dispatch]);
    const switchView = () => {
        switch (sourceType) {
            case 'global':
                return (react_1.default.createElement(GlobalLibrary_1.GlobalLibrary, { globalLibraryItems: globalLibraryItems, projectLibrary: projectLibrary, query: query, setQuery: setQuery, debouncedQuery: debouncedQuery }));
            case 'search':
                return (react_1.default.createElement(ExternalSearch_1.ExternalSearch, { projectLibrary: projectLibrary, query: query, setQuery: setQuery, debouncedQuery: debouncedQuery }));
            case 'project':
            default:
                return (react_1.default.createElement(ProjectLibrary_1.ProjectLibrary, { projectLibraryCollections: projectLibraryCollections, projectLibrary: projectLibrary, user: user, query: query, setQuery: setQuery, selectedItem: selectedItem, setSelectedItem: setSelectedItem, debouncedQuery: debouncedQuery }));
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(LibrarySidebar_1.LibrarySidebar, { projectLibraryCollections: projectLibraryCollections, globalLibraries: globalLibraries, globalLibraryCollections: globalLibraryCollections, importItems: importItems, createBibliographyItem: createBibliographyItem }),
        switchView()));
};
exports.LibraryPageContainer = LibraryPageContainer;
exports.default = exports.LibraryPageContainer;
//# sourceMappingURL=LibraryPageContainer.js.map