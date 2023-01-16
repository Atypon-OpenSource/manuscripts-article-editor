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
exports.StatusInput = void 0;
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
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_select_1 = require("react-select");
const creatable_1 = __importDefault(require("react-select/creatable"));
const store_1 = require("../../../store");
const StatusDnD_1 = __importDefault(require("./StatusDnD"));
const StatusIcons_1 = __importStar(require("./StatusIcons"));
const StatusInputStyling_1 = require("./StatusInputStyling");
const StatusInput = ({ target, isOverdue, isDueSoon, }) => {
    const nodeRef = react_1.useRef(null);
    const [saveModel] = store_1.useStore((store) => store.saveModel);
    const [labels] = store_1.useStore((store) => store.statusLabels);
    const handleClickOutside = react_1.useCallback((event) => {
        if (nodeRef.current && !nodeRef.current.contains(event.target)) {
            setDisplayDndZone(false);
            setForceMenuOpen(undefined);
            setNewLabel('');
        }
    }, []);
    const sortedLabels = react_1.default.useMemo(() => [...labels].sort((a, b) => a.priority && b.priority ? (a.priority > b.priority ? 1 : -1) : 0), [labels]);
    const [newLabel, setNewLabel] = react_1.default.useState('');
    const [alertVisible, setAlertVisible] = react_1.default.useState(false);
    const [displayDndZone, setDisplayDndZone] = react_1.default.useState(false);
    const [forceMenuOpen, setForceMenuOpen] = react_1.default.useState(undefined);
    // const [showTooltip, setShowTooltip] = React.useState(false)
    const label = sortedLabels.filter((label) => label._id === target.status);
    const updateTargetStatus = react_1.useCallback((status) => __awaiter(void 0, void 0, void 0, function* () {
        yield saveModel(Object.assign(Object.assign({}, target), { status: status ? status._id : undefined }));
    }), [saveModel, target]);
    react_1.default.useEffect(() => {
        if (newLabel && displayDndZone) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [newLabel, displayDndZone, handleClickOutside]);
    const ClearIndicator = (clearIProps) => react_select_1.components.ClearIndicator && (react_1.default.createElement(react_select_1.components.ClearIndicator, Object.assign({}, clearIProps),
        react_1.default.createElement(StatusIcons_1.CloseIcon, null)));
    const Menu = (menuProps) => react_select_1.components.Menu && (react_1.default.createElement(react_select_1.components.Menu, Object.assign({}, menuProps),
        react_1.default.createElement(react_1.default.Fragment, null, displayDndZone ? (react_1.default.createElement(StatusInputStyling_1.DndZone, { ref: nodeRef },
            react_1.default.createElement(StatusDnD_1.default, { tasks: sortedLabels, newTask: newLabel, saveOrder: handleCreateOption }))) : (menuProps.children))));
    const renderCreateOptionIcon = (data) => {
        const isNewLabel = data.name.startsWith('Create ');
        return isNewLabel ? react_1.default.createElement(StatusIcons_1.PlusIcon, null) : StatusIcons_1.default(data._id, sortedLabels);
    };
    const Option = (optionProps) => react_select_1.components.Option && (react_1.default.createElement(react_select_1.components.Option, Object.assign({}, optionProps),
        react_1.default.createElement(StatusInputStyling_1.DndItemButton, { className: "padded", isDisabled: optionProps.isDisabled, isSelected: optionProps.isSelected, isFocused: optionProps.isFocused, pie: StatusIcons_1.calculateCircumference(optionProps.data._id, sortedLabels) },
            renderCreateOptionIcon(optionProps.data),
            optionProps.data.name)));
    const SingleValue = (singleValueProps) => {
        return (react_select_1.components.SingleValue && (react_1.default.createElement(react_select_1.components.SingleValue, Object.assign({}, singleValueProps),
            react_1.default.createElement(StatusInputStyling_1.DndItemButton, { isOverdue: isOverdue, isDueSoon: isDueSoon, pie: StatusIcons_1.calculateCircumference(singleValueProps.data._id, sortedLabels) },
                react_1.default.createElement(StatusInputStyling_1.IconSpan
                // onMouseEnter={() => setShowTooltip(true)}
                // onMouseLeave={() => setShowTooltip(false)}
                , null, StatusIcons_1.default(singleValueProps.data._id, sortedLabels)),
                singleValueProps.data.name))));
    };
    const handleCreateOptionAfter = react_1.useCallback(() => {
        // reset the menu
        setDisplayDndZone(false);
        setForceMenuOpen(undefined);
        setAlertVisible(true);
        // wait a small amount of time so the alert is read
        window.setTimeout(() => {
            // hide the alert
            setAlertVisible(false);
        }, 2000);
    }, []);
    const handleCreateOptionBefore = react_1.useCallback((term) => {
        setNewLabel(term);
        // toggle menu to dnd mode
        setDisplayDndZone(true);
        // @ts-ignore
        setForceMenuOpen(true);
    }, []);
    const handleCreateOption = react_1.useCallback((label, priority) => __awaiter(void 0, void 0, void 0, function* () {
        let status;
        if (typeof label === 'string') {
            status = Object.assign(Object.assign({}, manuscript_transform_1.buildStatusLabel(label)), { priority });
        }
        else {
            status = Object.assign(Object.assign({}, label), { priority });
        }
        yield saveModel(status).then((newStatus) => {
            if (typeof label === 'string') {
                // Make the newly created label as the new status
                updateTargetStatus(newStatus);
                handleCreateOptionAfter();
            }
        });
    }), [handleCreateOptionAfter, saveModel, updateTargetStatus]);
    return (react_1.default.createElement(StatusInputStyling_1.StatusInputWrapper, null,
        react_1.default.createElement(creatable_1.default, { components: {
                ClearIndicator,
                Menu,
                Option,
                SingleValue,
            }, createOptionPosition: "first", isClearable: true, isSearchable: true, getNewOptionData: (inputValue) => {
                const option = {
                    name: `Create "${inputValue}"`,
                };
                return option;
            }, getOptionValue: (option) => option._id, getOptionLabel: (option) => option.name, menuIsOpen: forceMenuOpen, menuPortalTarget: document.body, onChange: updateTargetStatus, onCreateOption: handleCreateOptionBefore, options: sortedLabels, styles: StatusInputStyling_1.customStyles, value: label, placeholder: 'None' }),
        alertVisible && (react_1.default.createElement(StatusInputStyling_1.AlertContainer, null,
            react_1.default.createElement(style_guide_1.AlertMessage, { type: style_guide_1.AlertMessageType.success, hideCloseButton: true },
                "The \"",
                newLabel,
                "\" status is created")))));
};
exports.StatusInput = StatusInput;
//# sourceMappingURL=StatusInput.js.map