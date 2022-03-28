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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeInput = void 0;
const react_1 = __importDefault(require("react"));
const react_select_1 = __importDefault(require("react-select"));
const select_styles_1 = require("../../lib/select-styles");
const options = [
    { value: 'standard', label: 'Standard' },
    { value: 'feature', label: 'Feature' },
    { value: 'standard1', label: 'Standard 1' },
    { value: 'feature2', label: 'Feature 2' },
];
const ThemeInput = ({ value = '', handleChange }) => (react_1.default.createElement(react_select_1.default, { value: options.find((option) => option.value === value), onChange: (selectedOption) => {
        handleChange(selectedOption.value);
    }, options: options, styles: select_styles_1.selectStyles, menuPortalTarget: document.body }));
exports.ThemeInput = ThemeInput;
//# sourceMappingURL=ThemeInput.js.map