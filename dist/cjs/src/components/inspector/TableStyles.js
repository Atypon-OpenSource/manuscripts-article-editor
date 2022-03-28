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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableStyles = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("../../lib/styles");
const Inspector_1 = require("../Inspector");
const InspectorSection_1 = require("../InspectorSection");
const inputs_1 = require("../projects/inputs");
const BorderFields_1 = require("./BorderFields");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleActions_1 = require("./StyleActions");
const StyleFields_1 = require("./StyleFields");
const TableStyleFields_1 = require("./TableStyleFields");
const TableStyles = ({ tableStyles, borderStyles, colors, colorScheme, defaultTableStyle, deleteTableStyle, duplicateTableStyle, error, tableStyle, renameTableStyle, saveDebouncedTableStyle, saveModel, saveTableStyle, setElementTableStyle, setError, }) => {
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Table Styles' },
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(inputs_1.StyleSelect, { value: tableStyle._id, onChange: (event) => {
                    setElementTableStyle(event.target.value);
                } }, tableStyles.map((style) => (react_1.default.createElement("option", { value: style._id, key: style._id }, style.title)))),
            react_1.default.createElement(StyleActions_1.StyleActions, { deleteStyle: deleteTableStyle, duplicateStyle: duplicateTableStyle, isDefault: tableStyle._id === defaultTableStyle._id, renameStyle: renameTableStyle })),
        error && react_1.default.createElement("div", null, error.message),
        react_1.default.createElement(Inspector_1.InspectorTabs, null,
            react_1.default.createElement(Inspector_1.InspectorPanelTabList, null,
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Caption"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Header"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Footer")),
            react_1.default.createElement(Inspector_1.InspectorTabPanels, null,
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(TableStyleFields_1.CaptionPositionField, { value: StyleFields_1.valueOrDefault(tableStyle.captionPosition, styles_1.DEFAULT_TABLE_CAPTION_POSITION), handleChange: (captionPosition) => {
                            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { captionPosition }));
                        } }),
                    react_1.default.createElement(TableStyleFields_1.CaptionAlignmentField, { value: StyleFields_1.valueOrDefault(tableStyle.alignment, styles_1.DEFAULT_TABLE_CAPTION_ALIGNMENT), handleChange: (alignment) => {
                            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { alignment }));
                        } })),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Top Border"),
                    tableStyle.headerTopBorder && (react_1.default.createElement(BorderFields_1.BorderFields, { border: tableStyle.headerTopBorder, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, saveModel: saveModel, setError: setError, saveBorder: (border) => {
                            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { headerTopBorder: border }));
                        }, saveDebouncedBorder: (border) => saveDebouncedTableStyle(Object.assign(Object.assign({}, tableStyle), { headerTopBorder: border })) })),
                    react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Bottom Border"),
                    tableStyle.headerBottomBorder && (react_1.default.createElement(BorderFields_1.BorderFields, { border: tableStyle.headerBottomBorder, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, saveModel: saveModel, setError: setError, saveBorder: (border) => {
                            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { headerBottomBorder: border }));
                        }, saveDebouncedBorder: (border) => saveDebouncedTableStyle(Object.assign(Object.assign({}, tableStyle), { headerBottomBorder: border })) }))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Top Border"),
                    tableStyle.footerTopBorder && (react_1.default.createElement(BorderFields_1.BorderFields, { border: tableStyle.footerTopBorder, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, saveModel: saveModel, setError: setError, saveBorder: (border) => {
                            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { footerTopBorder: border }));
                        }, saveDebouncedBorder: (border) => saveDebouncedTableStyle(Object.assign(Object.assign({}, tableStyle), { footerTopBorder: border })) })),
                    react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Bottom Border"),
                    tableStyle.footerBottomBorder && (react_1.default.createElement(BorderFields_1.BorderFields, { border: tableStyle.footerBottomBorder, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, saveModel: saveModel, setError: setError, saveBorder: (border) => {
                            saveTableStyle(Object.assign(Object.assign({}, tableStyle), { footerBottomBorder: border }));
                        }, saveDebouncedBorder: (border) => saveDebouncedTableStyle(Object.assign(Object.assign({}, tableStyle), { footerBottomBorder: border })) })))))));
};
exports.TableStyles = TableStyles;
//# sourceMappingURL=TableStyles.js.map