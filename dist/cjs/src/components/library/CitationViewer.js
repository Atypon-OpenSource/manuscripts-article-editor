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
exports.CitationViewer = void 0;
const library_1 = require("@manuscripts/library");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CitedItem = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px 0;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
  }
`;
const CitedItemTitle = styled_components_1.default(title_editor_1.Title) ``;
const CitedItemAuthors = styled_components_1.default.div `
  margin-top: ${(props) => props.theme.grid.unit}px;
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const CitedItems = styled_components_1.default.div `
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  font-family: ${(props) => props.theme.font.family.sans};
  max-height: 70vh;
  overflow-y: auto;
`;
const CitationViewer = ({ items }) => (react_1.default.createElement(CitedItems, null, items.map((item) => (react_1.default.createElement(CitedItem, { key: item._id, onClick: () => {
        if (item.DOI) {
            window.open(`https://doi.org/${item.DOI}`);
        }
    } },
    react_1.default.createElement(CitedItemTitle, { value: item.title || 'Untitled' }),
    react_1.default.createElement(CitedItemAuthors, null, library_1.shortLibraryItemMetadata(item)))))));
exports.CitationViewer = CitationViewer;
//# sourceMappingURL=CitationViewer.js.map