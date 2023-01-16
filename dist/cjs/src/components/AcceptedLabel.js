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
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const TickMarkContainer = styled_components_1.default.div `
  display: flex;
  padding-right: ${(props) => props.theme.grid.unit}px;
`;
const Label = styled_components_1.default.div `
  align-items: center;
  background: ${(props) => props.theme.colors.text.success};
  border-radius: ${(props) => props.theme.grid.radius.small};
  color: ${(props) => props.theme.colors.text.onDark};
  display: flex;
  line-height: 1;
  opacity: ${(props) => props.opacity};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  transition: opacity 0.5s;
`;
class AcceptedLabel extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: 1,
            rendered: true,
        };
    }
    componentDidMount() {
        if (this.props.shouldFade) {
            setTimeout(() => {
                this.toggleVisibilityState();
            }, 5000);
        }
    }
    render() {
        const { backgroundColor, icon } = this.props;
        const { rendered, visible } = this.state;
        return (rendered && (react_1.default.createElement(Label, { style: { backgroundColor }, opacity: visible ? 1 : 0 },
            react_1.default.createElement(TickMarkContainer, null, icon || react_1.default.createElement(style_guide_1.TickMarkIcon, null)),
            react_1.default.createElement("span", null, this.props.children || 'accepted'))));
    }
    toggleVisibilityState() {
        this.setState({ visible: !this.state.visible });
        if (!this.state.visible) {
            setTimeout(() => {
                this.setState({ rendered: false });
            }, 1000);
        }
    }
}
exports.default = AcceptedLabel;
//# sourceMappingURL=AcceptedLabel.js.map