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
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownMenu = void 0;
const VerticalEllipsis_1 = __importDefault(require("@manuscripts/assets/react/VerticalEllipsis"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Dropdown_1 = require("../components/nav/Dropdown");
const use_dropdown_1 = require("../hooks/use-dropdown");
const DropdownMenu = () => {
    const { isOpen, toggleOpen, wrapperRef } = use_dropdown_1.useDropdown();
    return (react_1.default.createElement(Dropdown_1.DropdownContainer, { ref: wrapperRef },
        react_1.default.createElement(DropdownEllipsis, null,
            react_1.default.createElement(Dropdown_1.DropdownButton, { removeChevron: true, isOpen: isOpen, onClick: toggleOpen },
                react_1.default.createElement(VerticalEllipsis_1.default, null))),
        isOpen && (react_1.default.createElement(DropdownTop, null,
            react_1.default.createElement(Dropdown_1.DropdownLink, { to: "/profile" }, "Profile"),
            react_1.default.createElement(Dropdown_1.DropdownLink, { to: "/projects" }, "Open Manuscripts"),
            react_1.default.createElement(Dropdown_1.DropdownLink, { to: "/logout" }, "Sign out")))));
};
exports.DropdownMenu = DropdownMenu;
const DropdownEllipsis = styled_components_1.default.div `
  .dropdown-toggle {
    border: none;
    border-color: transaprent;
  }
`;
const DropdownTop = styled_components_1.default(Dropdown_1.Dropdown) `
  top: auto;
  bottom: 2em;
`;
//# sourceMappingURL=DropdownMenu.js.map