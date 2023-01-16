"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitedItemMetadata = exports.CitedItemTitle = void 0;
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
const AnnotationEdit_1 = __importDefault(require("@manuscripts/assets/react/AnnotationEdit"));
const CloseIconDark_1 = __importDefault(require("@manuscripts/assets/react/CloseIconDark"));
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const CitationModel_1 = require("./CitationModel");
const CitationSearch_1 = require("./CitationSearch");
const CitedItem = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 4}px 0;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border.secondary};
  }
`;
const textOverflow = styled_components_1.css `
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
exports.CitedItemTitle = styled_components_1.default(title_editor_1.Title) `
  ${(props) => props.withOverflow && textOverflow}
`;
exports.CitedItemMetadata = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  flex: 1;
  font-weight: ${(props) => props.theme.font.weight.light};
  margin-top: ${(props) => props.theme.grid.unit}px;
  ${textOverflow}
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

  svg.remove-icon {
    height: ${(props) => props.theme.grid.unit * 4}px;
    width: ${(props) => props.theme.grid.unit * 4}px;
  }
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
}) `
  :focus,
  :hover {
    path,
    g {
      fill: ${(props) => props.theme.colors.brand.medium} !important;
    }
  }
`;
const Actions = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 4}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CitationEditor = ({ items, modelMap, saveModel, deleteModel, handleCancel, handleCite, handleClose, handleRemove, selectedText, setCommentTarget, importItems, filterLibraryItems, citation, removeLibraryItem, setLibraryItem, updatePopper, }) => {
    const [searching, setSearching] = react_1.useState(false);
    const saveCallback = react_1.useCallback((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveModel(Object.assign(Object.assign({}, item), { objectType: manuscripts_json_schema_1.ObjectTypes.BibliographyItem }));
        setLibraryItem(item);
        updatePopper();
    }), [saveModel, setLibraryItem, updatePopper]);
    const [showEditModel, setShowEditModel] = react_1.useState(false);
    const [selectedItem, setSelectedItem] = react_1.useState();
    const referenceIdRef = react_1.useRef('');
    const onCitationEditClick = react_1.useCallback((e) => {
        const itemId = e.currentTarget.value;
        const reference = modelMap.get(itemId);
        setSelectedItem(reference);
        setShowEditModel(true);
        referenceIdRef.current = reference._id;
    }, [modelMap]);
    const deleteReferenceCallback = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (selectedItem) {
            yield deleteModel(selectedItem._id);
            removeLibraryItem(selectedItem._id);
            setSelectedItem(modelMap.get(referenceIdRef.current));
        }
    }), [selectedItem, modelMap, deleteModel, removeLibraryItem, referenceIdRef]);
    const [deleteDialog, setDeleteDialog] = react_1.useState({ show: false });
    const addCitationCallback = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        const item = manuscript_transform_1.buildBibliographyItem({
            title: 'Untitled',
            type: 'article-journal',
        });
        setSearching(false);
        setLibraryItem(item);
        setSelectedItem(item);
        setShowEditModel(true);
        yield saveModel(Object.assign(Object.assign({}, item), { objectType: manuscripts_json_schema_1.ObjectTypes.BibliographyItem }));
    }), [setLibraryItem, saveModel]);
    const addCommentCallback = react_1.useCallback(() => setCommentTarget(manuscript_transform_1.buildComment(citation._id)), [citation._id, setCommentTarget]);
    if (searching) {
        return (react_1.default.createElement(CitationSearch_1.CitationSearch, { query: selectedText, filterLibraryItems: filterLibraryItems, importItems: importItems, handleCite: handleCite, addCitation: addCitationCallback, handleCancel: () => setSearching(false) }));
    }
    if (!items.length) {
        return (react_1.default.createElement(CitationSearch_1.CitationSearch, { query: selectedText, filterLibraryItems: filterLibraryItems, importItems: importItems, handleCite: handleCite, addCitation: addCitationCallback, handleCancel: handleCancel }));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(style_guide_1.Dialog, { isOpen: deleteDialog.show, category: style_guide_1.Category.confirmation, header: "Remove cited item", message: "Are you sure you want to remove this cited item? It will still exist in the reference list.", actions: {
                secondary: {
                    action: () => {
                        if (deleteDialog.id) {
                            handleRemove(deleteDialog.id);
                            setDeleteDialog({ show: false });
                        }
                    },
                    title: 'Remove',
                },
                primary: {
                    action: () => setDeleteDialog({ show: false }),
                    title: 'Cancel',
                },
            } }),
        react_1.default.createElement(CitedItems, null, items.map((item) => (react_1.default.createElement(CitedItem, { key: item._id, style: {
                color: item.title === '[missing library item]' ? 'red' : 'inherit',
            } },
            react_1.default.createElement(exports.CitedItemTitle, { value: item.title || 'Untitled' }),
            react_1.default.createElement(CitedItemActionLine, null,
                react_1.default.createElement(exports.CitedItemMetadata, null, library_1.shortLibraryItemMetadata(item)),
                react_1.default.createElement(CitedItemActions, null,
                    react_1.default.createElement(EditCitationButton, { value: item._id, onClick: onCitationEditClick },
                        react_1.default.createElement(AnnotationEdit_1.default, { color: '#6E6E6E' })),
                    react_1.default.createElement(ActionButton, { onClick: () => setDeleteDialog({ show: true, id: item._id }) },
                        react_1.default.createElement(CloseIconDark_1.default, { className: 'remove-icon' })))))))),
        react_1.default.createElement(CitationModel_1.CitationModel, { editCitation: showEditModel, modelMap: modelMap, saveCallback: saveCallback, selectedItem: selectedItem, deleteCallback: deleteReferenceCallback, setSelectedItem: setSelectedItem, setShowEditModel: setShowEditModel, getReferences: filterLibraryItems }),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(style_guide_1.IconTextButton, { onClick: addCommentCallback },
                react_1.default.createElement(style_guide_1.AddComment, null),
                react_1.default.createElement(AddCommentButtonText, null, "Add Comment")),
            react_1.default.createElement(style_guide_1.ButtonGroup, null,
                react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: () => handleClose() }, "Done"),
                react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: () => setSearching(true) }, "Add Citation")))));
};
exports.default = CitationEditor;
const EditCitationButton = styled_components_1.default(ActionButton) `
  margin-right: ${(props) => props.theme.grid.unit * 3}px;
`;
const AddCommentButtonText = styled_components_1.default.div `
  display: contents;
  font-family: ${(props) => props.theme.font.family.sans};
  font-weight: ${(props) => props.theme.font.weight.normal};
  font-size: ${(props) => props.theme.font.size.small};
  line-height: ${(props) => props.theme.font.lineHeight.large};
  color: ${(props) => props.theme.colors.text.primary};
`;
//# sourceMappingURL=CitationEditor.js.map