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
exports.ElementStyleInspector = void 0;
const manuscript_transform_1 = require("@manuscripts/manuscript-transform");
const manuscripts_json_schema_1 = require("@manuscripts/manuscripts-json-schema");
const react_1 = __importDefault(require("react"));
const FigureLayoutInspector_1 = require("./FigureLayoutInspector");
const FigureStyleInspector_1 = require("./FigureStyleInspector");
const ParagraphStyleInspector_1 = require("./ParagraphStyleInspector");
const TableStyleInspector_1 = require("./TableStyleInspector");
const isFigureElement = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.FigureElement);
const isTableElement = manuscript_transform_1.hasObjectType(manuscripts_json_schema_1.ObjectTypes.TableElement);
const ElementStyleInspector = (props) => {
    const { element } = props;
    if (isFigureElement(element)) {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(FigureLayoutInspector_1.FigureLayoutInspector, Object.assign({}, props, { element: element })),
            react_1.default.createElement(FigureStyleInspector_1.FigureStyleInspector, Object.assign({}, props, { element: element }))));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        ParagraphStyleInspector_1.hasParagraphStyle(element) && (react_1.default.createElement(ParagraphStyleInspector_1.ParagraphStyleInspector, Object.assign({}, props, { element: element }))),
        isTableElement(element) && (react_1.default.createElement(TableStyleInspector_1.TableStyleInspector, Object.assign({}, props, { element: element })))));
};
exports.ElementStyleInspector = ElementStyleInspector;
//# sourceMappingURL=ElementStyleInspector.js.map