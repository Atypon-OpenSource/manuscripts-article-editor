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
exports.ColorSelector = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_color_1 = require("react-color");
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const ColorSelector = ({ handleChange }) => {
    const [open, setOpen] = react_1.useState(false);
    const [color, setColor] = react_1.useState('#ffffff');
    const toggleOpen = react_1.useCallback(() => {
        setOpen((open) => !open);
    }, [setOpen]);
    const handleSave = react_1.useCallback(() => {
        if (color) {
            handleChange(color);
        }
        setOpen(false);
    }, [color, handleChange, setOpen]);
    const handleColorChange = react_1.useCallback((color) => {
        setColor(color.hex);
    }, [setColor]);
    const handleCancel = react_1.useCallback(() => {
        setOpen(false);
    }, [setOpen]);
    return (react_1.default.createElement(react_popper_1.Manager, null,
        react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(AddButton, { ref: ref, type: 'button', onClick: toggleOpen }, "+"))),
        open && (react_1.default.createElement(react_popper_1.Popper, { placement: 'left' }, ({ ref, style, placement }) => (react_1.default.createElement("div", { ref: ref, style: Object.assign(Object.assign({}, style), { zIndex: 10 }), "data-placement": placement },
            react_1.default.createElement(PopperContent, null,
                react_1.default.createElement(react_color_1.ChromePicker, { onChangeComplete: handleColorChange, color: color }),
                react_1.default.createElement(Actions, null,
                    react_1.default.createElement(style_guide_1.PrimaryButton, { mini: true, onClick: handleSave }, "Add color"),
                    react_1.default.createElement(style_guide_1.SecondaryButton, { mini: true, onClick: handleCancel }, "Cancel")))))))));
};
exports.ColorSelector = ColorSelector;
const Actions = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PopperContent = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.small};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  padding: ${(props) => props.theme.grid.unit * 2}px;

  .chrome-picker {
    box-shadow: none !important;
  }
`;
const AddButton = styled_components_1.default.button `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50%;
  width: ${(props) => props.theme.grid.unit * 4}px;
  height: ${(props) => props.theme.grid.unit * 4}px;
  margin: 2px;
  cursor: pointer;
  line-height: 0;
  font-size: ${(props) => props.theme.font.size.medium};

  :hover {
    border-color: ${(props) => props.theme.colors.border.secondary};
  }

  :focus {
    outline: none;
  }
`;
//# sourceMappingURL=ColorSelector.js.map