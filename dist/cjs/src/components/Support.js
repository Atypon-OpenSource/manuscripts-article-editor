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
exports.Support = void 0;
const Chat_1 = __importDefault(require("@manuscripts/assets/react/Chat"));
const Community_1 = __importDefault(require("@manuscripts/assets/react/Community"));
const Documentation_1 = __importDefault(require("@manuscripts/assets/react/Documentation"));
const Support_1 = __importDefault(require("@manuscripts/assets/react/Support"));
const style_guide_1 = require("@manuscripts/style-guide");
const react_1 = __importStar(require("react"));
const react_popper_1 = require("react-popper");
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importStar(require("styled-components"));
const config_1 = __importDefault(require("../config"));
const use_dropdown_1 = require("../hooks/use-dropdown");
const Updates_1 = require("./nav/Updates");
const Button = styled_components_1.default(style_guide_1.IconButton).attrs((props) => ({
    size: 56,
})) `
  color: ${(props) => props.theme.colors.text.secondary};
  padding: ${(props) => props.theme.grid.unit * 2}px;
`;
const StyledSupportIcon = styled_components_1.default(Support_1.default) `
  g {
    stroke: currentColor;
  }

  &:hover {
    g {
      stroke: #7fb5d5;
    }
  }
`;
const linkStyle = styled_components_1.css `
  display: flex;
  padding: ${(props) => props.theme.grid.unit * 2}px
    ${(props) => props.theme.grid.unit * 4}px;
  align-items: center;
  font-size: ${(props) => props.theme.font.size.normal};
  color: ${(props) => props.theme.colors.text.primary};
  text-decoration: none;

  &:hover {
    background: ${(props) => props.theme.colors.background.fifth};
  }
`;
const MenuLink = styled_components_1.default(react_router_dom_1.NavLink) `
  ${linkStyle}
`;
const ExternalMenuLink = styled_components_1.default.a.attrs({
    target: '_blank',
    rel: 'noopener noreferer',
}) `
  ${linkStyle}
`;
const MenuText = styled_components_1.default.div `
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`;
const Menu = styled_components_1.default.div `
  padding: ${(props) => props.theme.grid.unit * 2}px 0;
`;
const arrowTopBorderStyle = styled_components_1.css `
  bottom: -${(props) => props.theme.grid.unit * 2}px;
  border-top: ${(props) => props.theme.grid.unit * 2}px solid
    ${(props) => props.theme.colors.border.secondary};
`;
const arrowBottomBorderStyle = styled_components_1.css `
  top: -${(props) => props.theme.grid.unit * 2}px;
  border-bottom: ${(props) => props.theme.grid.unit * 2}px solid
    ${(props) => props.theme.colors.border.secondary};
`;
const Arrow = styled_components_1.default.div `
  width: 0;
  height: 0;
  border-left: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  border-right: ${(props) => props.theme.grid.unit * 2}px solid transparent;
  ${(props) => props['data-placement'] === 'top'
    ? arrowTopBorderStyle
    : arrowBottomBorderStyle};
  position: absolute;
`;
const Container = styled_components_1.default.div `
  position: relative;
`;
exports.Support = react_1.default.memo(() => {
    const { wrapperRef, toggleOpen, isOpen } = use_dropdown_1.useDropdown();
    const openChat = react_1.useCallback((event) => {
        event.preventDefault();
        window.$crisp.push(['do', 'chat:open']);
    }, []);
    return (react_1.default.createElement(react_popper_1.Manager, null,
        react_1.default.createElement("div", { ref: wrapperRef },
            react_1.default.createElement(react_popper_1.Reference, null, ({ ref }) => (react_1.default.createElement(Button, { ref: ref, onClick: toggleOpen },
                react_1.default.createElement(StyledSupportIcon, { width: 32, height: 32 })))),
            isOpen && (react_1.default.createElement(react_popper_1.Popper, { placement: 'top' }, ({ ref, style, placement, arrowProps }) => (react_1.default.createElement("div", { ref: ref, style: Object.assign(Object.assign({}, style), { zIndex: 3 }), "data-placement": placement },
                react_1.default.createElement(Container, null,
                    react_1.default.createElement(Updates_1.Popup, null,
                        react_1.default.createElement(Menu, null,
                            config_1.default.leanWorkflow.enabled || (react_1.default.createElement(ExternalMenuLink, { href: 'https://community.manuscripts.io/' },
                                react_1.default.createElement(Community_1.default, null),
                                react_1.default.createElement(MenuText, null, "Community"))),
                            react_1.default.createElement(ExternalMenuLink, { href: 'https://support.manuscripts.io/' },
                                react_1.default.createElement(Documentation_1.default, null),
                                react_1.default.createElement(MenuText, null, "Documentation")),
                            !config_1.default.leanWorkflow.enabled && config_1.default.crisp.id && (react_1.default.createElement(MenuLink, { to: '/chat', onClick: openChat },
                                react_1.default.createElement(Chat_1.default, { width: 22, height: 23 }),
                                react_1.default.createElement(MenuText, null, "Support"))))),
                    react_1.default.createElement(Arrow, Object.assign({}, arrowProps, { "data-placement": placement }))))))))));
});
//# sourceMappingURL=Support.js.map