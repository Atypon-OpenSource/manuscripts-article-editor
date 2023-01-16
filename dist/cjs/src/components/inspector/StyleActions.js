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
exports.StyleActions = void 0;
const VerticalEllipsis_1 = __importDefault(require("@manuscripts/assets/react/VerticalEllipsis"));
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const StyleActions = ({ addStyle, deleteStyle, duplicateStyle, isDefault, renameStyle }) => {
    const [open, setOpen] = react_1.useState(false);
    const toggleOpen = react_1.useCallback(() => {
        setOpen((value) => !value);
    }, []);
    const executeMenuAction = react_1.useCallback((callback) => () => {
        setOpen(false);
        // Use a timer so the menu closes first
        window.setTimeout(callback, 0);
    }, []);
    return (react_1.default.createElement(react_popper_1.Manager, null,
        react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(MenuButton, { type: "button", ref: ref, onClick: toggleOpen },
            react_1.default.createElement(VerticalEllipsis_1.default, { height: 12 })))),
        open &&
            react_dom_1.default.createPortal(react_1.default.createElement(react_popper_1.Popper, { placement: "bottom", positionFixed: true }, ({ ref, style, placement }) => (react_1.default.createElement("div", { ref: ref, style: style, "data-placement": placement },
                react_1.default.createElement(Menu, null,
                    duplicateStyle && (react_1.default.createElement(MenuItem, { onClick: executeMenuAction(duplicateStyle) }, "Duplicate")),
                    addStyle && (react_1.default.createElement(MenuItem, { onClick: executeMenuAction(addStyle) }, "Add")),
                    !isDefault && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(MenuItem, { onClick: executeMenuAction(renameStyle) }, "Rename"),
                        react_1.default.createElement(MenuItem, { onClick: executeMenuAction(deleteStyle) }, "Delete"))))))), document.getElementById('menu'))));
};
exports.StyleActions = StyleActions;
const MenuButton = styled_components_1.default.button `
  border: none;
  background: ${(props) => props.theme.colors.background.primary};
  cursor: pointer;
  margin: 0 ${(props) => props.theme.grid.unit * 2}px;

  &:focus {
    outline: none;
  }
`;
const Menu = styled_components_1.default.div `
  background: ${(props) => props.theme.colors.background.primary};
  color: ${(props) => props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
`;
const MenuItem = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 2}px;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.brand.default};
    color: ${(props) => props.theme.colors.text.onDark};
  }
`;
//# sourceMappingURL=StyleActions.js.map