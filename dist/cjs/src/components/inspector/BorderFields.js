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
exports.BorderFields = exports.BorderWidthField = exports.BorderStyleField = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("../../lib/styles");
const inputs_1 = require("../projects/inputs");
const ColorField_1 = require("./ColorField");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleFields_1 = require("./StyleFields");
const BorderStyleField = ({ value, handleChange, borderStyles }) => {
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Style"),
        react_1.default.createElement(inputs_1.StyleSelect, { value: value, onChange: (event) => {
                handleChange(event.target.value);
            } },
            react_1.default.createElement("option", { value: undefined, key: 'none' }, "None"),
            react_1.default.createElement("option", { disabled: true }, "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014"),
            borderStyles.map((borderStyle) => (react_1.default.createElement("option", { value: borderStyle._id, key: borderStyle._id }, borderStyle.title || 'Untitled'))))));
};
exports.BorderStyleField = BorderStyleField;
const BorderWidthField = ({ value, defaultValue, handleChange }) => {
    const currentValue = StyleFields_1.valueOrDefault(value, defaultValue);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Width"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'border-width', min: 0, max: 8, step: 2, list: 'borderWidthList', value: currentValue, onChange: (event) => {
                handleChange(Number(event.target.value));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: currentValue, onChange: (event) => {
                handleChange(Number(event.target.value));
            } }),
        "pt"));
};
exports.BorderWidthField = BorderWidthField;
const BorderFields = ({ border, borderStyles, saveBorder, saveDebouncedBorder, colors, colorScheme, saveModel, setError, }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(exports.BorderStyleField, { borderStyles: borderStyles, value: border.style, handleChange: (style) => {
                saveBorder(Object.assign(Object.assign({}, border), { style }));
            } }),
        react_1.default.createElement(exports.BorderWidthField, { defaultValue: styles_1.DEFAULT_TABLE_BORDER_WIDTH, value: border.width, handleChange: (width) => saveDebouncedBorder(Object.assign(Object.assign({}, border), { width })) }),
        react_1.default.createElement(ColorField_1.ColorField, { colors: colors, colorScheme: colorScheme, value: border.color, handleChange: (color) => saveBorder(Object.assign(Object.assign({}, border), { color })), saveModel: saveModel, setError: setError })));
};
exports.BorderFields = BorderFields;
//# sourceMappingURL=BorderFields.js.map