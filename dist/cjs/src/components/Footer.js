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
exports.Footer = exports.FooterLinkSeparator = exports.FooterLink = exports.FooterLinks = exports.FooterBlock = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const styled_components_1 = __importDefault(require("styled-components"));
exports.FooterBlock = styled_components_1.default('footer') `
  bottom: ${(props) => props.theme.grid.unit * 2}px;
  box-sizing: border-box;
  color: ${(props) => props.theme.colors.text.secondary};
  padding: ${(props) => props.theme.grid.unit * 5}px;
  position: absolute;
  width: 100%;
`;
exports.FooterLinks = styled_components_1.default('nav') `
  display: flex;
  justify-content: center;
`;
exports.FooterLink = styled_components_1.default(react_router_dom_1.Link) `
  color: inherit;
  display: inline-flex;
  padding: ${(props) => props.theme.grid.unit}px;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;
exports.FooterLinkSeparator = styled_components_1.default.span `
  display: inline-flex;
  padding: 0 ${(props) => props.theme.grid.unit}px;
`;
const Footer = ({ links }) => (react_1.default.createElement(exports.FooterBlock, null,
    react_1.default.createElement(exports.FooterLinks, null, links.map((link, index) => (react_1.default.createElement("span", { key: link.url },
        !!index && react_1.default.createElement(exports.FooterLinkSeparator, null, "|"),
        react_1.default.createElement(exports.FooterLink, { to: link.url }, link.text)))))));
exports.Footer = Footer;
//# sourceMappingURL=Footer.js.map