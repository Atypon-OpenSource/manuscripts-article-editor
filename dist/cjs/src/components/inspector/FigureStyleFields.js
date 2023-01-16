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
exports.SpacingField = exports.LabelPositionField = exports.CaptionAlignmentField = exports.CaptionPositionField = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("../../lib/styles");
const inputs_1 = require("../projects/inputs");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleFields_1 = require("./StyleFields");
// TODO: remove this once "above" and "below" are supported
const replaceCaptionPosition = (value) => {
    if (value === 'above') {
        return 'top';
    }
    if (value === 'below') {
        return 'bottom';
    }
    return value;
};
const CaptionPositionField = ({ value, handleChange }) => {
    value = replaceCaptionPosition(value);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Position"),
        react_1.default.createElement(inputs_1.StyleSelect, { value: value, onChange: (event) => {
                handleChange(event.target.value);
            } }, Object.entries(styles_1.figureCaptionPositions).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))));
};
exports.CaptionPositionField = CaptionPositionField;
const CaptionAlignmentField = ({ value, handleChange }) => (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Alignment"),
    react_1.default.createElement(inputs_1.StyleSelect, { value: value, onChange: (event) => {
            handleChange(event.target.value);
        } }, Object.entries(styles_1.captionAlignments).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))));
exports.CaptionAlignmentField = CaptionAlignmentField;
const LabelPositionField = ({ value, handleChange }) => {
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Label"),
        react_1.default.createElement(inputs_1.StyleSelect, { value: value, onChange: (event) => {
                handleChange(event.target.value);
            } }, Object.entries(styles_1.figureLabelPositions).map(([key, value]) => (react_1.default.createElement("option", { value: key, key: key }, value.label))))));
};
exports.LabelPositionField = LabelPositionField;
const SpacingField = ({ value, defaultValue, handleChange }) => {
    const currentValue = StyleFields_1.valueOrDefault(value, defaultValue);
    return (react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorLabel, null, "Spacing"),
        react_1.default.createElement(inputs_1.SpacingRange, { name: 'border-spacing', min: 0, max: 40, step: 2, list: 'borderSpacingList', value: currentValue, onChange: (event) => {
                handleChange(Number(event.target.value));
            } }),
        react_1.default.createElement(inputs_1.SmallNumberField, { value: currentValue, onChange: (event) => {
                handleChange(Number(event.target.value));
            } }),
        "pt"));
};
exports.SpacingField = SpacingField;
//# sourceMappingURL=FigureStyleFields.js.map