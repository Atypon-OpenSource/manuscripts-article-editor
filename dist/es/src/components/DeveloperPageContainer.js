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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const config_1 = __importDefault(require("../config"));
const developer_1 = require("../lib/developer");
const DatabaseProvider_1 = require("./DatabaseProvider");
const StorageInfo_1 = require("./diagnostics/StorageInfo");
const DropdownAction = styled_components_1.default.div `
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`;
const DropdownInfo = styled_components_1.default.div `
  padding: 10px 20px;
  white-space: nowrap;
`;
const PlainLink = styled_components_1.default.a `
  color: inherit;
  text-decoration: none;
`;
const DeveloperPageContainer = () => (react_1.default.createElement(DatabaseProvider_1.DatabaseContext.Consumer, null, (db) => (react_1.default.createElement("div", null,
    react_1.default.createElement(DropdownAction, { onClick: () => {
            developer_1.createToken();
            alert('Created token');
        } }, "Create token"),
    react_1.default.createElement(DropdownAction, { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
            yield developer_1.createUserProfile(db);
            alert('Created user profile');
            window.location.assign('/projects');
        }) }, "Create user profile"),
    react_1.default.createElement(DropdownAction, { onClick: () => __awaiter(void 0, void 0, void 0, function* () {
            yield db.remove();
            alert('Removed database');
            window.location.assign('/projects');
        }) }, "Delete database"),
    config_1.default.git.version && (react_1.default.createElement(DropdownInfo, null,
        "Version: ",
        config_1.default.git.version)),
    config_1.default.git.commit && (react_1.default.createElement(DropdownInfo, null,
        "Commit: ",
        config_1.default.git.commit)),
    react_1.default.createElement(DropdownInfo, null,
        react_1.default.createElement(PlainLink, { href: `${config_1.default.api.url}/app/version` }, "API version")),
    react_1.default.createElement(StorageInfo_1.StorageInfo, null)))));
exports.default = DeveloperPageContainer;
//# sourceMappingURL=DeveloperPageContainer.js.map