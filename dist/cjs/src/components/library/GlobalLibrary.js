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
exports.GlobalLibrary = void 0;
const library_1 = require("@manuscripts/library");
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const search_library_1 = require("../../lib/search-library");
const store_1 = require("../../store");
const Page_1 = require("../Page");
const Search_1 = __importStar(require("../Search"));
const SearchResults_1 = require("./SearchResults");
const Container = styled_components_1.default.div `
  flex: 1;
`;
exports.GlobalLibrary = react_1.default.memo(({ debouncedQuery, globalLibraryItems, projectLibrary, query, setQuery }) => {
    const [error, setError] = react_1.useState();
    const [fetching, setFetching] = react_1.useState(new Set());
    const [selected, setSelected] = react_1.useState();
    const [results, setResults] = react_1.useState();
    const [filterID] = store_1.useStore((store) => store.filterID || '');
    const [sourceID] = store_1.useStore((store) => store.sourceID || '');
    const [{ projectID, saveBiblioItem }] = store_1.useStore((store) => ({
        projectID: store.projectID,
        saveBiblioItem: store.saveBiblioItem,
    }));
    react_1.useEffect(() => {
        search_library_1.filterLibrary(globalLibraryItems, debouncedQuery, new Set([filterID || sourceID]))
            .then((items) => {
            setResults({
                items,
                total: items.length, // TODO: may be truncated
            });
        })
            .catch((error) => {
            console.error(error);
        });
    }, [filterID, globalLibraryItems, debouncedQuery, sourceID]);
    const handleAdd = react_1.useCallback((item) => saveBiblioItem(item, projectID), [projectID, saveBiblioItem]);
    const handleQueryChange = react_1.useCallback((event) => {
        setQuery(event.target.value);
    }, [setQuery]);
    // const handleSelect = useCallback(() => {}, [])
    react_1.useEffect(() => {
        const selected = new Map();
        for (const item of projectLibrary.values()) {
            selected.set(library_1.estimateID(item), item);
        }
        setSelected(selected);
    }, [projectLibrary]);
    const handleSelect = react_1.useCallback((id, item) => {
        if (!selected) {
            throw new Error('Selected map not built');
        }
        const estimatedID = library_1.estimateID(item);
        if (selected.has(estimatedID)) {
            return;
        }
        setFetching((fetching) => {
            fetching.add(estimatedID);
            return new Set([...fetching]);
        });
        manuscript_editor_1.crossref
            .fetch(item)
            .then((data) => {
            const item = manuscript_transform_1.buildBibliographyItem(data);
            return handleAdd(item);
        })
            .then(() => {
            window.setTimeout(() => {
                setFetching((fetching) => {
                    fetching.delete(estimatedID);
                    return new Set([...fetching]);
                });
            }, 100);
        })
            .catch((error) => {
            // TODO: 'failed' state
            console.error('failed to add', error);
            setError('There was an error saving this item to the library');
        });
    }, [handleAdd, selected]);
    if (!results) {
        return null;
    }
    if (!selected) {
        return null;
    }
    return (react_1.default.createElement(Page_1.Main, null,
        react_1.default.createElement(Container, null,
            react_1.default.createElement(Search_1.SearchWrapper, null,
                react_1.default.createElement(Search_1.default, { autoComplete: 'off', autoFocus: true, handleSearchChange: handleQueryChange, placeholder: 'Search my library', type: 'search', value: query || '' })),
            react_1.default.createElement(SearchResults_1.SearchResults, { error: error, fetching: fetching, handleSelect: handleSelect, results: results, searching: false, selected: selected }))));
});
//# sourceMappingURL=GlobalLibrary.js.map