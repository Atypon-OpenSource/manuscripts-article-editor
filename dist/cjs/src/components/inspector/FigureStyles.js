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
exports.FigureStyles = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("../../lib/styles");
const Inspector_1 = require("../Inspector");
const InspectorSection_1 = require("../InspectorSection");
const inputs_1 = require("../projects/inputs");
const BorderFields_1 = require("./BorderFields");
const FigureStyleFields_1 = require("./FigureStyleFields");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const StyleActions_1 = require("./StyleActions");
const StyleFields_1 = require("./StyleFields");
const FigureStyles = ({ borderStyles, figureStyles, colors, colorScheme, defaultFigureStyle, deleteFigureStyle, duplicateFigureStyle, error, figureStyle, renameFigureStyle, saveDebouncedFigureStyle, saveModel, saveFigureStyle, setElementFigureStyle, setError, }) => {
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Figure Styles' },
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(inputs_1.StyleSelect, { value: figureStyle._id, onChange: (event) => {
                    setElementFigureStyle(event.target.value);
                } }, figureStyles.map((style) => (react_1.default.createElement("option", { value: style._id, key: style._id }, style.title)))),
            react_1.default.createElement(StyleActions_1.StyleActions, { deleteStyle: deleteFigureStyle, duplicateStyle: duplicateFigureStyle, isDefault: figureStyle._id === defaultFigureStyle._id, renameStyle: renameFigureStyle })),
        error && react_1.default.createElement("div", null, error.message),
        react_1.default.createElement(Inspector_1.InspectorTabs, null,
            react_1.default.createElement(Inspector_1.InspectorPanelTabList, null,
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Figure"),
                react_1.default.createElement(Inspector_1.InspectorTab, null, "Panel")),
            react_1.default.createElement(Inspector_1.InspectorTabPanels, null,
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(FigureStyleFields_1.SpacingField, { defaultValue: styles_1.DEFAULT_FIGURE_OUTER_SPACING, value: figureStyle.outerSpacing, handleChange: (outerSpacing) => saveDebouncedFigureStyle(Object.assign(Object.assign({}, figureStyle), { outerSpacing })) }),
                    react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Caption"),
                    react_1.default.createElement(FigureStyleFields_1.CaptionPositionField, { value: StyleFields_1.valueOrDefault(figureStyle.captionPosition, styles_1.DEFAULT_FIGURE_CAPTION_POSITION), handleChange: (captionPosition) => {
                            saveFigureStyle(Object.assign(Object.assign({}, figureStyle), { captionPosition }));
                        } }),
                    react_1.default.createElement(FigureStyleFields_1.CaptionAlignmentField, { value: StyleFields_1.valueOrDefault(figureStyle.alignment, styles_1.DEFAULT_FIGURE_CAPTION_ALIGNMENT), handleChange: (alignment) => {
                            saveFigureStyle(Object.assign(Object.assign({}, figureStyle), { alignment }));
                        } }),
                    react_1.default.createElement(FigureStyleFields_1.LabelPositionField, { value: StyleFields_1.valueOrDefault(figureStyle.labelPosition, styles_1.DEFAULT_FIGURE_LABEL_POSITION), handleChange: (labelPosition) => {
                            saveFigureStyle(Object.assign(Object.assign({}, figureStyle), { labelPosition }));
                        } }),
                    figureStyle.outerBorder && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Border"),
                        react_1.default.createElement(BorderFields_1.BorderFields, { border: figureStyle.outerBorder, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, saveModel: saveModel, setError: setError, saveBorder: (border) => {
                                saveFigureStyle(Object.assign(Object.assign({}, figureStyle), { outerBorder: border }));
                            }, saveDebouncedBorder: (border) => saveDebouncedFigureStyle(Object.assign(Object.assign({}, figureStyle), { outerBorder: border })) })))),
                react_1.default.createElement(Inspector_1.InspectorTabPanel, null,
                    react_1.default.createElement(FigureStyleFields_1.SpacingField, { defaultValue: styles_1.DEFAULT_FIGURE_INNER_SPACING, value: figureStyle.innerSpacing, handleChange: (innerSpacing) => saveDebouncedFigureStyle(Object.assign(Object.assign({}, figureStyle), { innerSpacing })) }),
                    figureStyle.innerBorder && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(Inspector_1.InspectorTabPanelHeading, null, "Border"),
                        react_1.default.createElement(BorderFields_1.BorderFields, { border: figureStyle.innerBorder, borderStyles: borderStyles, colors: colors, colorScheme: colorScheme, saveModel: saveModel, setError: setError, saveBorder: (border) => {
                                saveFigureStyle(Object.assign(Object.assign({}, figureStyle), { innerBorder: border }));
                            }, saveDebouncedBorder: (border) => saveDebouncedFigureStyle(Object.assign(Object.assign({}, figureStyle), { innerBorder: border })) }))))))));
};
exports.FigureStyles = FigureStyles;
//# sourceMappingURL=FigureStyles.js.map