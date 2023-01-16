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
exports.SortByDropdown = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const use_dropdown_1 = require("../../hooks/use-dropdown");
const Dropdown_1 = require("../nav/Dropdown");
const SortByDropdown = ({ sortBy, handleSort }) => {
    const { isOpen, toggleOpen, wrapperRef } = use_dropdown_1.useDropdown();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Container, { ref: wrapperRef },
            react_1.default.createElement(Dropdown_1.DropdownButtonContainer, { isOpen: isOpen, onClick: toggleOpen, className: 'dropdown-toggle' },
                react_1.default.createElement(Label, null,
                    "Sorted by:",
                    react_1.default.createElement(Bold, null, sortBy),
                    react_1.default.createElement(Dropdown_1.DropdownToggle, { className: isOpen ? 'open' : '' }))),
            isOpen && (react_1.default.createElement(DropdownList, { direction: 'right', minWidth: 100 },
                react_1.default.createElement(Option, { onClick: (event) => {
                        handleSort(event);
                        toggleOpen();
                    }, key: 'Date', value: 'Date' }, "Date"),
                react_1.default.createElement(Option, { onClick: (event) => {
                        handleSort(event);
                        toggleOpen();
                    }, key: 'in Context', value: 'in Context' }, "in Context")))),
        react_1.default.createElement(SeparatorLine, null)));
};
exports.SortByDropdown = SortByDropdown;
const SeparatorLine = styled_components_1.default.div `
  margin: 0 ${(props) => props.theme.grid.unit * 6}px;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  height: 1px;
`;
const Bold = styled_components_1.default.span `
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.bold};
  margin-left: ${(props) => props.theme.grid.unit}px;
`;
const Label = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.normal};
  display: flex;
  align-items: center;
`;
const Container = styled_components_1.default(Dropdown_1.DropdownContainer) `
  padding-top: ${(props) => props.theme.grid.unit * 4}px;
  padding-left: ${(props) => props.theme.grid.unit * 4}px;

  .dropdown-toggle {
    border: none;
    background: transparent !important;
  }
`;
const Option = styled_components_1.default(style_guide_1.SecondaryButton) `
  ${(props) => props.disabled && disabledBtnStyle}
  text-align: left;
  display: block;
  border: none;
  &:not([disabled]):hover {
    background: ${(props) => props.theme.colors.background.fifth} !important;
    color: ${(props) => props.theme.colors.button.secondary.color.default} !important;
  }
`;
const DropdownList = styled_components_1.default(Dropdown_1.Dropdown) `
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`;
const disabledBtnStyle = styled_components_1.css `
  cursor: default !important;
  background-color: unset !important;
  color: ${(props) => props.theme.colors.text.secondary} !important;
  border: none !important;
`;
//# sourceMappingURL=SortByDropdown.js.map