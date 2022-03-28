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
exports.TemplateEmpty = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
// const SadAnimal = React.lazy(() => import('./SadAnimal'))
const CategoryContainer = styled_components_1.default.span `
  font-weight: ${(props) => props.theme.font.weight.bold};
`;
// const ImageContainer = styled.span`
//   position: fixed;
//   top: 50%;
// `
const Container = styled_components_1.default.div `
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  width: 600px;
  max-width: 100%;
`;
const TextContainer = styled_components_1.default.div `
  max-width: 400px;
  font-size: ${(props) => props.theme.font.size.medium};
  color: ${(props) => props.theme.colors.text.primary};
  margin: 20px;
  text-align: center;
`;
const TemplateEmpty = ({ searchText, selectedCategoryName, createEmpty, }) => (react_1.default.createElement(Container, null, searchText ? (react_1.default.createElement(TextContainer, null,
    "No matching template for query",
    ' ',
    react_1.default.createElement(CategoryContainer, null, searchText),
    ".")) : (react_1.default.createElement(TextContainer, null,
    "No manuscript templates yet in the",
    ' ',
    react_1.default.createElement(CategoryContainer, null, selectedCategoryName),
    " category."))));
exports.TemplateEmpty = TemplateEmpty;
//# sourceMappingURL=TemplateEmpty.js.map