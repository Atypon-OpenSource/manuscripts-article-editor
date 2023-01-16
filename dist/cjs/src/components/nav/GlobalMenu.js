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
exports.GlobalMenu = void 0;
const AppIcon_1 = __importDefault(require("@manuscripts/assets/react/AppIcon"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const OfflineIndicator_1 = __importDefault(require("../OfflineIndicator"));
const Support_1 = require("../Support");
const Menu_1 = require("./Menu");
const ProjectsButton_1 = __importDefault(require("./ProjectsButton"));
const UpdatesContainer_1 = require("./UpdatesContainer");
const UserContainer_1 = __importDefault(require("./UserContainer"));
const Container = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.large};
  font-weight: ${(props) => props.theme.font.weight.medium};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  user-select: none;
`;
const StyledMenuSection = styled_components_1.default(Menu_1.MenuSection) `
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const GlobalMenu = ({ active }) => (react_1.default.createElement(Menu_1.MenuContainer, null,
    react_1.default.createElement(Menu_1.FilledMenuBarIcon, null,
        react_1.default.createElement(OfflineIndicator_1.default, null,
            react_1.default.createElement(AppIcon_1.default, { width: 34, height: 34 }))),
    react_1.default.createElement(Menu_1.MenuSections, null,
        react_1.default.createElement(StyledMenuSection, null, active === 'projects' ? (react_1.default.createElement(Container, null, "Projects")) : (react_1.default.createElement(ProjectsButton_1.default, { isDropdown: true }))),
        react_1.default.createElement(Menu_1.MenuSection, null,
            react_1.default.createElement(Support_1.Support, null),
            react_1.default.createElement(UpdatesContainer_1.UpdatesContainer, null),
            react_1.default.createElement(UserContainer_1.default, null)))));
exports.GlobalMenu = GlobalMenu;
//# sourceMappingURL=GlobalMenu.js.map