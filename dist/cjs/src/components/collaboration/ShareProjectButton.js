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
const Share_1 = __importDefault(require("@manuscripts/assets/react/Share"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importDefault(require("react"));
const react_popper_1 = require("react-popper");
const styled_components_1 = __importDefault(require("styled-components"));
const ShareProjectPopperContainer_1 = __importDefault(require("./ShareProjectPopperContainer"));
const Container = styled_components_1.default.div `
  display: flex;
`;
const ShareIconButton = styled_components_1.default(style_guide_1.IconButton).attrs({
    size: 24,
}) `
  svg {
    text[fill],
    rect[fill],
    path[fill] {
      fill: ${(props) => props.theme.colors.brand.medium};
    }
    path[stroke] {
      stroke: ${(props) => props.theme.colors.brand.medium};
    }
  }
`;
class ShareProjectButton extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isOpen: false,
        };
        this.nodeRef = react_1.default.createRef();
        this.toggleOpen = () => {
            this.setOpen(!this.state.isOpen);
        };
        this.setOpen = (isOpen) => {
            this.setState({ isOpen });
            this.updateListener(isOpen);
        };
        this.handleClickOutside = (event) => {
            if (this.nodeRef.current &&
                !this.nodeRef.current.contains(event.target)) {
                this.setOpen(false);
            }
        };
        this.updateListener = (isOpen) => {
            if (isOpen) {
                document.addEventListener('mousedown', this.handleClickOutside);
            }
            else {
                document.removeEventListener('mousedown', this.handleClickOutside);
            }
        };
    }
    componentDidMount() {
        this.updateListener(this.state.isOpen);
    }
    render() {
        const { project, user, tokenActions } = this.props;
        const { isOpen } = this.state;
        return (react_1.default.createElement(Container, { ref: this.nodeRef, onClick: (event) => event.stopPropagation() },
            react_1.default.createElement(react_popper_1.Manager, null,
                react_1.default.createElement(style_guide_1.Tip, { title: "Share this project", placement: "right" },
                    react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(ShareIconButton, { ref: ref, onClick: this.toggleOpen, "aria-label": "Share project" },
                        react_1.default.createElement(Share_1.default, null))))),
                isOpen && (react_1.default.createElement(react_popper_1.Popper, { placement: 'bottom' }, (popperProps) => (react_1.default.createElement("div", null,
                    react_1.default.createElement(ShareProjectPopperContainer_1.default, { project: project, popperProps: popperProps, user: user, tokenActions: tokenActions }))))))));
    }
}
exports.default = ShareProjectButton;
//# sourceMappingURL=ShareProjectButton.js.map