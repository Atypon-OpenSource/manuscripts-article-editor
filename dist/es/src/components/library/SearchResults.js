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
exports.SearchResults = void 0;
const AddedIcon_1 = __importDefault(require("@manuscripts/assets/react/AddedIcon"));
const AddIcon_1 = __importDefault(require("@manuscripts/assets/react/AddIcon"));
const library_1 = require("@manuscripts/library");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const SearchResult = styled_components_1.default.div `
  cursor: pointer;
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
  display: flex;

  &:not(:last-of-type) {
    border-bottom: 1px solid #f6f6f6;
  }
`;
const SearchResultAuthors = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.light};
  margin-top: ${(props) => props.theme.grid.unit}px;
`;
const ResultAuthorsPlaceholder = styled_components_1.default(SearchResultAuthors) `
  background: ${(props) => props.theme.colors.text.muted};
  height: 1.2em;
`;
const ResultTitlePlaceholder = styled_components_1.default.div `
  background: ${(props) => props.theme.colors.border.primary};
  height: 1.2em;
`;
const ResultMetadata = styled_components_1.default.div `
  flex: 1;
`;
const Fetching = styled_components_1.default.div `
  display: inline-block;
  height: ${(props) => props.theme.grid.unit * 6}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
  border: 1px dashed ${(props) => props.theme.colors.brand.default};
  box-sizing: border-box;
  border-radius: 50%;
  animation: spin 10s linear infinite;

  @keyframes spin {
    100% {
      transform: rotateZ(360deg);
    }
  }
`;
const StatusIcon = styled_components_1.default.div `
  flex-shrink: 1;
  margin-right: ${(props) => props.theme.grid.unit * 3}px;
  height: ${(props) => props.theme.grid.unit * 6}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const Results = styled_components_1.default.div `
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  flex: 1;
  overflow-y: auto;
`;
const Error = styled_components_1.default.div `
  padding: 0 ${(props) => props.theme.grid.unit * 3}px;
`;
const ResultPlaceholder = () => (react_1.default.createElement(SearchResult, { style: { opacity: 0.2 } },
    react_1.default.createElement("div", { style: { width: 40 } }, "\u2026"),
    react_1.default.createElement(ResultMetadata, null,
        react_1.default.createElement(ResultTitlePlaceholder, null),
        react_1.default.createElement(ResultAuthorsPlaceholder, null))));
const chooseStatusIcon = (fetching, selected, id) => {
    if (fetching.has(id)) {
        return react_1.default.createElement(Fetching, null);
    }
    if (selected.has(id)) {
        return react_1.default.createElement(AddedIcon_1.default, { "data-cy": 'plus-icon-ok', width: 24, height: 24 });
    }
    return react_1.default.createElement(AddIcon_1.default, { "data-cy": 'plus-icon', width: 24, height: 24 });
};
const SearchResults = ({ error, searching, results, handleSelect, selected, fetching }) => {
    if (error) {
        // TODO: keep results if error while fetching
        return react_1.default.createElement(Error, null, error);
    }
    if (searching) {
        return (react_1.default.createElement(Results, null,
            react_1.default.createElement(ResultPlaceholder, null),
            react_1.default.createElement(ResultPlaceholder, null),
            react_1.default.createElement(ResultPlaceholder, null)));
    }
    if (!results || !results.items || !results.items.length) {
        return null;
    }
    return (react_1.default.createElement(Results, null, results.items.map((item) => {
        const id = library_1.estimateID(item);
        return (react_1.default.createElement(SearchResult, { onClick: () => handleSelect(id, item), key: id },
            react_1.default.createElement(StatusIcon, null, chooseStatusIcon(fetching, selected, id)),
            react_1.default.createElement(ResultMetadata, null,
                react_1.default.createElement(title_editor_1.Title, { value: item.title || 'Untitled', title: item.title }),
                react_1.default.createElement(SearchResultAuthors, { "data-cy": 'search-result-author' }, library_1.shortLibraryItemMetadata(item)))));
    })));
};
exports.SearchResults = SearchResults;
//# sourceMappingURL=SearchResults.js.map