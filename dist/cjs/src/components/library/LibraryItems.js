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
exports.LibraryItems = void 0;
const ReferenceLibraryIcon_1 = __importDefault(require("@manuscripts/assets/react/ReferenceLibraryIcon"));
const library_1 = require("@manuscripts/library");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Search_1 = __importStar(require("../Search"));
const Container = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;
const Items = styled_components_1.default.div `
  flex: 1;
  overflow-y: auto;
`;
const Item = styled_components_1.default.div `
  cursor: pointer;
  padding: ${(props) => props.theme.grid.unit * 3}px;
  border-bottom: 1px solid;
  border-top: 1px solid;
  background-color: ${(props) => props.isActive ? props.theme.colors.background.fifth : 'transparent'};
  border-color: ${(props) => props.isActive ? props.theme.colors.border.primary : 'transparent'};
  transition: background-color 0.25s;
  display: flex;
  ${(props) => !props.isActive &&
    'box-shadow: 0 1px 0 0 ' + props.theme.colors.border.secondary};

  &:hover {
    box-shadow: unset;
    background-color: ${(props) => props.theme.colors.background.fifth};
  }
`;
const ItemMetadata = styled_components_1.default.div `
  flex: 1;
`;
const Metadata = styled_components_1.default.div `
  margin-top: ${(props) => props.theme.grid.unit}px;
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.light};
`;
const Collections = styled_components_1.default.div `
  display: flex;
  flex-wrap: wrap;
  margin-top: ${(props) => props.theme.grid.unit * 2}px;
`;
const Collection = styled_components_1.default.span `
  border-radius: ${(props) => props.theme.grid.radius.default};
  display: inline-flex;
  align-items: center;
  padding: 2px ${(props) => props.theme.grid.unit * 2}px;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
  background-color: ${(props) => props.theme.colors.border.secondary};
  font-size: 90%;
`;
const ActiveCollection = styled_components_1.default(Collection) `
  background-color: ${(props) => props.theme.colors.brand.default};
  color: ${(props) => props.theme.colors.text.onDark};
`;
const ItemIcon = styled_components_1.default.div `
  flex-shrink: 1;
  margin-right: ${(props) => props.theme.grid.unit * 4}px;
  height: ${(props) => props.theme.grid.unit * 6}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const StyledReferenceLibraryIcon = styled_components_1.default(ReferenceLibraryIcon_1.default) `
  path {
    stroke: ${(props) => props.theme.colors.text.muted};
  }
`;
const EmptyItems = styled_components_1.default.div `
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const LibraryItems = ({ query, setQuery, handleSelect, items, filterID, projectLibraryCollections, selectedItem, }) => (react_1.default.createElement(Container, null,
    react_1.default.createElement(Search_1.SearchWrapper, null,
        react_1.default.createElement(Search_1.default, { autoComplete: 'off', autoFocus: !selectedItem, handleSearchChange: (e) => setQuery(e.target.value), placeholder: 'Search library…', type: 'search', value: query || '' })),
    query && items.length === 0 && (react_1.default.createElement(EmptyItems, null, "No items match this query.")),
    items.length > 0 && (react_1.default.createElement(Items, null, items.map((item) => (react_1.default.createElement(Item, { key: item._id, onClick: () => handleSelect(item), isActive: selectedItem ? selectedItem._id === item._id : false },
        react_1.default.createElement(ItemIcon, null,
            react_1.default.createElement(StyledReferenceLibraryIcon, null)),
        react_1.default.createElement(ItemMetadata, null,
            react_1.default.createElement(title_editor_1.Title, { value: item.title || 'Untitled', title: item.title }),
            react_1.default.createElement(Metadata, { "data-cy": 'search-result-author' }, library_1.fullLibraryItemMetadata(item)),
            item.keywordIDs && (react_1.default.createElement(Collections, null, item.keywordIDs.map((keywordID) => {
                const libraryCollection = projectLibraryCollections.get(keywordID);
                if (!libraryCollection) {
                    return null;
                }
                if (keywordID === filterID) {
                    return (react_1.default.createElement(ActiveCollection, { key: keywordID }, libraryCollection.name));
                }
                return (react_1.default.createElement(Collection, { key: keywordID }, libraryCollection.name));
            })))))))))));
exports.LibraryItems = LibraryItems;
//# sourceMappingURL=LibraryItems.js.map