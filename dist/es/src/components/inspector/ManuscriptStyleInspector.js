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
exports.ManuscriptStyleInspector = exports.InspectorValue = exports.InspectorLabel = exports.InspectorField = exports.ChooseButton = exports.CitationStyle = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const InspectorSection_1 = require("../InspectorSection");
exports.CitationStyle = styled_components_1.default(style_guide_1.TextField).attrs({ readOnly: true }) `
  border-right: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  cursor: pointer;
  font-size: ${(props) => props.theme.font.size.normal};
  overflow: hidden;
  padding-bottom: 2px;
  padding-top: 2px;
  text-overflow: ellipsis;
`;
exports.ChooseButton = styled_components_1.default(style_guide_1.TertiaryButton) `
  border-left: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-left: 1px solid;
  border-color: ${(props) => props.theme.colors.border.secondary} !important;
  margin: 0;
`;
exports.InspectorField = styled_components_1.default.div `
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;

  &:last-child {
    margin-bottom: 0;
  }
`;
exports.InspectorLabel = styled_components_1.default.div `
  flex-shrink: 0;
  width: 100px;
  color: ${(props) => props.theme.colors.text.secondary};
`;
exports.InspectorValue = styled_components_1.default.div `
  flex: 1;
  display: flex;
`;
const ManuscriptStyleInspector = ({ bundle, openCitationStyleSelector, }) => {
    return (react_1.default.createElement(InspectorSection_1.InspectorSection, { title: 'Manuscript' },
        react_1.default.createElement(exports.InspectorField, null,
            react_1.default.createElement(exports.InspectorLabel, null, "Citation Style"),
            react_1.default.createElement(exports.InspectorValue, { onClick: openCitationStyleSelector },
                react_1.default.createElement(exports.CitationStyle, { value: bundle ? bundle.csl.title : '' }),
                react_1.default.createElement(exports.ChooseButton, { mini: true }, "Choose")))));
};
exports.ManuscriptStyleInspector = ManuscriptStyleInspector;
//# sourceMappingURL=ManuscriptStyleInspector.js.map