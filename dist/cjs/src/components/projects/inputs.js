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
exports.Checkbox = exports.StyleSelect = exports.StyleRange = exports.SpacingRange = exports.MediumTextArea = exports.MediumTextField = exports.SmallTextField = exports.SmallNumberField = exports.NumberField = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const lodash_es_1 = require("lodash-es");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
exports.NumberField = styled_components_1.default(style_guide_1.TextField).attrs({
    type: 'number',
    min: 1,
    step: 1,
    pattern: '[0-9]+',
}) `
  width: 100px;
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  font-size: 1em;
`;
exports.SmallNumberField = styled_components_1.default(style_guide_1.TextField).attrs({
    type: 'number',
}) `
  width: 50px;
  padding: 2px ${(props) => props.theme.grid.unit * 2}px;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
  font-size: 0.75em;
`;
exports.SmallTextField = styled_components_1.default(style_guide_1.TextField).attrs({
    type: 'text',
}) `
  width: 25px;
  padding: 2px 4px;
  margin-right: 4px;
  font-size: 0.75em;
`;
exports.MediumTextField = styled_components_1.default(style_guide_1.TextField).attrs({
    type: 'text',
}) `
  padding: 8px;
  font-size: 1em;
`;
exports.MediumTextArea = styled_components_1.default(style_guide_1.TextArea) `
  padding: 8px;
  font-size: 1em;
`;
const SpacingRange = (_a) => {
    var { list } = _a, props = __rest(_a, ["list"]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(exports.StyleRange, Object.assign({ type: 'range', step: 2, list: list }, props)),
        react_1.default.createElement("datalist", { id: list }, lodash_es_1.range(Number(props.min), Number(props.max), Number(props.step)).map((i) => (react_1.default.createElement("option", { key: i }, i))))));
};
exports.SpacingRange = SpacingRange;
exports.StyleRange = styled_components_1.default.input `
  flex: 1;
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
`;
exports.StyleSelect = styled_components_1.default.select `
  flex: 1;
`;
exports.Checkbox = styled_components_1.default.input.attrs({ type: 'checkbox' }) `
  margin-right: ${(props) => props.theme.grid.unit * 2}px;
`;
//# sourceMappingURL=inputs.js.map