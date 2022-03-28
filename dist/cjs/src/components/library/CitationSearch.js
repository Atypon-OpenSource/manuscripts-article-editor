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
exports.CitationSearch = void 0;
const library_1 = require("@manuscripts/library");
const manuscript_editor_1 = require("@manuscripts/manuscript-editor");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Search_1 = __importStar(require("../Search"));
const BibliographyImportButton_1 = require("./BibliographyImportButton");
const CitationSearchSection_1 = require("./CitationSearchSection");
const Results = styled_components_1.default.div `
  max-height: 400px;
  overflow-y: auto;
`;
const Actions = styled_components_1.default(style_guide_1.ButtonGroup) `
  align-items: center;
  box-shadow: 0 -2px 12px 0 rgba(216, 216, 216, 0.26);
  display: flex;
  justify-content: space-between;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const Container = styled_components_1.default.div `
  flex: 1;
  font-family: ${(props) => props.theme.font.family.sans};
`;
const ImportButton = ({ importItems, importing, }) => (react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: importItems },
    react_1.default.createElement(style_guide_1.Tip, { title: 'Import bibliography data from a BibTeX or RIS file', placement: 'top' }, importing ? 'Importing…' : 'Import from File')));
const CitationSearch = ({ filterLibraryItems, handleCite, importItems: _importItems, query: initialQuery, handleCancel, }) => {
    const [error, setError] = react_1.useState();
    const [selectedSource, setSelectedSource] = react_1.useState();
    const [query, setQuery] = react_1.useState(initialQuery);
    const [selected, setSelected] = react_1.useState(new Map());
    const [fetching, setFetching] = react_1.useState(new Set());
    const [sources, setSources] = react_1.useState();
    const [updated, setUpdated] = react_1.useState(Date.now());
    const searchLibrary = react_1.useCallback((query, params) => {
        return filterLibraryItems(query).then((items) => ({
            items: items.slice(0, params.rows),
            total: items.length,
        }));
    }, [filterLibraryItems]);
    react_1.useEffect(() => {
        const sources = [
            {
                id: 'library',
                title: 'Library',
                search: searchLibrary,
            },
        ];
        if (query.trim().length > 2) {
            sources.push({
                id: 'crossref',
                title: 'External sources',
                search: (query, params, mailto) => manuscript_editor_1.crossref.search(query, params.rows, mailto),
            });
        }
        setSources(sources);
    }, [query, searchLibrary]);
    const addToSelection = react_1.useCallback((id, data) => {
        if (selected.has(id)) {
            selected.delete(id); // remove item
            setSelected(new Map([...selected]));
        }
        else if (data._id) {
            selected.set(id, data); // re-use existing data model
            setSelected(new Map([...selected]));
        }
        else {
            setFetching((fetching) => {
                fetching.add(id);
                return new Set([...fetching]);
            });
            // fetch Citeproc JSON
            manuscript_editor_1.crossref
                .fetch(data)
                .then((result) => {
                // remove DOI URLs
                if (result.URL &&
                    result.URL.match(/^https?:\/\/(dx\.)?doi\.org\//)) {
                    delete result.URL;
                }
                setSelected((selected) => {
                    selected.set(id, manuscript_transform_1.buildBibliographyItem(result));
                    return new Map([...selected]);
                });
                window.setTimeout(() => {
                    setFetching((fetching) => {
                        fetching.delete(id);
                        return new Set([...fetching]);
                    });
                }, 100);
            })
                .catch((error) => {
                setError(error.message);
            });
        }
    }, [selected]);
    const handleCiteClick = react_1.useCallback(() => {
        const items = Array.from(selected.values());
        return handleCite(items);
    }, [handleCite, selected]);
    const handleQuery = react_1.useCallback((event) => {
        setQuery(event.target.value);
    }, []);
    const importItems = react_1.useCallback((items) => {
        return _importItems(items).then((newItems) => {
            setSelected((selected) => {
                // if there's a single new imported item, select it
                if (newItems.length === 1) {
                    const [newItem] = newItems;
                    const estimatedID = library_1.estimateID(newItem);
                    selected.set(estimatedID, newItem);
                }
                return new Map([...selected]);
            });
            // clear the query after importing items
            setQuery('');
            // ensure that the filters re-run
            setUpdated(Date.now());
            return newItems;
        });
    }, [_importItems]);
    if (!sources) {
        return null;
    }
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(Search_1.SearchWrapper, null,
            react_1.default.createElement(Search_1.default, { autoComplete: 'off', handleSearchChange: handleQuery, placeholder: 'Search', type: 'search', value: query || '' })),
        react_1.default.createElement(Results, null,
            error && react_1.default.createElement("div", null, error),
            sources.map((source) => (react_1.default.createElement(CitationSearchSection_1.CitationSearchSection, { key: `${source.id}-${updated}`, source: source, addToSelection: addToSelection, selectSource: () => setSelectedSource(source.id), selected: selected, fetching: fetching, query: query, rows: selectedSource === source.id ? 25 : 3 })))),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(BibliographyImportButton_1.BibliographyImportButton, { importItems: importItems, component: ImportButton })),
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: handleCancel }, "Close"),
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: handleCiteClick, disabled: selected.size === 0 }, "Cite")))));
};
exports.CitationSearch = CitationSearch;
//# sourceMappingURL=CitationSearch.js.map