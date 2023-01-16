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
exports.CitationStyleListItem = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CreateButton = styled_components_1.default(style_guide_1.PrimaryButton) `
  padding: 0 4px;
  font-size: ${(props) => props.theme.font.size.normal};

  &:focus {
    outline: none;
  }
`;
const Heading = styled_components_1.default.div `
  display: flex;
`;
const Title = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 0.5ch;
  overflow-x: hidden;
`;
const BundleTitle = styled_components_1.default.div `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  line-height: 34px;
`;
const Actions = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  flex-shrink: 0;
  visibility: hidden;
`;
const Container = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 3}px;
  margin: 0 ${(props) => props.theme.grid.unit * 3}px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
  cursor: pointer;
  position: relative;
  background-color: transparent;

  &:hover {
    background-color: ${(props) => props.theme.colors.background.info};

    ${Actions} {
      visibility: visible;
    }
  }
`;
const CitationStyleListItem = ({ item, selectBundle, }) => (react_1.default.createElement(Container, { onClick: (event) => {
        event.stopPropagation();
        selectBundle(item);
    } },
    react_1.default.createElement(Heading, null,
        react_1.default.createElement(Title, null,
            react_1.default.createElement(BundleTitle, null, item.csl.title)),
        react_1.default.createElement(Actions, null,
            react_1.default.createElement(CreateButton, null, "Select")))));
exports.CitationStyleListItem = CitationStyleListItem;
//# sourceMappingURL=CitationStyleListItem.js.map