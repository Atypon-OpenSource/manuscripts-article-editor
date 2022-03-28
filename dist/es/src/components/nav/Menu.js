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
exports.Menu = exports.FilledMenuBarIcon = exports.MenuLink = exports.MenuSection = exports.MenuSections = exports.MenuBarIcon = exports.MenuContainer = void 0;
require("@manuscripts/style-guide/styles/tip.css");
const AppIcon_1 = __importDefault(require("@manuscripts/assets/react/AppIcon"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const OfflineIndicator_1 = __importDefault(require("../OfflineIndicator"));
const ProjectsButton_1 = __importDefault(require("./ProjectsButton"));
const UserContainer_1 = __importDefault(require("./UserContainer"));
exports.MenuContainer = styled_components_1.default.div `
  display: flex;
  flex-shrink: 0;
  align-items: center;
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: ${(props) => props.theme.font.family.sans};
  font-weight: ${(props) => props.theme.font.weight.medium};
  font-size: ${(props) => props.theme.font.size.medium};
  white-space: nowrap;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.secondary};
`;
exports.MenuBarIcon = styled_components_1.default(style_guide_1.IconButton).attrs(() => ({
    defaultColor: true,
    size: 34,
})) `
  border: 0;
  margin: 15px 11px;
`;
exports.MenuSections = styled_components_1.default.div `
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
exports.MenuSection = styled_components_1.default.div `
  display: flex;
  align-items: center;
  margin-right: ${(props) => props.theme.grid.unit * 5}px;
  margin-left: ${(props) => props.theme.grid.unit * 4}px;
`;
exports.MenuLink = styled_components_1.default(react_router_dom_1.NavLink) `
  display: inline-flex;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  text-decoration: none;
  color: inherit;
  border: solid 2px ${(props) => props.theme.colors.brand.default};
  border-radius: ${(props) => props.theme.grid.radius.small};
  margin-left: 20px;

  &.active {
    background: ${(props) => props.theme.colors.brand.default};
    color: ${(props) => props.theme.colors.text.onDark};
  }

  &:hover {
    background: ${(props) => props.theme.colors.background.primary};
    color: ${(props) => props.theme.colors.brand.default};
    border: solid 2px ${(props) => props.theme.colors.brand.default};
  }
`;
exports.FilledMenuBarIcon = styled_components_1.default(exports.MenuBarIcon) ``;
const MenuContainerWithBorder = styled_components_1.default(exports.MenuContainer) ``;
const Menu = ({ handleClose }) => (react_1.default.createElement(MenuContainerWithBorder, null,
    react_1.default.createElement(exports.FilledMenuBarIcon, { onClick: handleClose },
        react_1.default.createElement(OfflineIndicator_1.default, null,
            react_1.default.createElement(style_guide_1.Tip, { title: 'Back to Editor', placement: 'bottom-end' },
                react_1.default.createElement(AppIcon_1.default, { width: 34, height: 34 })))),
    react_1.default.createElement(exports.MenuSections, null,
        react_1.default.createElement(exports.MenuSection, null,
            react_1.default.createElement(ProjectsButton_1.default, { isDropdown: true })),
        react_1.default.createElement(exports.MenuSection, null,
            react_1.default.createElement(UserContainer_1.default, null)))));
exports.Menu = Menu;
//# sourceMappingURL=Menu.js.map