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
exports.SidebarEmptyResult = void 0;
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const EmptyTextContainer = styled_components_1.default.div `
  padding-left: ${(props) => props.theme.grid.unit * 10}px;
  line-height: ${(props) => props.theme.font.lineHeight.large};
  max-width: 230px;
`;
const EmptyTextTitle = styled_components_1.default.div `
  margin-bottom: ${(props) => props.theme.grid.unit * 2}px;
  font-weight: ${(props) => props.theme.font.weight.bold};
`;
const SidebarText = styled_components_1.default.div `
  font-size: ${(props) => props.theme.font.size.medium};
  margin-bottom: ${(props) => props.theme.grid.unit * 8}px;
  margin-top: ${(props) => props.theme.grid.unit * 10}px;
`;
const SidebarButtonContainer = styled_components_1.default(style_guide_1.ButtonGroup) `
  flex-wrap: wrap;
  justify-content: flex-start;
  div,
  button {
    white-space: unset;
    width: 100%;
  }

  > div,
  > button {
    margin-bottom: ${(props) => props.theme.grid.unit * 4}px;
  }
`;
class SidebarEmptyResult extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.renderButton = (button, primary) => {
            return primary ? (react_1.default.createElement(style_guide_1.PrimaryButton, { onClick: button.action }, button.text)) : (react_1.default.createElement(style_guide_1.SecondaryButton, { onClick: button.action }, button.text));
        };
        this.renderTip = (button, primary) => {
            return (react_1.default.createElement(style_guide_1.Tip, { title: button.tip && button.tip.text, placement: button.tip && button.tip.placement }, this.renderButton(button, primary)));
        };
    }
    render() {
        const { primaryButton, secondaryButton, text } = this.props;
        return (react_1.default.createElement(EmptyTextContainer, null,
            react_1.default.createElement(SidebarText, { "data-cy": 'sidebar-text' },
                react_1.default.createElement(EmptyTextTitle, null, "No matches found."),
                text),
            react_1.default.createElement(SidebarButtonContainer, null,
                primaryButton &&
                    (primaryButton.tip
                        ? this.renderTip(primaryButton, true)
                        : this.renderButton(primaryButton, true)),
                secondaryButton &&
                    (secondaryButton.tip
                        ? this.renderTip(secondaryButton, false)
                        : this.renderButton(secondaryButton, false)))));
    }
}
exports.SidebarEmptyResult = SidebarEmptyResult;
//# sourceMappingURL=SidebarEmptyResult.js.map