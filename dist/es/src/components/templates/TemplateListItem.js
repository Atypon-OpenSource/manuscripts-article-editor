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
exports.TemplateListItem = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const TemplateInfoLink_1 = require("./TemplateInfoLink");
const Heading = styled_components_1.default.div `
  display: flex;
  white-space: ${(props) => (props.selected ? 'normal' : 'nowrap')};
  ${(props) => props.selected && 'flex-wrap: wrap'};
  text-overflow: ellipsis;
  overflow-x: hidden;
`;
const Title = styled_components_1.default.div `
  align-items: center;
  display: flex;
  flex-wrap: ${(props) => (props.selected ? 'wrap' : 'nowrap')};
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: ${(props) => (props.selected ? 'normal' : 'nowrap')};
`;
const Description = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.normal};
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: ${(props) => (props.selected ? 'normal' : 'nowrap')};
`;
const PublisherName = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
  font-size: ${(props) => props.theme.font.size.normal};
  margin: ${(props) => props.theme.grid.unit * 2}px 0;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;
const TemplateActions = styled_components_1.default.div `
  display: ${(props) => (props.selected ? 'inline' : 'none')};
`;
const BundleTitle = styled_components_1.default.span `
  font-weight: ${(props) => props.theme.font.weight.bold};
  margin-right: ${(props) => props.theme.grid.unit}px;
`;
const Container = styled_components_1.default.button `
  border: 0;
  border-bottom: 1px solid;
  border-top: 1px solid;
  color: ${(props) => props.theme.colors.text.primary};
  cursor: pointer;
  font: inherit;
  position: relative;
  background-color: ${(props) => props.selected ? props.theme.colors.background.fifth : 'transparent'};
  border-color: ${(props) => props.selected
    ? props.theme.colors.border.primary + ' !important'
    : 'transparent'};
  outline: none;
  padding: 0 ${(props) => props.theme.grid.unit * 4}px;
  text-align: unset;
  width: 100%;

  &:hover,
  &:focus {
    background-color: ${(props) => props.theme.colors.background.fifth};
    border-color: ${(props) => props.theme.colors.border.tertiary};
  }
`;
const ContainerInner = styled_components_1.default.div `
  ${(props) => !props.selected &&
    'box-shadow: 0 1px 0 0 ' + props.theme.colors.border.tertiary};
  padding: ${(props) => props.theme.grid.unit * 4}px 0;
`;
const ArticleType = styled_components_1.default.span `
  color: ${(props) => props.theme.colors.text.secondary};
  ${(props) => props.selected && 'display: block; width: 100%; margin: 8px 0'};
`;
const InfoLinkContainer = styled_components_1.default.div `
  margin: 0 ${(props) => props.theme.grid.unit}px;
`;
const TemplateListItem = ({ articleType, item, publisher, selected, selectItem, template, title, }) => (react_1.default.createElement(Container, { onClick: () => selectItem(item), selected: selected },
    react_1.default.createElement(ContainerInner, { selected: selected },
        react_1.default.createElement(Heading, { selected: selected },
            react_1.default.createElement(Title, { selected: selected },
                react_1.default.createElement(BundleTitle, null, title)),
            react_1.default.createElement(TemplateActions, { selected: selected }, item.bundle && (react_1.default.createElement(InfoLinkContainer, null,
                react_1.default.createElement(TemplateInfoLink_1.TemplateInfoLink, { bundle: item.bundle })))),
            articleType && articleType !== title && (react_1.default.createElement(ArticleType, { selected: selected, "data-cy": 'article-type' }, articleType))),
        selected && publisher && publisher.name && (react_1.default.createElement(PublisherName, null, publisher.name)),
        selected && template && (template.desc || template.aim) && (react_1.default.createElement(Description, { selected: selected }, template.desc || template.aim)))));
exports.TemplateListItem = TemplateListItem;
//# sourceMappingURL=TemplateListItem.js.map