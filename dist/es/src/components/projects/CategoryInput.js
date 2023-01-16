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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
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
exports.CategoryInput = void 0;
const react_1 = __importStar(require("react"));
const react_select_1 = __importDefault(require("react-select"));
const styled_components_1 = __importDefault(require("styled-components"));
const use_synced_data_1 = require("../../hooks/use-synced-data");
const section_categories_1 = require("../../lib/section-categories");
const TagsInput_1 = require("./TagsInput");
const CategoryInput = ({ value, handleChange, existingCatsCounted }) => {
    const [currentValue, handleLocalChange] = use_synced_data_1.useSyncedData(value, handleChange, 0);
    const handleInputChange = react_1.useCallback((newValue) => {
        // @ts-ignore
        handleLocalChange(newValue.value);
    }, [handleLocalChange]);
    const OptionComponent = ({ innerRef, innerProps, data, }) => {
        return (react_1.default.createElement(TagsInput_1.OptionWrapper, Object.assign({ ref: innerRef }, innerProps), data.label));
    };
    const options = react_1.useMemo(() => {
        const options = [];
        section_categories_1.sortedSectionCategories.map((cat) => {
            if (section_categories_1.isEditableSectionCategory(cat) &&
                (!section_categories_1.isUniquePresent(cat, existingCatsCounted) || section_categories_1.isUnique(currentValue))) {
                options.push({ value: cat._id, label: cat.name });
            }
        });
        return options;
    }, [currentValue, existingCatsCounted]);
    const selectionValue = react_1.useMemo(() => {
        const cat = section_categories_1.sortedSectionCategories.find((category) => category._id === currentValue);
        return cat && { value: cat._id, label: cat.name };
    }, [currentValue]);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(react_select_1.default, { 
            // @ts-ignore
            value: selectionValue, options: options, menuPortalTarget: document.body, onChange: handleInputChange, maxMenuHeight: 150, components: {
                Option: OptionComponent,
            } })));
};
exports.CategoryInput = CategoryInput;
const Container = styled_components_1.default.div `
  height: ${(props) => props.theme.grid.unit * 30}px;
`;
//# sourceMappingURL=CategoryInput.js.map