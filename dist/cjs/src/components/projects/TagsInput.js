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
exports.TagsInput = exports.EditingPopper = exports.Container = exports.OuterContainer = exports.OptionWrapper = void 0;
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
const VerticalEllipsis_1 = __importDefault(require("@manuscripts/assets/react/VerticalEllipsis"));
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_color_1 = require("react-color");
const react_popper_1 = require("react-popper");
const creatable_1 = __importDefault(require("react-select/creatable"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_synced_data_1 = require("../../hooks/use-synced-data");
const colors_1 = require("../../lib/colors");
const select_styles_1 = require("../../lib/select-styles");
const sort_1 = require("../../lib/sort");
const store_1 = require("../../store");
const Updates_1 = require("../nav/Updates");
const inputs_1 = require("./inputs");
const StatusIcons_1 = require("./Status/StatusIcons");
const ColorPopper = styled_components_1.default(Updates_1.Popup) `
  z-index: 10;
  position: absolute;
  right: 50%;
  width: fit-content;
  max-width: 200px;
  min-width: 140px;
  height: fit-content;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
exports.OptionWrapper = styled_components_1.default.div `
  padding-left: ${(props) => props.theme.grid.unit * 4}px;
  padding-top: ${(props) => props.theme.grid.unit * 2}px;
  padding-bottom: ${(props) => props.theme.grid.unit * 2}px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${(props) => props.focused ? props.theme.colors.background.fifth : 'transparent'};

  &:hover {
    background-color: ${(props) => props.theme.colors.background.fifth};
    g {
      fill: ${(props) => props.theme.colors.text.secondary};
    }
  }
`;
const OptionLabel = styled_components_1.default.div `
  background-color: ${(props) => props.backgroundColor};
  width: fit-content;
  font-size: ${(props) => props.theme.font.size.normal};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  border-radius: 6px;
  color: ${(props) => props.textColor};
`;
exports.OuterContainer = styled_components_1.default.div `
  width: 100%;
`;
exports.Container = styled_components_1.default.div `
  position: relative;
`;
const ColorButton = styled_components_1.default.button `
  background: ${(props) => props.color};
  box-shadow: ${(props) => (props.isActive ? '0 0 1px 1px #BCE7F6' : 'none')};
  height: ${(props) => props.theme.grid.unit * 6}px;
  width: ${(props) => props.theme.grid.unit * 6}px;
  border-radius: 50%;
  margin: 4px 2px;
  padding: 0;
  border: 1px solid ${(props) => props.theme.colors.border.tertiary};
  cursor: pointer;
  flex-shrink: 0;

  ${(props) => props.isActive && 'border: 1px solid white;'};

  &:hover {
    ${(props) => !props.isActive && `border: 1px solid #F2FBFC`};
  }

  &:focus {
    outline: none;
  }
`;
// const DeleteButton = styled(IconTextButton)`
//   color: ${props => props.theme.colors.text.error};
//   font-size: ${props => props.theme.font.size.normal};
// `
const AddColorButton = styled_components_1.default(ColorButton) `
  background: transparent;
  border: 1px dashed #e2e2e2;
  position: relative;

  ::before,
  ::after {
    background-color: #e2e2e2;
    border-radius: 2px;
    content: ' ';
    display: block;
    height: 14px;
    transform: rotate(90deg);
    width: 2px;
    position: absolute;
    top: calc(50% - 7px);
    left: calc(50% - 1px);
  }
  ::after {
    transform: rotate(180deg);
  }

  &:hover {
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    background: ${(props) => props.theme.colors.background.fifth};

    ::before,
    ::after {
      background-color: #1a9bc7 !important;
    }
  }
`;
const Actions = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PopperContent = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  padding: ${(props) => props.theme.grid.unit * 2}px;

  .chrome-picker {
    box-shadow: none !important;
    width: unset !important;
  }
`;
exports.EditingPopper = styled_components_1.default(PopperContent) `
  width: fit-content;
  max-width: 200px;
  min-width: 140px;
  height: fit-content;
  padding: ${(props) => props.theme.grid.unit * 4}px;
`;
const Separator = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  height: 1px;
`;
const LabelContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const EditTag = styled_components_1.default(style_guide_1.IconButton) `
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
const TagsInput = ({ target }) => {
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    const [tags] = store_1.useStore((store) => store.tags || []);
    const [modelMap] = store_1.useStore((store) => store.modelMap);
    const [createdTag, setCreatedTag] = react_1.useState();
    const [openPicker, setOpen] = react_1.useState(false);
    const [pickedColor, setColor] = react_1.useState('#ffffff');
    const [tagToEdit, setTagToEdit] = react_1.useState();
    const nodeRef = react_1.useRef(null);
    const handleClickOutside = react_1.useCallback((event) => __awaiter(void 0, void 0, void 0, function* () {
        if (nodeRef.current &&
            !event.target.className.includes('VerticalEllipsis') &&
            !nodeRef.current.contains(event.target)) {
            setTagToEdit(undefined);
            setOpen(false);
            setColor('#ffffff');
        }
    }), []);
    react_1.useEffect(() => {
        if (tagToEdit) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside, tagToEdit]);
    const editTag = react_1.useCallback((event, tag) => {
        event.stopPropagation();
        setTagToEdit(tag);
    }, [setTagToEdit]);
    const handleColorChange = react_1.useCallback((color) => {
        setColor(color.hex);
    }, [setColor]);
    const { colors, colorScheme } = colors_1.buildColors(modelMap, 'MPColorScheme:tags');
    const handleAddColor = react_1.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!colorScheme) {
            return null;
        }
        if (pickedColor) {
            for (const color of colors) {
                if (color.value === pickedColor) {
                    return null;
                }
            }
            const color = manuscript_transform_1.buildColor(pickedColor, colors_1.nextColorPriority(colors));
            yield saveModel(Object.assign(Object.assign({}, color), { prototype: color._id }));
            yield saveModel(Object.assign(Object.assign({}, colorScheme), { colors: [...(colorScheme.colors || []), color._id] }));
        }
        setOpen(false);
        setColor('#ffffff');
    }), [colorScheme, colors, pickedColor, saveModel]);
    if (!colorScheme) {
        return null;
    }
    const colorsMap = new Map();
    for (const color of colors) {
        colorsMap.set(color._id, color);
    }
    const keywordIDs = target.keywordIDs || [];
    const targetTags = tags.filter((tag) => keywordIDs.includes(tag._id));
    const ordered = targetTags.sort(sort_1.ascendingPriority);
    const options = tags.filter((tag) => !keywordIDs.includes(tag._id));
    const optionIndex = (tag) => {
        return options
            .map((tag) => {
            return tag._id;
        })
            .indexOf(tag._id);
    };
    const OptionComponent = ({ innerRef, innerProps, children, data, }) => {
        const isCreate = data.name.startsWith('Create tag');
        const backgroundColor = colorsMap.get(data.color)
            ? colorsMap.get(data.color).value
            : isCreate
                ? 'unset'
                : '#F2F2F2';
        const color = isCreate ? '#000000' : textColor(backgroundColor);
        return (react_1.default.createElement(exports.OptionWrapper, Object.assign({ focused: tagToEdit ? data._id === tagToEdit._id : false, ref: innerRef }, innerProps),
            react_1.default.createElement(LabelContainer, null,
                isCreate && react_1.default.createElement(StatusIcons_1.PlusIcon, null),
                react_1.default.createElement(OptionLabel, { backgroundColor: backgroundColor, textColor: color }, children)),
            !isCreate && (react_1.default.createElement(EditTag, { onClick: (event) => editTag(event, data), className: "VerticalEllipsis", focused: tagToEdit ? data._id === tagToEdit._id : false },
                react_1.default.createElement(VerticalEllipsis_1.default, null)))));
    };
    const removeBackgroundColor = (data) => {
        return textColor(colorsMap.get(data.color) ? colorsMap.get(data.color).value : '#F2F2F2') === '#ffffff'
            ? '#ffffff'
            : '#6E6E6E';
    };
    return (react_1.default.createElement(react_popper_1.Manager, null,
        react_1.default.createElement(exports.OuterContainer, null,
            react_1.default.createElement(creatable_1.default, { getNewOptionData: (inputValue) => {
                    const option = {
                        name: `Create tag for "${inputValue}"`,
                    };
                    return option;
                }, onCreateOption: (inputValue) => __awaiter(void 0, void 0, void 0, function* () {
                    const tag = {
                        _id: manuscript_transform_1.generateID(manuscripts_json_schema_1.ObjectTypes.Tag),
                        objectType: manuscripts_json_schema_1.ObjectTypes.Tag,
                        name: inputValue,
                        priority: tags.length,
                    };
                    const createdTag = yield saveModel(tag);
                    yield saveModel(Object.assign(Object.assign({}, target), { keywordIDs: [...keywordIDs, tag._id] }));
                    setCreatedTag(createdTag);
                }), options: tags, value: ordered, getOptionValue: (option) => option._id, getOptionLabel: (option) => option.name, onMenuOpen: () => setCreatedTag(undefined), onChange: (tags) => __awaiter(void 0, void 0, void 0, function* () {
                    yield saveModel(Object.assign(Object.assign({}, target), { keywordIDs: tags ? tags.map((tag) => tag._id) : [] }));
                }), styles: Object.assign(Object.assign({}, select_styles_1.selectStyles), { multiValueLabel: () => ({
                        paddingRight: 2,
                        alignItems: 'center',
                        display: 'flex',
                    }), multiValue: (base, { data }) => {
                        var _a, _b;
                        return (Object.assign(Object.assign({}, base), { backgroundColor: ((_a = colorsMap.get(data.color || '')) === null || _a === void 0 ? void 0 : _a.value) || '#F2F2F2', color: textColor(((_b = colorsMap.get(data.color || '')) === null || _b === void 0 ? void 0 : _b.value) || '#F2F2F2'), alignItems: 'center', paddingRight: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 4, borderRadius: 6 }));
                    }, multiValueRemove: (base, { data }) => ({
                        backgroundColor: removeBackgroundColor(data),
                        color: removeBackgroundColor(data) === '#ffffff'
                            ? '#6E6E6E'
                            : '#ffffff',
                        borderRadius: '50%',
                        height: 14,
                        width: 14,
                        cursor: 'pointer',
                    }), menu: (base) => (Object.assign(Object.assign({}, base), { boxShadow: '0 10px 17px 0 rgba(84,83,83,0.3)', borderRadius: 8 })), menuList: (base) => (Object.assign(Object.assign({}, base), { paddingBottom: 8, paddingTop: 8 })) }), menuPortalTarget: document.body, menuIsOpen: tagToEdit ? true : undefined, components: { Option: OptionComponent } }),
            createdTag && (react_1.default.createElement(exports.Container, null,
                react_1.default.createElement(react_popper_1.Popper, { placement: 'bottom' }, ({ ref, placement }) => (react_1.default.createElement("div", { ref: ref, "data-placement": placement },
                    react_1.default.createElement(ColorPopper, null,
                        react_1.default.createElement(EditColor, { tag: createdTag, colors: colors, setTag: setCreatedTag, saveModel: saveModel, openPicker: setOpen }))))),
                openPicker && (react_1.default.createElement("div", { style: {
                        zIndex: 10,
                        position: 'absolute',
                        right: '50%',
                    } },
                    react_1.default.createElement(ColorPicker, { pickedColor: pickedColor, handleAddColor: handleAddColor, handleColorChange: handleColorChange, handleCancel: setOpen }))))),
            tagToEdit && (react_1.default.createElement(exports.Container, { ref: nodeRef },
                react_1.default.createElement(react_popper_1.Popper, null, ({ ref, placement }) => (react_1.default.createElement("div", { ref: ref, style: {
                        zIndex: 100,
                        position: 'absolute',
                        bottom: '100%',
                        right: '0',
                        marginBottom: -40 * optionIndex(tagToEdit),
                    }, "data-placement": placement },
                    react_1.default.createElement(exports.EditingPopper, null,
                        react_1.default.createElement(TagNameInput, { value: tagToEdit.name, handleChange: (name) => __awaiter(void 0, void 0, void 0, function* () {
                                const tag = yield saveModel(Object.assign(Object.assign({}, tagToEdit), { name }));
                                setTagToEdit(tag);
                            }) }),
                        react_1.default.createElement(Separator, null),
                        react_1.default.createElement(EditColor, { tag: tagToEdit, colors: colors, setTag: setTagToEdit, saveModel: saveModel, openPicker: setOpen }),
                        react_1.default.createElement(Separator, null))))),
                openPicker && (react_1.default.createElement("div", { style: {
                        zIndex: 100,
                        position: 'absolute',
                        bottom: '100%',
                        right: '0',
                        marginBottom: -40 * optionIndex(tagToEdit),
                    } },
                    react_1.default.createElement(ColorPicker, { pickedColor: pickedColor, handleAddColor: handleAddColor, handleColorChange: handleColorChange, handleCancel: setOpen }))))))));
};
exports.TagsInput = TagsInput;
const TagNameInput = ({ value, handleChange }) => {
    const [currentValue, handleLocalChange] = use_synced_data_1.useSyncedData(value, handleChange, 500);
    const handleInputChange = react_1.useCallback((event) => {
        handleLocalChange(event.target.value);
    }, [handleLocalChange]);
    return (react_1.default.createElement(inputs_1.MediumTextField, { value: currentValue, onChange: handleInputChange, autoFocus: true }));
};
const EditColor = ({ tag, colors, setTag, saveModel, openPicker }) => {
    return (react_1.default.createElement("div", null,
        colors.map((color) => (react_1.default.createElement(ColorButton, { key: color._id, type: 'button', color: color.value, isActive: tag.color === color._id ||
                (tag.color === undefined && color.value === '#E2E2E2'), onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                yield saveModel(Object.assign(Object.assign({}, tag), { color: color._id }));
                setTag(undefined);
            }) }))),
        react_1.default.createElement(AddColorButton, { type: 'button', isActive: false, onClick: () => openPicker(true) })));
};
const ColorPicker = ({ pickedColor, handleColorChange, handleAddColor, handleCancel }) => {
    return (react_1.default.createElement(react_popper_1.Popper, { placement: 'bottom' }, () => (react_1.default.createElement(PopperContent, null,
        react_1.default.createElement(react_color_1.ChromePicker, { onChangeComplete: handleColorChange, color: pickedColor }),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(style_guide_1.PrimaryButton, { mini: true, onClick: handleAddColor }, "Add color"),
            react_1.default.createElement(style_guide_1.SecondaryButton, { mini: true, onClick: () => handleCancel(false) }, "Cancel"))))));
};
const textColor = (backgroundColor) => {
    const r = parseInt(backgroundColor.substr(1, 2), 16);
    const g = parseInt(backgroundColor.substr(3, 2), 16);
    const b = parseInt(backgroundColor.substr(5, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq > 186 ? '#000000' : '#ffffff';
};
//# sourceMappingURL=TagsInput.js.map