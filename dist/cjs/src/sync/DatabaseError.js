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
exports.DatabaseError = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const StorageInfo_1 = require("../components/diagnostics/StorageInfo");
const account_1 = require("../lib/account");
const DatabaseError = () => {
    return (react_1.default.createElement(style_guide_1.Dialog, { isOpen: true, category: style_guide_1.Category.error, header: 'Database error', message: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "Manuscripts is failing to open a local database in your browser to store your project data."),
            react_1.default.createElement("p", null, "Some browsers do not allow access to this local database in private browsing mode. Are you in private browsing mode?"),
            react_1.default.createElement(Diagnostics, { open: true },
                react_1.default.createElement("summary", null, "Diagnostics"),
                react_1.default.createElement(StorageInfo_1.StorageInfo, null))), actions: {
            primary: {
                title: 'Sign out and try again',
                action: account_1.logout,
            },
        } }));
};
exports.DatabaseError = DatabaseError;
const Diagnostics = styled_components_1.default.details `
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
`;
//# sourceMappingURL=DatabaseError.js.map