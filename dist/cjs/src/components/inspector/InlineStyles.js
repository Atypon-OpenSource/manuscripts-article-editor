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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineStyles = void 0;
const react_1 = __importStar(require("react"));
const use_debounce_1 = require("../../hooks/use-debounce");
const InspectorSection_1 = require("../InspectorSection");
const inputs_1 = require("../projects/inputs");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleActions_1 = require("./StyleActions");
const InlineStyles = ({ addStyle, deleteActiveStyle, renameActiveStyle, activeStyle, applyStyle, inlineStyles, updateStyle, }) => (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Inline Styles' },
    react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
        react_1.default.createElement(inputs_1.StyleSelect, { value: (activeStyle && activeStyle._id) || 'none', onChange: (event) => applyStyle(event.target.value === 'none' ? undefined : event.target.value) },
            react_1.default.createElement("option", { value: 'none', key: 'none' }, "None"),
            react_1.default.createElement("option", { disabled: true, key: 'separator' }, "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014"),
            inlineStyles.map((style) => (react_1.default.createElement("option", { value: style._id, key: style._id }, style.title || 'Untitled Style')))),
        react_1.default.createElement(StyleActions_1.StyleActions, { deleteStyle: deleteActiveStyle, addStyle: addStyle, isDefault: activeStyle === undefined, renameStyle: renameActiveStyle })),
    activeStyle && (react_1.default.createElement(InlineStyleEditor, { key: activeStyle._id, value: activeStyle.style || '', handleChange: updateStyle }))));
exports.InlineStyles = InlineStyles;
const InlineStyleEditor = ({ value, handleChange }) => {
    const [style, setStyle] = react_1.useState(value);
    const debouncedStyle = use_debounce_1.useDebounce(style, 1000);
    react_1.useEffect(() => {
        if (value !== debouncedStyle) {
            handleChange(debouncedStyle);
        }
    }, [value, handleChange, debouncedStyle]);
    return (react_1.default.createElement(inputs_1.MediumTextArea, { value: style, onChange: (event) => setStyle(event.target.value), rows: 5, placeholder: 'Enter CSS styles…' }));
};
//# sourceMappingURL=InlineStyles.js.map