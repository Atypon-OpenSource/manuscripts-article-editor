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
exports.ProfileDropdown = void 0;
const ArrowDownUp_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownUp"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const Dropdown_1 = require("./Dropdown");
const ProfileDropdown = ({ children, user }) => {
    const [open, setOpen] = react_1.useState(false);
    const nodeRef = react_1.useRef(null);
    const toggleOpen = react_1.useCallback(() => {
        setOpen((value) => !value);
    }, []);
    const handleClickOutside = react_1.useCallback((event) => {
        if (nodeRef.current && !nodeRef.current.contains(event.target)) {
            setOpen(false);
        }
    }, []);
    react_1.useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside, open]);
    return (react_1.default.createElement(Dropdown_1.DropdownContainer, { id: 'user-dropdown', ref: nodeRef },
        react_1.default.createElement(DropdownButton, { onClick: toggleOpen, isOpen: open, className: 'dropdown-toggle' },
            react_1.default.createElement(AvatarContainer, null,
                react_1.default.createElement(style_guide_1.Avatar, { src: user.avatar, size: 32 })),
            react_1.default.createElement(DropdownToggle, null)),
        open && (react_1.default.createElement(Dropdown_1.Dropdown, { direction: 'right', minWidth: 100 }, children))));
};
exports.ProfileDropdown = ProfileDropdown;
const AvatarContainer = styled_components_1.default.div `
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;

  svg:hover path,
  path {
    fill: currentColor;
  }
`;
const DropdownToggle = styled_components_1.default(ArrowDownUp_1.default) `
  margin-left: 6px;

  & path {
    stroke: currentColor;
  }
`;
const styledAvatar = styled_components_1.css `
  ${AvatarContainer}:after {
    border: 2px solid ${(props) => props.theme.colors.brand.medium};
    border-radius: 50%;
    display: block;
    height: 30px;
    position: absolute;
    width: 30px;
  }
`;
const DropdownButton = styled_components_1.default.button `
  display: flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  border: none;
  font-size: inherit;
  border-radius: ${(props) => props.theme.grid.radius.small};
  cursor: pointer;
  background: none;
  color: ${(props) => props.isOpen
    ? props.theme.colors.brand.medium
    : props.theme.colors.text.secondary};

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${(props) => props.theme.colors.brand.medium};
  }

  ${DropdownToggle} {
    transform: ${(props) => (props.isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
  }

  ${(props) => props.isOpen && styledAvatar}
`;
//# sourceMappingURL=ProfileDropdown.js.map