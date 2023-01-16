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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fieldset = exports.Container = exports.Label = exports.Fields = exports.Legend = exports.CitationModel = void 0;
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
const ReferenceLibraryIcon_1 = __importDefault(require("@manuscripts/assets/react/ReferenceLibraryIcon"));
const library_1 = require("@manuscripts/library");
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const lodash_es_1 = require("lodash-es");
const react_1 = __importStar(require("react"));
const react_tooltip_1 = __importDefault(require("react-tooltip"));
const styled_components_1 = __importStar(require("styled-components"));
const AuthorsModals_1 = require("../metadata/AuthorsModals");
const GroupIcon_1 = require("../projects/lean-workflow/icons/GroupIcon");
const Sidebar_1 = require("../Sidebar");
const CitationEditor_1 = require("./CitationEditor");
const ReferenceForm_1 = __importStar(require("./ReferenceForm"));
const CitationModel = ({ editCitation, modelMap, saveCallback, selectedItem, setSelectedItem, setShowEditModel, deleteCallback, getReferences, }) => {
    const stopEditing = react_1.useCallback(() => setShowEditModel(false), [
        setShowEditModel,
    ]);
    const formMikRef = react_1.useRef(null);
    const [{ referenceCount, references }, setReferences] = react_1.useState({
        referenceCount: new Map(),
        references: [],
    });
    const [showPendingChangeDialog, setShowPendingChangeDialog] = react_1.useState(false);
    const onSelectReference = react_1.useCallback((e) => {
        var _a;
        const other = (_a = formMikRef.current) === null || _a === void 0 ? void 0 : _a.values;
        if (!selectedItem || lodash_es_1.isEqual(ReferenceForm_1.buildInitialValues(selectedItem), other)) {
            setSelectedItem(references.find(({ _id }) => _id === e.currentTarget.id));
        }
        else {
            setShowPendingChangeDialog(true);
        }
    }, [references, selectedItem, setSelectedItem]);
    react_1.useEffect(() => {
        if (editCitation) {
            getReferences(undefined)
                .then((references) => {
                const referenceCount = new Map();
                manuscript_transform_1.getModelsByType(modelMap, manuscripts_json_schema_1.ObjectTypes.Citation).map(({ embeddedCitationItems }) => embeddedCitationItems.map(({ bibliographyItem }) => {
                    let value = referenceCount.get(bibliographyItem);
                    referenceCount.set(bibliographyItem, (value && ++value) || 1);
                }));
                setReferences({ references, referenceCount });
            })
                .catch((e) => console.error(e));
        }
    }, [editCitation, getReferences, modelMap]);
    const modelDeleteCallback = react_1.useCallback(() => {
        deleteCallback();
        setReferences({
            referenceCount,
            references: [
                ...references.filter(({ _id }) => _id !== (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem._id)),
            ],
        });
    }, [deleteCallback, referenceCount, references, selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem._id]);
    const modelSaveCallback = react_1.useCallback((item) => {
        saveCallback(item);
        setSelectedItem(item);
        setReferences({
            referenceCount,
            references: [
                ...references.map((ref) => (ref._id === (item === null || item === void 0 ? void 0 : item._id) ? item : ref)),
            ],
        });
    }, [referenceCount, references, saveCallback, setSelectedItem]);
    const disableDelete = (((selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem._id) && referenceCount.get(selectedItem._id)) || 0) > 0;
    if (references.length < 1) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    return (react_1.default.createElement(style_guide_1.StyledModal, { isOpen: editCitation, onRequestClose: stopEditing, shouldCloseOnOverlayClick: true },
        react_1.default.createElement(style_guide_1.Dialog, { isOpen: showPendingChangeDialog, category: style_guide_1.Category.confirmation, header: "You've made changes to this option", message: "Would you like to save or discard your changes?", actions: {
                secondary: {
                    action: () => {
                        var _a;
                        (_a = formMikRef.current) === null || _a === void 0 ? void 0 : _a.resetForm();
                        setShowPendingChangeDialog(false);
                    },
                    title: 'Discard',
                },
                primary: {
                    action: () => {
                        var _a;
                        modelSaveCallback((_a = formMikRef.current) === null || _a === void 0 ? void 0 : _a.values);
                        setShowPendingChangeDialog(false);
                    },
                    title: 'Save',
                },
            } }),
        react_1.default.createElement(style_guide_1.ModalContainer, null,
            react_1.default.createElement(style_guide_1.ModalHeader, null,
                react_1.default.createElement(style_guide_1.CloseButton, { onClick: stopEditing })),
            react_1.default.createElement(Sidebar_1.ModalBody, null,
                react_1.default.createElement(ReferencesSidebar, null,
                    react_1.default.createElement(Sidebar_1.SidebarHeader, { title: 'References' }),
                    react_1.default.createElement(ReferencesSidebarContent, null, references.map((item, index) => (react_1.default.createElement(ReferenceButton, { key: index, id: item._id, onClick: onSelectReference, selected: (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem._id) === item._id },
                        react_1.default.createElement(IconContainer, { "data-tip": true, "data-for": 'group-icon' },
                            react_1.default.createElement(ReferenceLibraryIcon_1.default, null),
                            react_1.default.createElement(GroupIcon_1.GroupIcon, { numberOfCitations: referenceCount.get(item._id) || 0 }),
                            react_1.default.createElement(react_tooltip_1.default, { disable: (referenceCount.get(item._id) || 0) < 1, id: 'group-icon', place: "bottom", effect: "solid", offset: { top: 40 }, className: "tooltip" }, "Number of times used in the document")),
                        react_1.default.createElement(Grid, null,
                            react_1.default.createElement(CitationEditor_1.CitedItemTitle, { value: item.title || 'Untitled', withOverflow: true }),
                            react_1.default.createElement(CitationEditor_1.CitedItemMetadata, null, library_1.shortLibraryItemMetadata(item)))))))),
                react_1.default.createElement(AuthorsModals_1.ScrollableModalMain, null, selectedItem && (react_1.default.createElement(ReferenceForm_1.default, { item: selectedItem, formMikRef: formMikRef, disableDelete: disableDelete, deleteCallback: modelDeleteCallback, handleCancel: stopEditing, saveCallback: modelSaveCallback })))))));
};
exports.CitationModel = CitationModel;
const ReferencesSidebar = styled_components_1.default(Sidebar_1.ModalSidebar) `
  width: 70%;
`;
const ReferencesSidebarContent = styled_components_1.default(Sidebar_1.SidebarContent) `
  overflow-y: hidden;
`;
const Grid = styled_components_1.default.div `
  display: grid;
`;
exports.Legend = styled_components_1.default.legend `
  font: ${(props) => props.theme.font.weight.normal}
    ${(props) => props.theme.font.size.xlarge} /
    ${(props) => props.theme.font.lineHeight.large}
    ${(props) => props.theme.font.family.sans};
  letter-spacing: -0.4px;
  color: ${(props) => props.theme.colors.text.secondary};
`;
exports.Fields = styled_components_1.default.div `
  padding: 16px;
`;
exports.Label = styled_components_1.default.label `
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;
exports.Container = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
`;
exports.Fieldset = styled_components_1.default.fieldset `
  border: none;

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;
const selectedReferenceStyle = styled_components_1.css `
  background: ${(props) => props.theme.colors.background.info};
  border-top: 1px solid #bce7f6;
  border-bottom: 1px solid #bce7f6;
`;
const ReferenceButton = styled_components_1.default.div `
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  padding: ${(props) => props.theme.grid.unit * 4}px 0;

  path {
    fill: #c9c9c9;
  }

  :hover {
    background: ${(props) => props.theme.colors.background.info};
  }

  ${(props) => props.selected && selectedReferenceStyle}

  .tooltip {
    max-width: ${(props) => props.theme.grid.unit * 25}px;
    padding: ${(props) => props.theme.grid.unit * 2}px;
    border-radius: 6px;
  }
`;
const IconContainer = styled_components_1.default.div `
  padding-right: ${(props) => props.theme.grid.unit * 5}px;
  position: relative;
`;
//# sourceMappingURL=CitationModel.js.map