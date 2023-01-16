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
exports.CollaboratorRolesInput = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const RadioButton_1 = require("../RadioButton");
const Container = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.primary};
`;
const CollaboratorRolesInput = (_a) => {
    var { value, name } = _a, rest = __rest(_a, ["value", "name"]);
    return (react_1.default.createElement(Container, null,
        react_1.default.createElement(RadioButton_1.RadioButton, Object.assign({ _id: 'owner', checked: value === 'Owner', value: 'Owner', textHint: 'Can modify and delete project, invite and remove collaborators' }, rest), "Owner"),
        react_1.default.createElement(RadioButton_1.RadioButton, Object.assign({ _id: 'writer', name: name, checked: value === 'Writer', value: 'Writer', textHint: 'Can modify project contents' }, rest), "Writer"),
        react_1.default.createElement(RadioButton_1.RadioButton, Object.assign({ _id: 'viewer', name: name, checked: value === 'Viewer', value: 'Viewer', textHint: 'Can only review projects without modifying it' }, rest), "Viewer")));
};
exports.CollaboratorRolesInput = CollaboratorRolesInput;
//# sourceMappingURL=CollaboratorRolesInput.js.map