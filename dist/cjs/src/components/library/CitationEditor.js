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
const AnnotationRemove_1 = __importDefault(require("@manuscripts/assets/react/AnnotationRemove"));
const library_1 = require("@manuscripts/library");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CitationProperties_1 = require("./CitationProperties");
const CitationSearch_1 = require("./CitationSearch");
const CitedItem = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.secondary};
  }
`;
const CitedItemTitle = styled_components_1.default(title_editor_1.Title) ``;
const CitedItemMetadata = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.light};
  margin-top: ${(props) => props.theme.grid.unit}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const CitedItemActionLine = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
`;
const CitedItemActions = styled_components_1.default.span `
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;
const CitedItems = styled_components_1.default.div `
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  font-family: ${(props) => props.theme.font.family.sans};
  max-height: 70vh;
  min-height: 100px;
  overflow-y: auto;
`;
const ActionButton = styled_components_1.default(style_guide_1.IconButton).attrs({
    size: 24,
}) ``;
const Actions = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 4}px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const Options = styled_components_1.default.details `
  margin: ${(props) => props.theme.grid.unit * 4}px;
`;
const OptionsSummary = styled_components_1.default.summary `
  cursor: pointer;

  &:focus {
    outline: 1px solid ${(props) => props.theme.colors.border.tertiary};
  }
`;
const CitationEditor = ({ items, handleCancel, handleCite, handleClose, handleRemove, selectedText, importItems, filterLibraryItems, citation, updateCitation, }) => {
    // const [editing, setEditing] = useState<BibliographyItem>()
    const [searching, setSearching] = react_1.useState(false);
    const [optionsOpen, setOptionsOpen] = react_1.useState(false);
    const [properties, setProperties] = react_1.useState(citation);
    // if (editing) {
    //   return <div>TODO…</div>
    // }
    const saveAndClose = react_1.useCallback(() => {
        // TODO: if changed?
        updateCitation(properties)
            .then(() => handleClose())
            .catch((error) => {
            console.error(error);
        });
    }, [properties, handleClose, updateCitation]);
    if (searching) {
        return (react_1.default.createElement(CitationSearch_1.CitationSearch, { query: selectedText, filterLibraryItems: filterLibraryItems, importItems: importItems, handleCite: handleCite, handleCancel: () => setSearching(false) }));
    }
    if (!items.length) {
        return (react_1.default.createElement(CitationSearch_1.CitationSearch, { query: selectedText, filterLibraryItems: filterLibraryItems, importItems: importItems, handleCite: handleCite, handleCancel: handleCancel }));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(CitedItems, null, items.map((item) => (react_1.default.createElement(CitedItem, { key: item._id, style: {
                color: item.title === '[missing library item]' ? 'red' : 'inherit',
            } },
            react_1.default.createElement(CitedItemTitle, { value: item.title || 'Untitled' }),
            react_1.default.createElement(CitedItemActionLine, null,
                react_1.default.createElement(CitedItemMetadata, null, library_1.shortLibraryItemMetadata(item)),
                react_1.default.createElement(CitedItemActions, null,
                    react_1.default.createElement(ActionButton, { onClick: () => {
                            if (confirm('Delete this cited item?')) {
                                handleRemove(item._id);
                            }
                        } },
                        react_1.default.createElement(AnnotationRemove_1.default, null)))))))),
        react_1.default.createElement(Options, { open: optionsOpen, onToggle: (event) => setOptionsOpen(event.target.open) },
            react_1.default.createElement(OptionsSummary, null, "Options"),
            react_1.default.createElement(CitationProperties_1.CitationProperties, { properties: properties, setProperties: setProperties })),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: saveAndClose }, "Done"),
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: () => setSearching(true) }, "Add Citation")))));
};
exports.default = CitationEditor;
//# sourceMappingURL=CitationEditor.js.map