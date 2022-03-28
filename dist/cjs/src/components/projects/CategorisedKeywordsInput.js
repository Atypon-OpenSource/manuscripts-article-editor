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
exports.CategorisedKeywordsInput = void 0;
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
const AddIcon_1 = __importDefault(require("@manuscripts/assets/react/AddIcon"));
const AnnotationRemove_1 = __importDefault(require("@manuscripts/assets/react/AnnotationRemove"));
const Artboard_1 = __importDefault(require("@manuscripts/assets/react/Artboard"));
const CloseIconDark_1 = __importDefault(require("@manuscripts/assets/react/CloseIconDark"));
const ToolbarIconHighlight_1 = __importDefault(require("@manuscripts/assets/react/ToolbarIconHighlight"));
const VerticalEllipsis_1 = __importDefault(require("@manuscripts/assets/react/VerticalEllipsis"));
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_popper_1 = require("react-popper");
const creatable_1 = __importDefault(require("react-select/creatable"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_synced_data_1 = require("../../hooks/use-synced-data");
const select_styles_1 = require("../../lib/select-styles");
const store_1 = require("../../store");
const inputs_1 = require("./inputs");
const StatusIcons_1 = require("./Status/StatusIcons");
const TagsInput_1 = require("./TagsInput");
const OptionLabel = styled_components_1.default.div `
  width: fit-content;
  font-size: ${(props) => props.theme.font.size.normal};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  border-radius: 6px;
`;
const KeywordButton = styled_components_1.default.button `
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  position: relative;
  color: #545454;
  padding: 8px 0;
  margin-bottom: 2px;
  cursor: pointer;
  svg {
    margin-right: 6px;
  }
`;
const KeywordDeleteButton = styled_components_1.default(KeywordButton) `
  color: #f35143;
  path {
    fill: #f35143;
  }
`;
const Separator = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 2}px 0
    ${(props) => props.theme.grid.unit * 2}px 0;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  height: 1px;
`;
const LabelContainer = styled_components_1.default.div `
  display: flex;
  align-items: ${(props) => (props.isCreate && 'center') || 'flex-start'};
  ${(props) => !props.isCreate && 'flex-flow: column'};
`;
const KeywordCategory = styled_components_1.default.div `
  color: #6e6e6e;
  font-size: 10px;
  padding: 0 ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
`;
const EditKeyword = styled_components_1.default(style_guide_1.IconButton) `
  height: ${(props) => props.theme.grid.unit * 4}px;
  border: none;
  svg {
    height: ${(props) => props.theme.grid.unit * 4}px;

    g {
      fill: none;
    }
  }
  &:hover {
    g {
      fill: ${(props) => props.theme.colors.brand.medium};
    }
  }
  ${(props) => props.focused && 'g { fill: #1a9bc7 !important; }'};
`;
const CategoryInput = styled_components_1.default.input `
  border-radius: 6px;
  background: #f2fbfc;
  border: 1px solid #bce7f6;
  margin-left: 14px;
  padding: 3px 6px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:disabled {
    border: none;
    background: transparent;
  }
`;
const CategoryEditButton = styled_components_1.default.button `
  border: none;
  background: transparent;
  &:hover {
    background: #f2fbfc;
  }
  path {
    fill: #6e6e6e;
    stroke: #6e6e6e;
  }
`;
const CategoryEditWrapper = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  margin: 0 -16px;
  position: relative;
  cursor: pointer;
  &:hover {
    background: #f2fbfc;
  }
`;
const Tick = styled_components_1.default(Artboard_1.default) `
  min-width: 13px;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  path:first-child {
    fill: transparent;
  }
  path {
    fill: grey;
  }
`;
const KeywordField = styled_components_1.default(inputs_1.MediumTextField) `
  margin-bottom: 16px;
`;
const CategorisedKeywordsInput = ({ target }) => {
    const [{ modelMap, saveModel, deleteModel }] = store_1.useStore((store) => ({
        modelMap: store.modelMap,
        saveModel: store.saveModel,
        deleteModel: store.deleteModel,
    }));
    const [keywordToEdit, setKeywordToEdit] = react_1.useState();
    const [isOpen, setOpen] = react_1.useState(false);
    const nodeRef = react_1.useRef(null);
    const keywords = [];
    const categories = {};
    for (const model of modelMap.values()) {
        if (model._id.startsWith('MPKeyword:')) {
            keywords.push(model);
        }
        if (model._id.startsWith('MPKeywordGroup:')) {
            const group = model;
            if (group.title) {
                const categoryName = group.title.trim().replace(/:/i, '');
                categories[categoryName] = group;
            }
        }
    }
    const getCategoryTitleById = (id) => {
        const cat = Object.entries(categories).find(([, keywordsGroup]) => keywordsGroup._id === id);
        return cat && cat[0] ? cat[0] : '';
    };
    const handleClickOutside = react_1.useCallback((event) => __awaiter(void 0, void 0, void 0, function* () {
        if (nodeRef.current &&
            !event.target.classList.contains('VerticalEllipsis') &&
            !nodeRef.current.contains(event.target) &&
            !isOpen) {
            setKeywordToEdit(undefined);
        }
    }), [isOpen]);
    react_1.useEffect(() => {
        if (keywordToEdit) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside, keywordToEdit]);
    const editKeyword = react_1.useCallback((event, tag) => {
        event.stopPropagation();
        setKeywordToEdit(tag);
    }, [setKeywordToEdit]);
    const setCatForKeyword = (keyword, category) => {
        const newKeyword = Object.assign(Object.assign({}, keyword), { containedGroup: category._id });
        saveModel(newKeyword);
        return newKeyword;
    };
    const addCategory = (title) => __awaiter(void 0, void 0, void 0, function* () {
        if (!Object.keys(categories).includes(title)) {
            const category = yield saveModel(manuscript_transform_1.buildKeywordGroup({ title, type: 'author' }));
            if (keywordToEdit) {
                const keyword = setCatForKeyword(keywordToEdit, category);
                setKeywordToEdit(keyword);
            }
        }
    });
    const deleteCategory = (id) => {
        keywords.map((tag) => {
            if (tag.containedGroup === id) {
                saveModel(Object.assign(Object.assign({}, tag), { containedGroup: undefined }));
            }
        });
        deleteModel(id);
    };
    const deleteKeyword = (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteModel(id); // why async/await here? a mystery to me but it doesn seesm to work w/o it
        // remove the model
        yield saveModel(Object.assign(Object.assign({}, target), { keywordIDs: keywordIDs.filter((kid) => kid !== id) }));
    });
    const changeTitle = (category, title) => {
        saveModel(Object.assign(Object.assign({}, category), { title }));
    };
    const keywordIDs = target.keywordIDs || [];
    const options = keywords.filter((keyword) => !keywordIDs.includes(keyword._id));
    const optionIndex = (keyword) => {
        return options
            .map((keyword) => {
            return keyword._id;
        })
            .indexOf(keyword._id);
    };
    const OptionComponent = ({ innerRef, innerProps, children, data, }) => {
        const isCreate = data.name.startsWith('Create keyword');
        const category = getCategoryTitleById(data.containedGroup);
        return (react_1.default.createElement(TagsInput_1.OptionWrapper, Object.assign({ focused: keywordToEdit ? data._id === keywordToEdit._id : false, ref: innerRef }, innerProps),
            react_1.default.createElement(LabelContainer, { isCreate: isCreate },
                isCreate && react_1.default.createElement(StatusIcons_1.PlusIcon, null),
                react_1.default.createElement(OptionLabel, null, children),
                category && react_1.default.createElement(KeywordCategory, null, category)),
            !isCreate && (react_1.default.createElement(EditKeyword, { onClick: (event) => editKeyword(event, data), className: "VerticalEllipsis", focused: keywordToEdit ? data._id === keywordToEdit._id : false },
                react_1.default.createElement(VerticalEllipsis_1.default, null)))));
    };
    return (react_1.default.createElement(react_popper_1.Manager, null,
        react_1.default.createElement(TagsInput_1.OuterContainer, null,
            react_1.default.createElement(creatable_1.default, { getNewOptionData: (inputValue) => {
                    const option = {
                        name: `Create keyword "${inputValue}"`,
                    };
                    return option;
                }, onCreateOption: (inputValue) => __awaiter(void 0, void 0, void 0, function* () {
                    const keyword = manuscript_transform_1.buildKeyword(inputValue);
                    yield saveModel(Object.assign(Object.assign({}, target), { keywordIDs: [...keywordIDs, keyword._id] }));
                    yield saveModel(keyword);
                }), options: keywords, isOptionDisabled: (option) => {
                    const isCreate = option.name.startsWith('Create keyword')
                        ? true
                        : false;
                    return !isCreate;
                }, placeholder: 'Add new or edit existing...', getOptionValue: (option) => option._id, getOptionLabel: (option) => option.name, styles: Object.assign(Object.assign({}, select_styles_1.selectStyles), { multiValueLabel: () => ({
                        paddingRight: 2,
                        alignItems: 'center',
                        display: 'flex',
                    }), multiValue: (base, { data }) => (Object.assign(Object.assign({}, base), { backgroundColor: '#F2F2F2', color: '#F2F2F2', alignItems: 'center', paddingRight: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 4, borderRadius: 6 })), multiValueRemove: (base, { data }) => ({
                        color: '#ffffff',
                        borderRadius: '50%',
                        height: 14,
                        width: 14,
                        cursor: 'pointer',
                    }), menu: (base) => (Object.assign(Object.assign({}, base), { boxShadow: '0 10px 17px 0 rgba(84,83,83,0.3)', borderRadius: 8 })), menuList: (base) => (Object.assign(Object.assign({}, base), { paddingBottom: 8, paddingTop: 8 })) }), menuPortalTarget: document.body, menuIsOpen: keywordToEdit ? true : undefined, components: { Option: OptionComponent } }),
            keywordToEdit && (react_1.default.createElement(TagsInput_1.Container, { ref: nodeRef },
                react_1.default.createElement(react_popper_1.Popper, null, ({ ref, placement }) => (react_1.default.createElement("div", { ref: ref, style: {
                        zIndex: 100,
                        position: 'absolute',
                        bottom: '100%',
                        right: '0',
                        marginBottom: -40 * optionIndex(keywordToEdit),
                    }, "data-placement": placement },
                    react_1.default.createElement(TagsInput_1.EditingPopper, null,
                        react_1.default.createElement(TagNameInput, { value: keywordToEdit.name, handleChange: (name) => __awaiter(void 0, void 0, void 0, function* () {
                                const keyword = yield saveModel(Object.assign(Object.assign({}, keywordToEdit), { name }));
                                setKeywordToEdit(keyword);
                            }) }),
                        react_1.default.createElement(Separator, null),
                        react_1.default.createElement(EditKeywordCat, { tag: keywordToEdit, categories: categories, setTag: setKeywordToEdit, setCatForKeyword: setCatForKeyword, changeTitle: changeTitle, deleteCategory: deleteCategory, deleteKeyword: deleteKeyword, addCategory: addCategory, closeEdit: () => {
                                setKeywordToEdit(undefined);
                            }, isOpen: isOpen, setOpen: setOpen }))))))))));
};
exports.CategorisedKeywordsInput = CategorisedKeywordsInput;
const TagNameInput = ({ value, handleChange }) => {
    const [currentValue, handleLocalChange] = use_synced_data_1.useSyncedData(value, handleChange, 500);
    const handleInputChange = react_1.useCallback((event) => {
        handleLocalChange(event.target.value);
    }, [handleLocalChange]);
    return (react_1.default.createElement(KeywordField, { value: currentValue, onChange: handleInputChange, autoFocus: true }));
};
const NewCategoryInput = ({ addCategory, onCancel }) => {
    const [inputValue, setInputValue] = react_1.useState('');
    return (react_1.default.createElement(CategoryEditWrapper, null,
        react_1.default.createElement(CategoryInput, { type: "text", value: inputValue, placeholder: "New Category...", onChange: (e) => setInputValue(e.target.value), onKeyDown: (e) => {
                if (e.key == 'Enter') {
                    addCategory(inputValue);
                    onCancel();
                }
            }, onBlur: onCancel }),
        react_1.default.createElement(CategoryEditButton, { onClick: () => onCancel() },
            react_1.default.createElement(CloseIconDark_1.default, { height: 10, width: 10 }))));
};
const EditCategoryTitle = ({ category, name, changeTitle, deleteCategory, setCatForKeyword, current, }) => {
    const [inputValue, setInputValue] = react_1.useState(name);
    const [inputEnabled, toggleEnabled] = react_1.useState(false);
    const completeEdit = () => {
        changeTitle(category, inputValue);
        toggleEnabled(false);
    };
    return (react_1.default.createElement(CategoryEditWrapper, { onClick: () => {
            if (!inputEnabled) {
                setCatForKeyword();
            }
        } },
        current && react_1.default.createElement(Tick, null),
        react_1.default.createElement(CategoryInput, { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: (e) => {
                if (e.key == 'Enter') {
                    completeEdit();
                }
            }, onBlur: completeEdit, disabled: !inputEnabled }),
        !inputEnabled ? (react_1.default.createElement(CategoryEditButton, { onClick: () => toggleEnabled(true) },
            react_1.default.createElement(ToolbarIconHighlight_1.default, { height: 12, width: 12 }))) : (react_1.default.createElement(CategoryEditButton, { onClick: () => deleteCategory(category._id) },
            react_1.default.createElement(CloseIconDark_1.default, { height: 10, width: 10 })))));
};
const EditKeywordCat = ({ tag, categories, isOpen, setCatForKeyword, deleteCategory, changeTitle, deleteKeyword, addCategory, closeEdit, setTag, setOpen, }) => {
    const [inputEnabled, toggleEnabled] = react_1.useState(false);
    const actions = {
        primary: {
            action: () => {
                setOpen(false);
                closeEdit();
            },
            title: 'Cancel',
        },
        secondary: {
            action: () => {
                deleteKeyword(tag._id);
                setOpen(false);
                closeEdit();
            },
            title: 'Remove',
        },
    };
    return (react_1.default.createElement("div", null,
        Object.entries(categories).map(([name, cat]) => (react_1.default.createElement(EditCategoryTitle, { key: name, category: cat, name: name, current: tag.containedGroup === cat._id, setCatForKeyword: () => {
                const newTag = setCatForKeyword(tag, cat);
                setTag(newTag);
            }, deleteCategory: deleteCategory, changeTitle: changeTitle }))),
        inputEnabled ? (react_1.default.createElement(NewCategoryInput, { addCategory: addCategory, onCancel: () => toggleEnabled(false) })) : (react_1.default.createElement(KeywordButton, { onClick: () => toggleEnabled(true), type: 'button' },
            react_1.default.createElement(AddIcon_1.default, { width: 16, height: 16 }),
            react_1.default.createElement("span", null, "New Category"))),
        react_1.default.createElement(Separator, null),
        react_1.default.createElement(KeywordDeleteButton, { type: 'button', onClick: () => {
                setOpen(true);
            } },
            react_1.default.createElement(AnnotationRemove_1.default, { fill: '#F35143', width: 16, height: 16 }),
            react_1.default.createElement("span", null, "Delete Keyword")),
        isOpen && (react_1.default.createElement(style_guide_1.Dialog, { isOpen: isOpen, actions: actions, category: style_guide_1.Category.confirmation, header: 'Remove keyword', message: `Are you sure you want to remove ${tag.name} from the keywords list?` }))));
};
//# sourceMappingURL=CategorisedKeywordsInput.js.map