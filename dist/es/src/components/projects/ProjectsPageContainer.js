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
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const MessageBanner_1 = __importDefault(require("../MessageBanner"));
const GlobalMenu_1 = require("../nav/GlobalMenu");
const Page_1 = require("../Page");
const ProjectsSidebarContainer_1 = __importDefault(require("./ProjectsSidebarContainer"));
const Container = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
`;
const ProjectsPageContainer = ({ tokenActions, errorMessage }) => (react_1.default.createElement(Page_1.Page, null,
    react_1.default.createElement(Page_1.Main, null,
        react_1.default.createElement(Container, null,
            react_1.default.createElement(GlobalMenu_1.GlobalMenu, { active: 'projects' }),
            react_1.default.createElement(MessageBanner_1.default, { errorMessage: errorMessage }),
            react_1.default.createElement(ProjectsSidebarContainer_1.default, null)))));
exports.default = ProjectsPageContainer;
//# sourceMappingURL=ProjectsPageContainer.js.map