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
exports.TemplateTopicsList = void 0;
const AddedIcon_1 = __importDefault(require("@manuscripts/assets/react/AddedIcon"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ListContainer = styled_components_1.default.div `
  position: relative;
  z-index: 2;
`;
const List = styled_components_1.default.div `
  border: 1px solid ${(props) => props.theme.colors.text.muted};
  border-radius: ${(props) => props.theme.grid.radius.default};
  box-shadow: ${(props) => props.theme.shadow.dropShadow};
  background: ${(props) => props.theme.colors.background.primary};
  height: 300px;
  max-height: 50vh;
  overflow-y: auto;
  position: absolute;
  right: 0;
`;
const ListSection = styled_components_1.default.div `
  display: flex;
  align-items: center;
  padding: ${(props) => props.theme.grid.unit * 2}px;
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.medium};
  color: ${(props) => props.theme.colors.text.primary};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.background.fifth};
  }
`;
const Separator = styled_components_1.default.div `
  height: 1px;
  opacity: 0.23;
  background-color: ${(props) => props.theme.colors.border.field.default};
`;
const AddedIconContainer = styled_components_1.default.span `
  display: inline-flex;
  width: ${(props) => props.theme.grid.unit * 8}px;
  height: 1em;
  align-items: center;
  justify-content: center;
`;
const Added = ({ visible }) => (react_1.default.createElement(AddedIconContainer, null, visible && react_1.default.createElement(AddedIcon_1.default, { width: 16, height: 16 })));
const TemplateTopicsList = ({ handleChange, options, value, }) => (react_1.default.createElement(ListContainer, { "data-cy": 'template-topics-list' },
    react_1.default.createElement(List, null,
        react_1.default.createElement(ListSection, { onClick: () => handleChange(undefined) },
            react_1.default.createElement(Added, { visible: !value }),
            "All Topics"),
        react_1.default.createElement(Separator, null),
        options
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((topic) => (react_1.default.createElement(ListSection, { key: topic._id, onClick: () => handleChange(topic) },
            react_1.default.createElement(Added, { visible: value ? value._id === topic._id : false }),
            topic.name))))));
exports.TemplateTopicsList = TemplateTopicsList;
//# sourceMappingURL=TemplateTopicsList.js.map