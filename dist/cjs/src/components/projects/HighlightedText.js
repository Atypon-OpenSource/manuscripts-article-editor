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
exports.HighlightedText = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Container = styled_components_1.default.div `
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  background-color: #ffe08b;
  margin: 16px;
`;
exports.HighlightedText = react_1.default.memo(({ comment, getHighlightTextColor, onClick }) => {
    if (!comment.originalText) {
        return null;
    }
    return (react_1.default.createElement(Container, { style: {
            // TODO: should change colour only if highlight markers are deleted?
            backgroundColor: getHighlightTextColor(comment),
        }, onClick: () => onClick && onClick(comment) }, comment.originalText.split('\n').map((item, index) => {
        return react_1.default.createElement("div", { key: index }, item);
    })));
});
//# sourceMappingURL=HighlightedText.js.map