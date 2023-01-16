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
exports.TemplateModalFooter = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ModalFooter = styled_components_1.default.div `
  box-shadow: 0 -2px 12px 0 rgba(216, 216, 216, 0.26);
  padding: 20px 32px;
  z-index: 1;
  margin-top: auto;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
`;
const FooterText = styled_components_1.default.div `
  flex: 1;
  font-size: ${(props) => props.theme.font.size.normal};
  font-weight: ${(props) => props.theme.font.weight.normal};
  line-height: 20px;
  max-width: 55%;

  @media (max-width: 767px) {
    margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
  }
`;
const SelectedTemplateDesc = styled_components_1.default.div `
  color: ${(props) => props.theme.colors.text.secondary};
`;
const SelectedTemplateDetails = styled_components_1.default.div `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;
const SelectedTemplateTitle = styled_components_1.default.span `
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.font.weight.medium};
`;
const SelectedTemplateType = styled_components_1.default.span `
  color: ${(props) => props.theme.colors.text.secondary};
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const FooterButtons = styled_components_1.default(style_guide_1.ButtonGroup) `
  flex: 1;
  @media (max-width: 767px) {
    justify-content: center;
  }
`;
const TemplateModalFooter = ({ createEmpty, selectTemplate, selectedTemplate, creatingManuscript, noTemplate, switchTemplate, }) => {
    return (react_1.default.createElement(ModalFooter, null,
        react_1.default.createElement(FooterText, null,
            react_1.default.createElement(SelectedTemplateDesc, null, noTemplate
                ? 'No template available'
                : selectedTemplate
                    ? 'Selected Template'
                    : 'Select a Template'),
            selectedTemplate && (react_1.default.createElement(SelectedTemplateDetails, null,
                react_1.default.createElement(SelectedTemplateTitle, null, selectedTemplate.title),
                selectedTemplate.articleType &&
                    selectedTemplate.articleType !== selectedTemplate.title && (react_1.default.createElement(SelectedTemplateType, null, selectedTemplate.articleType))))),
        react_1.default.createElement(FooterButtons, null,
            !switchTemplate && (react_1.default.createElement(style_guide_1.TertiaryButton, { onClick: createEmpty, disabled: creatingManuscript }, "Add Empty")),
            react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: selectTemplate, disabled: creatingManuscript || !selectedTemplate }, switchTemplate ? 'Update Manuscript' : 'Add Manuscript'))));
};
exports.TemplateModalFooter = TemplateModalFooter;
//# sourceMappingURL=TemplateModalFooter.js.map