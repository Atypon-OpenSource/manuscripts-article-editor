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
exports.ParagraphStyles = void 0;
const react_1 = __importStar(require("react"));
const Inspector_1 = require("../Inspector");
const InspectorSection_1 = require("../InspectorSection");
const inputs_1 = require("../projects/inputs");
const ColorField_1 = require("./ColorField");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const ParagraphListsField_1 = require("./ParagraphListsField");
const ParagraphStyleFields_1 = require("./ParagraphStyleFields");
const StyleActions_1 = require("./StyleActions");
const ParagraphStyles = ({ bodyTextParagraphStyles, colors, colorScheme, defaultParagraphStyle, deleteParagraphStyle, duplicateParagraphStyle, error, paragraphStyle, renameParagraphStyle, saveDebouncedParagraphStyle, saveModel, saveParagraphStyle, setElementParagraphStyle, setError, }) => {
    const [tabIndex, setTabIndex] = react_1.useState(0);
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Paragraph Styles' },
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(inputs_1.StyleSelect, { value: paragraphStyle._id, onChange: (event) => {
                    setElementParagraphStyle(event.target.value);
                } }, bodyTextParagraphStyles.map((style) => (react_1.default.createElement("option", { value: style._id, key: style._id }, style.title)))),
            react_1.default.createElement(StyleActions_1.StyleActions, { deleteStyle: deleteParagraphStyle, duplicateStyle: duplicateParagraphStyle, isDefault: paragraphStyle._id === defaultParagraphStyle._id, renameStyle: renameParagraphStyle })),
        error && react_1.default.createElement("div", null, error.message),
        react_1.default.createElement(Inspector_1.InspectorTabs, { index: tabIndex, onChange: setTabIndex },
            react_1.default.createElement(Inspector_1.InspectorPanelTabList, null,
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Text"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Spacing"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Lists")),
            react_1.default.createElement(Inspector_1.InspectorTabPanels, null,
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null, tabIndex === 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ParagraphStyleFields_1.TextSizeField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.TextStyleField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    colorScheme && paragraphStyle.textStyling && (react_1.default.createElement(ColorField_1.ColorField, { label: 'Color', colors: colors, colorScheme: colorScheme, value: paragraphStyle.textStyling.color, handleChange: (color) => saveParagraphStyle(Object.assign(Object.assign({}, paragraphStyle), { textStyling: Object.assign(Object.assign({}, paragraphStyle.textStyling), { color }) })), saveModel: saveModel, setError: setError }))))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null, tabIndex === 1 && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ParagraphStyleFields_1.TextAlignmentField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.TopSpacingField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.BottomSpacingField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.FirstLineIndentField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.LineSpacingField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle })))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null, tabIndex === 2 && (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ParagraphStyleFields_1.ListTailIndentField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.ListIndentPerLevelField, { saveParagraphStyle: saveDebouncedParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphStyleFields_1.ListNumberingField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }),
                    react_1.default.createElement(ParagraphListsField_1.ParagraphListsField, { saveParagraphStyle: saveParagraphStyle, paragraphStyle: paragraphStyle }))))))));
};
exports.ParagraphStyles = ParagraphStyles;
//# sourceMappingURL=ParagraphStyles.js.map