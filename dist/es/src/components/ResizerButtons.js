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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizingInspectorButton = exports.ResizingOutlinerButton = void 0;
const InspectorHandle_1 = __importDefault(require("@manuscripts/assets/react/InspectorHandle"));
const OutlineViewHandle_1 = __importDefault(require("@manuscripts/assets/react/OutlineViewHandle"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const Panel_1 = require("./Panel");
const ResizingOutlinerButton = (_a) => {
    var props = __rest(_a, []);
    return (react_1.default.createElement(Panel_1.ResizerButton, Object.assign({}, props),
        react_1.default.createElement(OutlineViewHandle_1.default, null)));
};
exports.ResizingOutlinerButton = ResizingOutlinerButton;
const collapsedStyling = styled_components_1.css `
  right: ${(props) => props.theme.grid.unit * 5}px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;
const UnstyledResizingInspectorButton = (_a) => {
    var props = __rest(_a, []);
    return (react_1.default.createElement(Panel_1.ResizerButton, Object.assign({}, props),
        react_1.default.createElement(InspectorHandle_1.default, null)));
};
exports.ResizingInspectorButton = styled_components_1.default(UnstyledResizingInspectorButton) `
  ${(props) => (props.isCollapsed ? collapsedStyling : 'right: 0;')}
`;
//# sourceMappingURL=ResizerButtons.js.map