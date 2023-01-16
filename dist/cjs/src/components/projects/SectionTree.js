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
const OutlineIconSection_1 = __importDefault(require("@manuscripts/assets/react/OutlineIconSection"));
const title_editor_1 = require("@manuscripts/title-editor");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const SectionList = styled_components_1.default.ul `
  list-style-type: none;
  margin-top: 0;
  padding-left: 1rem;
`;
const SectionTreeTitle = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-left: 0.2em;
  }
`;
const SectionListItem = styled_components_1.default.li `
  font-size: ${(props) => 1.2 - props.depth * 0.1}rem;
`;
const SectionTree = ({ data, depth = 0 }) => {
    if (depth > 7) {
        return null;
    }
    const childrenInOrder = Object.values(data.children).sort((a, b) => (a.priority || 0) - (b.priority || 0));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        !data.root && (react_1.default.createElement(SectionTreeTitle, null,
            react_1.default.createElement(OutlineIconSection_1.default, null),
            react_1.default.createElement(title_editor_1.Title, { value: data.title }))),
        childrenInOrder.length ? (react_1.default.createElement(SectionList, null, childrenInOrder.map((child) => (react_1.default.createElement(SectionListItem, { key: child._id, depth: depth },
            react_1.default.createElement(SectionTree, { data: child, depth: depth + 1 })))))) : null));
};
exports.default = SectionTree;
//# sourceMappingURL=SectionTree.js.map