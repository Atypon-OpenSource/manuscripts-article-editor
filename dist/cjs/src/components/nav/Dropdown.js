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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownButton = exports.DropdownButtonContainer = exports.NotificationsBadge = exports.DropdownToggle = exports.DropdownButtonText = exports.DropdownSeparator = exports.DropdownElement = exports.DropdownLink = exports.InvitedBy = exports.PlaceholderTitle = exports.Dropdown = exports.DropdownContainer = void 0;
const ArrowDownUp_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownUp"));
const style_guide_1 = require("@manuscripts/style-guide");
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importStar(require("styled-components"));
const Badge_1 = require("../Badge");
exports.DropdownContainer = styled_components_1.default.div `
  position: relative;
  display: inline-flex;
  align-items: center;
`;
exports.Dropdown = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  color: ${(props) => props.theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.normal};
  max-height: 80vh;
  max-width: 300px;
  ${(props) => props.minWidth && 'min-width: ' + props.minWidth + 'px;'}
  ${(props) => (props.direction === 'right' ? ' right: 0' : 'left : 0')};
  top: ${(props) => (props.top ? props.top : props.theme.grid.unit * 10)}px;
  position: absolute;
  z-index: 10;
`;
exports.PlaceholderTitle = styled_components_1.default(title_editor_1.Title) `
  color: ${(props) => props.theme.colors.text.secondary};
`;
exports.InvitedBy = styled_components_1.default.div `
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.font.size.normal};
  letter-spacing: -0.3px;
  color: ${(props) => props.theme.colors.text.secondary};
  clear: both;
  margin-top: ${(props) => props.theme.grid.unit * 2}px;
`;
const commonStyles = styled_components_1.css `
  display: flex;
  justify-content: space-between;
  padding: ${(props) => props.theme.grid.unit * 3}px
    ${(props) => props.theme.grid.unit * 3}px;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  color: ${(props) => props.disabled
    ? props.theme.colors.text.secondary
    : props.theme.colors.text.primary};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'unset')};

  &:hover,
  &:hover ${exports.PlaceholderTitle} {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`;
exports.DropdownLink = styled_components_1.default(react_router_dom_1.NavLink) `
  ${commonStyles};
`;
exports.DropdownElement = styled_components_1.default.div `
  ${commonStyles};

  cursor: pointer;

  &:hover .user-icon-path {
    fill: ${(props) => props.theme.colors.text.onDark};
  }
`;
exports.DropdownSeparator = styled_components_1.default.div `
  height: 1px;
  width: 100%;
  opacity: 0.23;
  background-color: ${(props) => props.theme.colors.border.primary};
`;
exports.DropdownButtonText = styled_components_1.default.div `
  align-items: center;
  display: flex;
  margin-right: ${(props) => props.theme.grid.unit}px;
`;
exports.DropdownToggle = styled_components_1.default(ArrowDownUp_1.default) `
  margin-left: 6px;
  transform: rotate(180deg);

  path {
    stroke: currentColor;
  }

  &.open {
    transform: rotate(0deg);
  }
`;
exports.NotificationsBadge = styled_components_1.default(Badge_1.Badge) `
  background-color: ${(props) => props.isOpen
    ? props.theme.colors.background.success
    : props.theme.colors.brand.default};
  color: ${(props) => props.isOpen
    ? props.theme.colors.text.success
    : props.theme.colors.text.onDark};
  font-family: ${(props) => props.theme.font.family.sans};
  font-size: 9px;
  margin-left: 4px;
  max-height: 10px;
  min-width: 10px;
  min-height: 10px;
`;
exports.DropdownButtonContainer = styled_components_1.default(style_guide_1.SecondaryButton).attrs((props) => ({
    selected: props.isOpen,
})) `
  .inheritColors path {
    fill: currentColor;
    stroke: currentColor;
  }
`;
const DropdownButton = ({ as, children, disabled, isOpen, notificationsCount, onClick, removeChevron, }) => (react_1.default.createElement(exports.DropdownButtonContainer, { as: as, disabled: disabled, onClick: onClick, isOpen: isOpen, className: 'dropdown-toggle' },
    react_1.default.createElement(exports.DropdownButtonText, null, children),
    !!notificationsCount && (react_1.default.createElement(exports.NotificationsBadge, { isOpen: isOpen }, notificationsCount)),
    !removeChevron && react_1.default.createElement(exports.DropdownToggle, { className: isOpen ? 'open' : '' })));
exports.DropdownButton = DropdownButton;
//# sourceMappingURL=Dropdown.js.map