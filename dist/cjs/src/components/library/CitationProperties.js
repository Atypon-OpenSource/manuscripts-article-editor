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
exports.CitationProperties = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const CitationProperties = ({ properties, setProperties }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(FormGroup, null,
            react_1.default.createElement(FormLabel, null, "Show"),
            react_1.default.createElement("select", { value: properties.displayScheme || 'show-all', onChange: (event) => setProperties(Object.assign(Object.assign({}, properties), { displayScheme: event.target.value })) },
                react_1.default.createElement("option", { value: 'show-all' }, "Authors and year"),
                react_1.default.createElement("option", { value: 'author-only' }, "Authors only"),
                react_1.default.createElement("option", { value: 'suppress-author' }, "No authors"),
                react_1.default.createElement("option", { value: 'composite' }, "Composite"))),
        react_1.default.createElement(FormGroup, null,
            react_1.default.createElement(FormLabel, null, "Prefix"),
            react_1.default.createElement(style_guide_1.TextField, { type: 'text', value: properties.prefix, onChange: (event) => setProperties(Object.assign(Object.assign({}, properties), { prefix: event.target.value })) })),
        react_1.default.createElement(FormGroup, null,
            react_1.default.createElement(FormLabel, null, "Suffix"),
            react_1.default.createElement(style_guide_1.TextField, { type: 'text', value: properties.suffix, onChange: (event) => setProperties(Object.assign(Object.assign({}, properties), { suffix: event.target.value })) })),
        properties.displayScheme === 'composite' && (react_1.default.createElement(FormGroup, null,
            react_1.default.createElement(FormLabel, null, "Infix"),
            react_1.default.createElement(style_guide_1.TextField, { type: 'text', value: properties.infix, onChange: (event) => setProperties(Object.assign(Object.assign({}, properties), { infix: event.target.value })) })))));
};
exports.CitationProperties = CitationProperties;
const FormGroup = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 4}px 0;
  display: flex;
  align-items: center;

  ${style_guide_1.TextField} {
    padding: 2px;
    flex: 1;
  }
`;
const FormLabel = styled_components_1.default.label `
  flex-shrink: 0;
  width: 50px;
`;
//# sourceMappingURL=CitationProperties.js.map