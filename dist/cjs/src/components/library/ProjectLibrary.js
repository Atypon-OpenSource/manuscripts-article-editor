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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectLibrary = void 0;
const react_1 = __importStar(require("react"));
const search_library_1 = require("../../lib/search-library");
const store_1 = require("../../store");
const Page_1 = require("../Page");
const Panel_1 = __importDefault(require("../Panel"));
const ResizerButtons_1 = require("../ResizerButtons");
const LibraryForm_1 = __importDefault(require("./LibraryForm"));
const LibraryItems_1 = require("./LibraryItems");
exports.ProjectLibrary = react_1.default.memo(({ projectLibraryCollections, projectLibrary, user, query, setQuery, selectedItem, setSelectedItem, }) => {
    const [filteredItems, setFilteredItems] = react_1.useState([]);
    const [{ updateBiblioItem, deleteBiblioItem }] = store_1.useStore((store) => ({
        deleteBiblioItem: store.deleteBiblioItem,
        updateBiblioItem: store.updateBiblioItem,
    }));
    const [filterID] = store_1.useStore((store) => store.libraryFilterID || '');
    react_1.useEffect(() => {
        search_library_1.filterLibrary(projectLibrary, query, filterID ? new Set([filterID]) : undefined)
            .then((filteredItems) => {
            filteredItems.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
            setFilteredItems(filteredItems);
        })
            .catch((error) => {
            console.error(error);
        });
    }, [filterID, projectLibrary, query]);
    const handleSave = react_1.useCallback((item) => {
        // @ts-ignore https://github.com/jaredpalmer/formik/issues/2180
        if (item.issued === '') {
            item.issued = undefined;
        }
        return updateBiblioItem(item).then(() => {
            setSelectedItem(undefined);
        });
    }, [updateBiblioItem, setSelectedItem]);
    const handleDelete = react_1.useCallback((item) => {
        if (!window.confirm('Remove this item from the project library?')) {
            return Promise.resolve(false);
        }
        return deleteBiblioItem(item)
            .then(() => {
            // this.setState({
            //   item: null,
            // })
            // TODO: change route
        })
            .then(() => {
            setSelectedItem(undefined);
            return item._id;
        });
    }, [deleteBiblioItem, setSelectedItem]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Page_1.Main, null,
            react_1.default.createElement(LibraryItems_1.LibraryItems, { query: query, setQuery: setQuery, handleSelect: setSelectedItem, hasItem: () => true, items: filteredItems, filterID: filterID, projectLibraryCollections: projectLibraryCollections, selectedItem: selectedItem })),
        react_1.default.createElement(Panel_1.default, { name: 'libraryItem', side: 'start', direction: 'row', minSize: 300, resizerButton: ResizerButtons_1.ResizingInspectorButton }, selectedItem && (react_1.default.createElement(LibraryForm_1.default, { key: selectedItem._id, item: selectedItem, handleSave: handleSave, handleDelete: handleDelete, user: user })))));
});
//# sourceMappingURL=ProjectLibrary.js.map