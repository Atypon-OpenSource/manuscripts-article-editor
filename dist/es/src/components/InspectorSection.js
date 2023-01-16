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
exports.InspectorSection = exports.Field = exports.Subheading = void 0;
const ArrowDownBlue_1 = __importDefault(require("@manuscripts/assets/react/ArrowDownBlue"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Metadata_1 = require("./metadata/Metadata");
const ApproveAllButton_1 = __importDefault(require("./track-changes/ApproveAllButton"));
const Section = styled_components_1.default.div `
  border-bottom: 1px solid ${(props) => props.theme.colors.border.tertiary};
  font-size: ${(props) => props.theme.font.size.normal};
  margin: ${(props) => props.theme.grid.unit * 6}px
    ${(props) => props.theme.grid.unit * 7}px 0;
`;
const Heading = styled_components_1.default.div `
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 2}px;
  cursor: pointer;
`;
const HeadingText = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.semibold};
  color: ${(props) => props.theme.colors.text.primary};
  flex: 1;
`;
exports.Subheading = styled_components_1.default(HeadingText) `
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.normal};
  margin-bottom: ${(props) => props.theme.grid.unit * 3}px;

  &:not(:first-child) {
    margin-top: ${(props) => props.theme.grid.unit * 6}px;
  }
`;
exports.Field = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
`;
const Content = styled_components_1.default.div `
  margin: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 8}px;
`;
const InspectorSection = ({ title, children, approveAll, }) => {
    const [expanded, setExpanded] = react_1.useState(true);
    const can = style_guide_1.usePermissions();
    return (react_1.default.createElement(Section, null,
        react_1.default.createElement(Heading, { onClick: () => setExpanded(!expanded) },
            react_1.default.createElement(HeadingText, null, title),
            approveAll && can.handleSuggestion && (react_1.default.createElement(ApproveAllButton_1.default, { approveAll: approveAll })),
            react_1.default.createElement(Metadata_1.ExpanderButton, { "aria-label": 'Toggle expand section', onClick: () => setExpanded(!expanded), style: {
                    transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                } },
                react_1.default.createElement(ArrowDownBlue_1.default, null))),
        expanded && react_1.default.createElement(Content, null, children)));
};
exports.InspectorSection = InspectorSection;
//# sourceMappingURL=InspectorSection.js.map