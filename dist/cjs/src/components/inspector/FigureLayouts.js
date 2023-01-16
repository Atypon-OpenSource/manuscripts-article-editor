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
exports.FigureLayouts = void 0;
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("../../config"));
const styles_1 = require("../../lib/styles");
const InspectorSection_1 = require("../InspectorSection");
const inputs_1 = require("../projects/inputs");
const FigureAlignmentField_1 = require("./FigureAlignmentField");
const FigureWidthField_1 = require("./FigureWidthField");
const ManuscriptStyleInspector_1 = require("./ManuscriptStyleInspector");
const FigureLayouts = ({ figureElement, figureLayouts, figureLayout, setElementFigureLayout, setElementAlignment, setElementSizeFraction, }) => {
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Figure Layout' },
        react_1.default.createElement(ManuscriptStyleInspector_1.InspectorField, null,
            react_1.default.createElement(inputs_1.StyleSelect, { value: figureLayout._id, onChange: (event) => {
                    setElementFigureLayout(event.target.value);
                } }, figureLayouts.map((style) => (react_1.default.createElement("option", { value: style._id, key: style._id }, style.title))))),
        react_1.default.createElement(FigureWidthField_1.FigureWidthField, { defaultValue: styles_1.DEFAULT_FIGURE_WIDTH, value: figureElement.sizeFraction, handleChange: setElementSizeFraction }),
        config_1.default.features.figureAlignment && (react_1.default.createElement(FigureAlignmentField_1.FigureAlignmentField, { defaultValue: styles_1.DEFAULT_FIGURE_ALIGNMENT, value: figureElement.alignment, handleChange: setElementAlignment, disabled: Boolean(figureElement.sizeFraction && figureElement.sizeFraction >= 1) }))));
};
exports.FigureLayouts = FigureLayouts;
//# sourceMappingURL=FigureLayouts.js.map