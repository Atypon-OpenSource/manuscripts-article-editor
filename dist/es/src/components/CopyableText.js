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
exports.CopyableText = exports.StyledButton = void 0;
const clipboard_copy_1 = __importDefault(require("clipboard-copy"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
var CopyState;
(function (CopyState) {
    CopyState["Ready"] = "ready";
    CopyState["Copied"] = "copied";
    CopyState["Failed"] = "failed";
})(CopyState || (CopyState = {}));
exports.StyledButton = styled_components_1.default.button `
  background: transparent;
  border: none;
  font-size: inherit;
  color: ${(props) => props.copyState === CopyState.Failed
    ? props.theme.colors.text.error
    : props.theme.colors.text.info};
  display: inline;
  padding: 0;
  cursor: pointer;

  &:focus {
    outline: 1px solid
      ${(props) => props.theme.colors.button.default.color.hover};
  }
`;
const CopyableText = ({ handleCopy, children }) => {
    const [copyState, setCopyState] = react_1.useState(CopyState.Ready);
    const copy = react_1.useCallback((e) => {
        e.preventDefault();
        clipboard_copy_1.default(handleCopy() || '')
            .then(() => setCopyState(CopyState.Copied))
            .catch(() => setCopyState(CopyState.Failed));
    }, [handleCopy]);
    // reset the copy state if the text changes
    react_1.useEffect(() => {
        setCopyState(CopyState.Ready);
    }, [handleCopy]);
    return (react_1.default.createElement(exports.StyledButton, { type: "button", onClick: copy, copyState: copyState }, copyState === CopyState.Ready
        ? children
        : copyState === CopyState.Copied
            ? 'Copied!'
            : 'Failed to copy to clipboard'));
};
exports.CopyableText = CopyableText;
//# sourceMappingURL=CopyableText.js.map