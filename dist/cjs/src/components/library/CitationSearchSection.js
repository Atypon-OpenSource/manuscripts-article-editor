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
exports.CitationSearchSection = void 0;
const ArrowDownBlack_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlack"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../../config"));
const use_debounce_1 = require("../../hooks/use-debounce");
const SearchResults_1 = require("./SearchResults");
const ResultsSection = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
`;
const SearchSource = styled_components_1.default.div `
  margin: 0 ${(props) => props.theme.grid.unit * 4}px
    ${(props) => props.theme.grid.unit * 2}px;
  color: ${(props) => props.theme.colors.text.secondary};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.text.muted};
  }
`;
const MoreButton = styled_components_1.default(style_guide_1.SecondaryButton) `
  font-size: inherit;
  text-transform: none;
  text-decoration: underline;
  margin-left: 42px;
  color: ${(props) => props.theme.colors.button.default.color.default};
`;
const DropdownChevron = styled_components_1.default(ArrowDownBlack_1.default) `
  margin-right: ${(props) => props.theme.grid.unit * 4}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
`;
const CitationSearchSection = ({ query, source, addToSelection, selectSource, rows, selected, fetching, }) => {
    const [trimmedQuery, setTrimmedQuery] = react_1.useState(query.trim());
    const [error, setError] = react_1.useState();
    const [expanded, setExpanded] = react_1.useState(true);
    const [searching, setSearching] = react_1.useState(false);
    const [results, setResults] = react_1.useState();
    const debouncedQuery = use_debounce_1.useDebounce(trimmedQuery, 500);
    react_1.useEffect(() => {
        setTrimmedQuery(query.trim());
    }, [query]);
    react_1.useEffect(() => {
        setError(undefined);
        setResults(undefined);
        setSearching(trimmedQuery !== '');
    }, [trimmedQuery]);
    const handleSearchResults = react_1.useCallback((searchQuery, results) => {
        if (searchQuery === trimmedQuery) {
            setError(undefined);
            setSearching(false);
            setResults(results);
        }
    }, [trimmedQuery]);
    react_1.useEffect(() => {
        if (!expanded) {
            return;
        }
        if (source.id !== 'library' && !debouncedQuery) {
            return;
        }
        const initialQuery = debouncedQuery;
        source
            .search(initialQuery, { rows }, config_1.default.support.email)
            .then((results) => {
            handleSearchResults(initialQuery, results);
        })
            .catch((error) => {
            setError(error.message);
        })
            .finally(() => {
            setSearching(false);
        })
            .catch((error) => {
            setError(error.message);
        });
    }, [debouncedQuery, expanded, handleSearchResults, rows, source]);
    const toggleExpanded = react_1.useCallback(() => {
        setExpanded((value) => !value);
    }, []);
    return (react_1.default.createElement(ResultsSection, null,
        react_1.default.createElement(SearchSource, { onClick: toggleExpanded },
            react_1.default.createElement(DropdownChevron, { style: {
                    transform: expanded ? 'rotate(0)' : 'rotate(-90deg)',
                } }),
            source.title),
        expanded && (react_1.default.createElement(SearchResults_1.SearchResults, { error: error, results: results, searching: searching, handleSelect: addToSelection, selected: selected, fetching: fetching })),
        expanded && results && results.total > rows && (react_1.default.createElement(MoreButton, { onClick: () => selectSource(source.id), "data-cy": 'more-button' }, "Show more"))));
};
exports.CitationSearchSection = CitationSearchSection;
//# sourceMappingURL=CitationSearchSection.js.map