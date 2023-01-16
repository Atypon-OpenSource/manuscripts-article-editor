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
exports.AddButton = void 0;
const AddIcon_1 = __importDefault(require("@manuscripts/assets/react/AddIcon"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const RegularAddIcon = styled_components_1.default(AddIcon_1.default) ``;
const smallStyles = styled_components_1.css `
  font-size: ${(props) => props.theme.font.size.normal};
`;
const defaultStyles = styled_components_1.css `
  svg {
    max-height: 28px;
    max-width: 28px;
  }
`;
const mediumStyles = styled_components_1.css `
  font-size: ${(props) => props.theme.font.size.medium};
  svg {
    max-height: 36px;
    max-width: 36px;
  }
`;
const largeStyles = styled_components_1.css `
  font-size: ${(props) => props.theme.font.size.xlarge};
  svg {
    max-height: 40px;
    max-width: 40px;
  }
`;
const Action = styled_components_1.default(style_guide_1.IconTextButton) `
  font-size: ${(props) => props.theme.font.size.normal};
  text-overflow: ellipsis;

  ${(props) => props.size === 'small'
    ? smallStyles
    : props.size === 'medium'
        ? mediumStyles
        : props.size === 'large'
            ? largeStyles
            : defaultStyles};

  svg {
    margin: 0;
  }

  svg path {
    transition: fill 0.5s;
  }

  &:focus,
  &:hover {
    svg path:first-of-type {
      fill: #f7b314;
    }
  }
`;
const ActionTitle = styled_components_1.default.div `
  padding-left: ${(props) => props.theme.grid.unit * 3}px;
`;
const AddButton = ({ action, id, size, title, }) => (react_1.default.createElement(Action, { onClick: action, size: size, id: id },
    react_1.default.createElement(RegularAddIcon, { width: 40, height: 40 }),
    react_1.default.createElement(ActionTitle, null, title)));
exports.AddButton = AddButton;
//# sourceMappingURL=AddButton.js.map